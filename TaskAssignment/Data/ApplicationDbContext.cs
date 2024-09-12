﻿using Microsoft.EntityFrameworkCore;
using TaskAssignment.Models;

namespace TaskAssignment.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Tasks> Tasks { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
