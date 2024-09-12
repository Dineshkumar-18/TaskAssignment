using System.ComponentModel.DataAnnotations;

namespace TaskAssignment.Dtos
{
    public class Register : AccountBase
    {

        [Required]
        [MaxLength(70)]
        public string Name { get; set; }

        [DataType(DataType.Password)]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; }

    }
}
