import { IsEmail, IsString, Matches, IsPhoneNumber } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  /* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character */

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password' },
  )
  password: string;

  @IsPhoneNumber('US')
  mobile: string;
}
