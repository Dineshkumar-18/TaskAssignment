using System.ComponentModel.DataAnnotations;

namespace TaskAssignment.Models
{

    public enum Priority
    {
        Low=1,
        Medium=2,
        High=3
    }
    public enum Status
    {
        Pending=1,
        In_Progress=2,
        Completed=3
    }
    public class Tasks
    {
        [Key]
        public int TaskId { get; set; }
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }
        [Required]
        [MaxLength(100)]
        public string Description { get; set; }
        [Required]
        public DateTime DueDate { get; set; }
        [Required]
        public Priority Priority { get; set; }
        [Required]
        public Status Status { get; set; }
    }
}
