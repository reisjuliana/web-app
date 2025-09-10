import { UserEntity } from './entities/user.entity';
import { UserDTO } from './dto/user.dto';

export function toUserDTO(entity: UserEntity): UserDTO {
  const dto = new UserDTO();
  dto.id = entity.id;
  dto.uid = entity.uid;
  dto.name = entity.name;
  dto.email = entity.email;
  return dto;
}
