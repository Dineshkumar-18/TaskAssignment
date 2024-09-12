using System.ComponentModel.DataAnnotations;

namespace TaskAssignment.Dtos
{
    public class AccountBase
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
