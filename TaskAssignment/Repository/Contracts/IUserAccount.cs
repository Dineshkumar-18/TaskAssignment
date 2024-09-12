using TaskAssignment.Dtos;
using TaskAssignment.Models;
using TaskAssignment.Response;

namespace AeroFlex.Repository.Contracts
{
    public interface IUserAccount
    {
        Task<GeneralResponse> CreateAsync(Register register);
        Task<LoginResponse> SignInAsync(Login login);
    }
}
