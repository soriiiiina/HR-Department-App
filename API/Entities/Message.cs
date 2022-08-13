using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entities;

namespace API.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderUsername { get; set; }
        public HRUser Sender { get; set; }
        public int RecieverId { get; set; }
        public string RecieverUsername { get; set; }
        public HRUser Reciever { get; set; }

        //Message specific properties 
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.Now;
        //we will delete a message from the server, if both the sender and reciever deleted it
        public bool SenderDeletedTheMessage { get; set; }
        public bool RecieverDeletedTheMessage { get; set; }
    }
}