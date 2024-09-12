namespace TaskAssignment.Response
{
    public record class LoginResponse(bool flag,string message,string jwttoken=null!);
}
