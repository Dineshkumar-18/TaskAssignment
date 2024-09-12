using TaskAssignment.Dtos;
using TaskAssignment.Response;

namespace AeroFlex.Repository.Contracts
{
    public interface IAdminAccount 
    {
        Task<GeneralResponse> CreateAsync(Register register);
        Task<LoginResponse> SignInAsync(Login login);
    }
}
