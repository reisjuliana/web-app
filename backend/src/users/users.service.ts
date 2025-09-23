import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDTO } from '../auth/dto/login-user.dto';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserDTO } from './dto/user.dto';
import { UserListDTO } from './dto/user-list.dto';
import { UserEntity } from './entities/user.entity';
import { toUserDTO } from './mapper';
import * as uuid from 'uuid';
import { comparePasswords } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getOneUser(id: number): Promise<UserDTO> {
    return this.getUser(id);
  }

  async getUser(id: number): Promise<UserDTO> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return toUserDTO(user);
  }

  async createUser(userDTO: UserCreateDTO): Promise<UserDTO> {
    const userInDB = await this.usersRepository.findOne({ where: { email: userDTO.email } });
    if (userInDB) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user = this.usersRepository.create({
      ...this.mapUserDTO(userDTO),
      uid: uuid.v4(),
    });

    const saved = await this.usersRepository.save(user);
    return toUserDTO(saved);
  }

  async updateUser(id: number, userDTO: UserCreateDTO): Promise<UserDTO> {
    const user = await this.usersRepository.preload({
      id,
      ...this.mapUserDTO(userDTO),
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const saved = await this.usersRepository.save(user);
    return toUserDTO(saved);
  }

  async getAllUsers(): Promise<UserListDTO> {
    const list: UserListDTO = new UserListDTO();
    const result: UserEntity[] = await this.usersRepository.find();

    for (const user of result) {
      list.users.push(toUserDTO(user));
    }

    return list;
  }

  async deleteUser(id: number) {
    try {
      await this.usersRepository.delete(id);
    } catch (exception) {
      throw new HttpException(exception, HttpStatus.BAD_REQUEST);
    }
  }

  async findByLogin({ email, password }: LoginUserDTO): Promise<UserDTO> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await comparePasswords(user.password, password);
    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserDTO(user);
  }

  async findOne(options?: object): Promise<UserEntity> {
    return await this.usersRepository.findOne(options);
  }

  async findByPayload({ uid }: any): Promise<UserDTO> {
    return toUserDTO(await this.findOne({ where: { uid } }));
  }

  private mapUserDTO(dto: UserCreateDTO): Partial<UserEntity> {
    return {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      cpf: dto.cpf.replace(/\D/g, ''),
    };
  }
}
