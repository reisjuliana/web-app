import { DocumentEntity } from './entities/document.entity';
import { DocumentDTO } from './dto/document.dto';

export function toDocumentDTO(entity: DocumentEntity): DocumentDTO {
  return {
    id: entity.id,
    filename: entity.filename,
    file_type: entity.file_type,
    upload_date: entity.upload_date,
    user_id: entity.user?.id,
    product_id: entity.product?.id,
    hash_sha256: entity.hash_sha256,
  };
}
