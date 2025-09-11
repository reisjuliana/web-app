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

// LIMPAR ARQUIVO DEPOIS

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
    // Busca o usuário diretamente pelo id
    const user: UserEntity = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.BAD_REQUEST);
    }

    // Converte para DTO
    return toUserDTO(user);
  }
  async createUser(userDTO: UserCreateDTO): Promise<UserDTO> {
    // console.log(userDTO);

    const { name, email, password } = userDTO;

    const userInDB = await this.usersRepository.findOne({
      where: { email },
    });
    if (userInDB) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    let user: UserEntity = new UserEntity();
    user.name = name;
    user.uid = uuid.v4();
    user.email = email;
    user.password = password;

    // MOCK
    // this.users.push(user);
    user = await this.usersRepository.save(user);

    // console.log(user);

    return toUserDTO(user);
  }

  async updateUser(id: number, userDTO: UserCreateDTO): Promise<UserDTO> {
    const { name, email, password } = userDTO;

    let user: UserEntity = new UserEntity();
    user.id = id;
    user.name = name;
    // user.uid = uid;
    user.email = email;
    user.password = password;

    // MOCK
    // for (let index = 0; index < users.length; index++) {
    //     const element = users[index];
    //     if (element.id === id) {
    //         users[index] = user;
    //     }
    // }
    user = await this.usersRepository.save(user);

    return toUserDTO(user);
  }

  async getAllUsers(): Promise<UserListDTO> {
    const list: UserListDTO = new UserListDTO();

    // Busca todos os usuários do banco
    const result: UserEntity[] = await this.usersRepository.find();

    // Converte cada UserEntity em UserDTO
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
      console.log('Usuário não encontrado para email:', email); // ajuste
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    console.log('Senha do usuário no DB (hash):', user.password); // ajuste
    console.log('Senha fornecida pelo login:', password); // ajuste

    // compare passwords
    const areEqual = await comparePasswords(user.password, password);
    console.log('Resultado da comparação de senhas:', areEqual); // ajuste

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return toUserDTO(user);
  }

  async findOne(options?: object): Promise<UserEntity> {
    const user = await this.usersRepository.findOne(options);
    // return toUserDto(user);
    return user;
  }

  async findByPayload({ uid }: any): Promise<UserDTO> {
    return toUserDTO(
      await this.findOne({
        where: { uid },
      }),
    );
  }
}
