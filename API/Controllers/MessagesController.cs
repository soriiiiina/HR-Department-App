using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseController
    {
        private readonly IHRUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        public MessagesController(IHRUserRepository userRepository, IMapper mapper, 
            IMessageRepository messageRepository)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _messageRepository = messageRepository;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessageDTO createMessageDTO)
        {   
            //The username of the user that send the message
            var username = User.GetUsername();

            //If the username is the same as for the reciever of the message
            if (username == createMessageDTO.RecieverUsername.ToLower())
                return BadRequest("You can not sent messages to yourself");

            //Getting the HRUser that sends/recieves a message
            var sender = await _userRepository.GetHRUserByUsernameAsync(username);
            var reciever = await _userRepository
                .GetHRUserByUsernameAsync(createMessageDTO.RecieverUsername);

            if(reciever == null) return NotFound();

            //Create a new message
            var message = new Message
            {
                Sender = sender, 
                Reciever = reciever,
                SenderUsername = sender.UserName,
                RecieverUsername = reciever.UserName,
                Content = createMessageDTO.Content
            };

            //adding the message into the database
            _messageRepository.AddMessage(message);

            //returning the MessageDTO using automapper
            if(await _messageRepository.SaveAllAsync()) 
                return Ok(_mapper.Map<MessageDTO>(message));

                return BadRequest("Failed to send message!");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessagesForUser([FromQuery] 
            MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await _messageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, 
                 messages.TotalCount, messages.TotalPages);

            return messages;

        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();

            return Ok(await _messageRepository.GetMessageThread(currentUsername, username));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();
            var message = await _messageRepository.GetMessage(id);
            
            //if the sender or reciever's name is not the same as the currently logged in username
            if(message.Sender.UserName != username && message.Reciever.UserName != username)
                return Unauthorized();

            if (message.Sender.UserName == username) message.SenderDeletedTheMessage = true;

            if (message.Reciever.UserName == username) message.RecieverDeletedTheMessage = true;

            if(message.SenderDeletedTheMessage && message.RecieverDeletedTheMessage)
            _messageRepository.deleteMessage(message);

            if(await _messageRepository.SaveAllAsync()) return Ok();

            return BadRequest("Problem deletig the message");

        }

    }
}