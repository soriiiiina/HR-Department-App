using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        private readonly IHRUserRepository _userRepository;
         private readonly IHubContext<PresenceHub> _presenceHub;
         private readonly PresenceTracker _tracker;
        public MessageHub(IMessageRepository messageRepository, IMapper mapper, 
            IHRUserRepository userRepository, IHubContext<PresenceHub> presenceHub,
            PresenceTracker tracker)
        {
            _presenceHub = presenceHub;
            _userRepository = userRepository;
            _mapper = mapper;
            _messageRepository = messageRepository;
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync() 
        {
            var httpContext = Context.GetHttpContext();

            var otherUser = httpContext.Request.Query["user"].ToString();

            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            
            await AddToGroup(Context, groupName);

            var messages = await _messageRepository
                .GetMessageThread(Context.User.GetUsername(), otherUser);

            await Clients.Group(groupName).SendAsync("RecieveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception) 
        {   
            await RemoveFromMessageGroup(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDTO createMessageDTO)
        {
            //The username of the user that send the message
            var username = Context.User.GetUsername();

            //If the username is the same as for the reciever of the message
            if (username == createMessageDTO.RecieverUsername.ToLower())
                throw new HubException("You can not sent messages to yourself");

            //Getting the HRUser that sends/recieves a message
            var sender = await _userRepository.GetHRUserByUsernameAsync(username);
            var reciever = await _userRepository
                .GetHRUserByUsernameAsync(createMessageDTO.RecieverUsername);

            if(reciever == null) throw new HubException("Not found user");

            //Create a new message
            var message = new Message
            {
                Sender = sender, 
                Reciever = reciever,
                SenderUsername = sender.UserName,
                RecieverUsername = reciever.UserName,
                Content = createMessageDTO.Content
            };

             var groupName = GetGroupName(sender.UserName, reciever.UserName);

             var group = await _messageRepository.GetMessageGroup(groupName);
            
            //if the users are in the same chat 
             if(group.Connections.Any(x => x.Username == reciever.UserName))
             {
                message.DateRead = DateTime.UtcNow;
             }
             else 
             {
                var connections = await _tracker.GetConnectionsForUsers(reciever.UserName);
                if(connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageRecieved",
                    new {username = sender.UserName});
                }
             }

            //adding the message into the database
            _messageRepository.AddMessage(message);

            //returning the MessageDTO using automapper
            if(await _messageRepository.SaveAllAsync()) {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDTO>(message));
            }
             
        }

        private async Task<bool> AddToGroup(HubCallerContext context, string groupName)
        {
            var group = await _messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

            if(group == null)
            {
                group = new Group(groupName);
                _messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            return await _messageRepository.SaveAllAsync();
        }

        private async Task RemoveFromMessageGroup(string connectionId) {
            var connection = await _messageRepository.GetConnection(connectionId);
            _messageRepository.RemoveConnection(connection);

            await _messageRepository.SaveAllAsync();
        }

        private string GetGroupName(string callerUser, string otherUser)
        {
            var stringCompare = string.CompareOrdinal(callerUser, otherUser) < 0;

            return stringCompare ? $"{callerUser}-{otherUser}" : $"{otherUser}-{callerUser}";
        }
    }
}