﻿using AeroFlex.Repository.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskAssignment.Dtos;

namespace TaskAssignment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountController(IUserAccount userRepository) : ControllerBase
    {
        [HttpPost]
        [Route("register")]
        public async Task<ActionResult> UserRegistration(Register register)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Model is invalid");
            }
            var userSuccessRegister = await userRepository.CreateAsync(register);
            return Ok(userSuccessRegister);
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> UserLogin(Login login)
        {
            if (!ModelState.IsValid) return BadRequest("Model is invalid");
            var userSuccessLogin = await userRepository.SignInAsync(login);
            return Ok(userSuccessLogin);
        }
    }
}
