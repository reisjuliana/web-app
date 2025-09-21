import { UserEntity } from './entities/user.entity';
import { UserDTO } from './dto/user.dto';

export function toUserDTO(entity: UserEntity): UserDTO {
  const dto = new UserDTO();
  dto.id = entity.id;
  dto.uid = entity.uid;
  dto.name = entity.name;
  dto.email = entity.email;

  const cpf = entity.cpf.replace(/\D/g, '');
  dto.cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  return dto;
}
