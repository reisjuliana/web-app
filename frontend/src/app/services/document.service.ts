import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {}

  getDocuments(filters: any = {}): Observable<any[]> {
    let params = new HttpParams();

    if (filters.file_type) {
      params = params.set('file_type', filters.file_type);
    }

    if (filters.product_id) {
      params = params.set('product_id', filters.product_id);
    }

    if (filters.upload_date) {
      params = params.set('upload_date', filters.upload_date);
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }
}
