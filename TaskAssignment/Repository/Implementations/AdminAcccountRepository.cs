﻿using AeroFlex.Repository.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskAssignment.Data;
using TaskAssignment.Dtos;
using TaskAssignment.Models;
using TaskAssignment.Response;

namespace AeroFlex.Repository.Implementations
{
    public class AdminAcccountRepository :IAdminAccount
    {
        private readonly ApplicationDbContext _context;
        private readonly IOptions<JwtSection> _config;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AdminAcccountRepository(ApplicationDbContext context, IOptions<JwtSection> config, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<GeneralResponse> CreateAsync(Register register)
        {
            if (register is null) return new GeneralResponse(false, "Model is invalid");

      
                var checkUserByEmail = await FindByEmail(register.Email);
                if (checkUserByEmail is not null)
                {
                    return new GeneralResponse(false, "Email already exist");
                }

            var admin = new Admin { 
                Email = register.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(register.Password),
                AdminName = register.Name,
                Role=RoleConstants.Admin,
            };

            await _context.Admins.AddAsync(admin);
            await _context.SaveChangesAsync(); // Ensure this line is awaited properly.

            return new GeneralResponse(true, "Admin Registered Successfully");
        }

        private async Task<Admin> FindByEmail(string email)
        {
            return await _context.Admins.FirstOrDefaultAsync(a => a.Email == email);
        }

        public async Task<LoginResponse> SignInAsync(Login login)
        {
            if (login == null) return new LoginResponse(false, "Model is invalid");

                var user = await _context.Admins
                          .FirstOrDefaultAsync(u => u.Email == login.Email);
                if (user == null)
                {
                    return new LoginResponse(false, "Email doesnot exist");
                }
                else if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
                {
                    return new LoginResponse(false, "Username or Password is invalid");
                }
                    
                    string jwtToken = GenerateJwtToken(user, RoleConstants.Admin);
                    AppendCookie(jwtToken);

                 
                   return new LoginResponse(true, "Login successfully", jwtToken);
        }

        private void AppendCookie(string jwtToken)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext != null)
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, 
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddHours(1) //  expiration time
                };

                httpContext.Response.Cookies.Append("AuthToken", jwtToken, cookieOptions);
            }
        }

        private string GenerateJwtToken(Admin user, string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.Value.Key!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,user.AdminId.ToString()),
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.Role,role)
            };

            var jwtToken = new JwtSecurityToken(
                issuer: _config.Value.Issuer,
                audience: _config.Value.Audience,
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
             );
            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}

