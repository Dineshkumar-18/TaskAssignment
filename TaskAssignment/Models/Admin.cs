using System.ComponentModel.DataAnnotations;

namespace TaskAssignment.Models
{
    public class Admin
    {
        [Key]
        public int AdminId { get; set; }
        [Required]
        [MaxLength(70)]    
        public string AdminName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
