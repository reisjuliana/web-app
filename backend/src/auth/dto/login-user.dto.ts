import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
