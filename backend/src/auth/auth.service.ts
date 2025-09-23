import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { DEFAULT_EXPIRESIN } from './auth.module';
import { JwtPayload } from './dto/jwt-payload.interface';
import { LoginStatus } from './dto/login-status.interface';
import { RegistrationStatus } from './dto/registration-status.interface';
import { LoginUserDTO } from './dto/login-user.dto';
import { UserCreateDTO } from 'src/users/dto/user-create.dto';
import { UserDTO } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: UserCreateDTO): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };
    try {
      await this.usersService.createUser(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err.message || 'user registration failed',
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDTO): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(loginUserDto);

    const token = this._createToken(user);

    return {
      accessToken: token.accessToken,
      expiresIn: token.expiresIn,
      uid: user.uid,
    };
  }

  private _createToken({ uid }: UserDTO): any {
    const user: JwtPayload = { uid };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRESIN ? process.env.EXPIRESIN : DEFAULT_EXPIRESIN,
      accessToken,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDTO> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
