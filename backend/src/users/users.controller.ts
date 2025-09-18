import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserDTO } from './dto/user.dto';
import { UserListDTO } from './dto/user-list.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  // @UseGuards(AuthGuard())
  async findAll(): Promise<UserListDTO> {
    const users = await this.userService.getAllUsers();
    return users;
  }

  @Get(':id')
  // @UseGuards(AuthGuard())
  async findOne(@Param('id') id: number): Promise<UserDTO> {
    return await this.userService.getOneUser(id);
  }

  @Post()
  async create(@Body() userCreateDTO: UserCreateDTO): Promise<UserDTO> {
    return await this.userService.createUser(userCreateDTO);
  }

  @Put(':id')
  // @UseGuards(AuthGuard())
  async update(@Param('id') id: number, @Body() userDTO: UserCreateDTO): Promise<UserDTO> {
    return await this.userService.updateUser(id, userDTO);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard())
  async delete(@Param('id') id: number) {
    await this.userService.deleteUser(id);
  }
}
