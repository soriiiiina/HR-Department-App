using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext dataContext, IMapper mapper)
        {
            _mapper = mapper;
            _dataContext = dataContext;
        }

        public void AddGroup(Group group)
        {
            _dataContext.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            _dataContext.Messages.Add(message);
        }

        public void deleteMessage(Message message)
        {
            _dataContext.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _dataContext.Connections.FindAsync(connectionId);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _dataContext.Messages
                .Include(u => u.Sender)
                .Include(u => u.Reciever)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _dataContext.Groups
                .Include(x => x.Connections)
                .FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _dataContext.Messages
                .OrderByDescending(m => m.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch 
            {
                "Inbox" => query.Where(u => u.Reciever.UserName == messageParams.Username 
                    && u.RecieverDeletedTheMessage == false),
                "Outbox" => query.Where( u => u.Sender.UserName == messageParams.Username 
                    && u.SenderDeletedTheMessage == false),
                "Unread" => query.Where(u => u.Reciever.UserName == messageParams.Username 
                    && u.DateRead == null),
                _ => query.Where(u => u.Reciever.UserName == messageParams.Username 
                    && u.RecieverDeletedTheMessage == false
                    && u.DateRead == null)
            };
            
            //mapping into MessageDTO
            var messages = query.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider);

            return await PagedList<MessageDTO>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentUsername, 
            string recieverUsername)
        {   
            //get all the messages for 2 users
            var messages = await _dataContext.Messages 
                .Include(u => u.Sender).ThenInclude(p => p.Photo)
                .Include(u => u.Reciever).ThenInclude(p => p.Photo)
                .Where(m => m.Reciever.UserName == currentUsername && m.RecieverDeletedTheMessage == false
                       && m.Sender.UserName == recieverUsername
                       || m.Reciever.UserName == recieverUsername 
                       && m.Sender.UserName == currentUsername && m.SenderDeletedTheMessage == false
                )
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            //find out if there are any unread messages 
            var unreadMessages = messages.Where(m=> m.DateRead == null 
                && m.Reciever.UserName == currentUsername);

            //mark the unread messages as marked
            if(unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }

                await _dataContext.SaveChangesAsync();
            }

            //return the MessageDTO
            return _mapper.Map<IEnumerable<MessageDTO>>(messages);
        }

        public void RemoveConnection(Connection connection)
        {
            _dataContext.Connections.Remove(connection);
        }

        public async Task<bool> SaveAllAsync()
        {
            //greater than 0 means we will return a boolean 
            return await _dataContext.SaveChangesAsync() > 0;
        }
    }
}