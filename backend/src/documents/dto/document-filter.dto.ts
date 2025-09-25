export interface DocumentFilter {
  id?: number;
  file_type?: 'pdf';
  filename?: string;
  product_id?: number;
  upload_date?: string; // Formato 'YYYY-MM-DD'
  user_id?: number;
}
