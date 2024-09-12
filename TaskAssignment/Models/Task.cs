using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
        public Priority Priority { get; set; }
        [Required]
        public Status Status { get; set; }=Status.Pending;

        [ValidateNever]
        [JsonIgnore]
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
