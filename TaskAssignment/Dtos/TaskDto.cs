using System.ComponentModel.DataAnnotations;
using TaskAssignment.Models;

namespace TaskAssignment.Dtos
{
    public class TaskDto
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }
        [Required]
        [MaxLength(100)]
        public string Description { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        [Required]
        public string Priority { get; set; }
    }
}
