using System.ComponentModel.DataAnnotations;

namespace TaskAssignment.Dtos
{
    public class Register : AccountBase
    {

        [DataType(DataType.Password)]
        [Compare(nameof(Password))]

        [Required]
        [MaxLength(70)]
        public string Name { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
