using System;


namespace TaskAssignment.Exceptions
{
    public class TaskNotFoundException : Exception
    {
        public TaskNotFoundException()
        {
        }

        public TaskNotFoundException(string message)
            : base(message)
        {
        }
    }
}
