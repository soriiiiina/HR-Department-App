using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    //we want this to be called HRUserPhoto in the database
    [Table("HRUserPhoto")]
    public class HRUserPhoto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool isMain { get; set; } 
        //defining the hruser entity inside of the photo entity
        public HRUser HRUser { get; set; }
        public int HRUserId { get; set; }
    }
}