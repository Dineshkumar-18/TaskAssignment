using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskAssignment.Data;
using TaskAssignment.Dtos;
using TaskAssignment.Models;

namespace TaskAssignment.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Tasks
        [HttpGet]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult<IEnumerable<Tasks>>> GetTasks()
        {
            var tasks=await _context.Tasks
                   .Include(t => t.User) 
                   .Select(t => new TaskDto
                    {
                        UserId=t.UserId,
                        Title = t.Title,
                        Description = t.Description,
                        DueDate = t.DueDate,
                        Priority = t.Priority.ToString(),
                    }).ToListAsync();

            return Ok(tasks);
        }

        [HttpGet]
        [Route("taskbyuser/{userId}")]
        public async Task<ActionResult<IEnumerable<Tasks>>> GetTasksbyUserId(int userId)
        {
            var uId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            if (uId != userId) return Forbid("You are not allowed to view another user's tasks");

            var tasks = await _context.Tasks.Where(x => x.UserId == userId).ToListAsync();
            if (tasks == null || !tasks.Any())
            {
                return NotFound("Tasks are not assigned yet");
            }

            return Ok(tasks);
        }

        [HttpPut]
        [Route("updateStatus/users/{userId}/tasks/{taskId}")]
        public async Task<ActionResult> UpdateTaskStatus(int userId, int taskId)
        {
            var uId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            if (uId != userId) return Forbid("You are not allowed to update another user's tasks");

            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.UserId == userId && t.TaskId == taskId);
            if (task == null) return BadRequest($"Task not found for userId {userId}");

            task.Status = Status.Completed;
            _context.Update(task);
            await _context.SaveChangesAsync();
            return Ok("Status updated successfully");
        }


        [HttpGet]
        [Route("filterbypriority/{userId}")]
        public async Task<ActionResult> UserFilerByPriority([FromQuery] string priority,int userId)
        {
            var uId = int.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            if (uId != userId) return Forbid("You are not allowed to do in another user tasks");

            if (!Enum.TryParse<Priority>(priority, true, out var parsedPriority))
            {
                return BadRequest("Invalid priority value. Valid values are: Low, Medium, High.");
            }

            var tasks = await _context.Tasks
           .Where(t => t.Priority == parsedPriority && t.UserId == userId)
           .ToListAsync();

            return Ok(tasks);
        }


        [HttpGet]
        [Route("filterbypriority")]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> FilterByPriority([FromQuery] string priority)
        {

            if (!Enum.TryParse<Priority>(priority, true, out var parsedPriority))
            {
                return BadRequest("Invalid priority value. Valid values are: Low, Medium, High.");
            }

            var tasks = await _context.Tasks
           .Where(t => t.Priority == parsedPriority)
           .ToListAsync();

            return Ok(tasks);
        }

        // GET: api/Tasks/5
        [HttpGet("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult<Tasks>> GetTasks(int id)
        {
            var tasks = await _context.Tasks.FindAsync(id);

            if (tasks == null)
            {
                return NotFound();
            }

            return tasks;
        }

        // PUT: api/Tasks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> PutTasks(int id, Tasks tasks)
        {
            if (id != tasks.TaskId)
            {
                return BadRequest();
            }

            _context.Entry(tasks).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TasksExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Tasks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Tasks>> PostTasks(TaskDto taskDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == taskDto.UserId);
            if (user == null) return BadRequest("User not found");

            if (!Enum.TryParse<Priority>(taskDto.Priority, true, out var parsedPriority))
            {
                return BadRequest("Invalid priority value. Valid values are: Low, Medium, High.");
            }

            var task = new Tasks
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                DueDate = taskDto.DueDate,
                Priority = parsedPriority,
                UserId = taskDto.UserId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTasks", new { id = task.TaskId }, task);
        }

        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTasks(int id)
        {
            var tasks = await _context.Tasks.FindAsync(id);
            if (tasks == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(tasks);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TasksExists(int id)
        {
            return _context.Tasks.Any(e => e.TaskId == id);
        }
    }
}
