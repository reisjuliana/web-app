export class DocumentDTO {
  id: number;
  filename: string;
  file_type: 'pdf' | 'xml';
  upload_date: Date;
  user_id: number;
  product_id?: number;
  hash_sha256: string;
}
