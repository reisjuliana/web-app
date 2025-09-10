import { UserDTO } from './user.dto';
export class UserListDTO {
  users: UserDTO[];
  constructor() {
    this.users = [];
  }
}
