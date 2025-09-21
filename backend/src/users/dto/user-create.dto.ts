import { IsString, IsEmail, Length, Matches } from 'class-validator';

export class UserCreateDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF must be in the format XXX.XXX.XXX-XX' })
  cpf: string;
}
