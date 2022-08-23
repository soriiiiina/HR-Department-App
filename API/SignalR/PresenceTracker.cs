using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.SignalR
{
    public class PresenceTracker
    {   
        //the key is the users name, then we have a list of the users connection id
        private static readonly Dictionary<string, List<string>> OnlineUsers = 
            new Dictionary<string, List<string>>();

        public Task UserConnected(string username, string connectionId) 
        {   
            //locking the dictionary until we finish what is inside {}
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(username))
                {   //adding a new connection id
                    OnlineUsers[username].Add(connectionId);
                }
                else 
                {
                    OnlineUsers.Add(username, new List<string>{connectionId});
                }
            }

            return Task.CompletedTask;
        }

        public Task UserDiconnected(string username, string connectionId)
        {
            lock(OnlineUsers)
            {
                if(!OnlineUsers.ContainsKey(username)) return Task.CompletedTask;

                OnlineUsers[username].Remove(connectionId);
                if(OnlineUsers[username].Count == 0) 
                {
                    OnlineUsers.Remove(username);
                }
            }

            return Task.CompletedTask;
        }

        public Task<string[]> GetOnlineUsers() 
        {
            string[] onlineUsers; 
            lock(OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }
            
            return Task.FromResult(onlineUsers);
        }

        public Task<List<string>> GetConnectionsForUsers(string username)
        {
            List<string> connectionIds;
            lock(OnlineUsers)
            {
                connectionIds = OnlineUsers.GetValueOrDefault(username);
            }

            return Task.FromResult(connectionIds);
        }
    }
}