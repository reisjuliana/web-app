import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;
  constructor(private http: HttpClient) {}

  getDocuments(filters: any = {}): Observable<any[]> {
    let params = new HttpParams();

    if (filters.filename) {
      params = params.set('filename', filters.filename);
    }

    if (filters.id) {
      params = params.set('id', filters.id);
    }

    if (filters.upload_date) {
      params = params.set('upload_date', filters.upload_date);
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  downloadDocument(id: number) {
    return this.http.get(`${this.apiUrl}/${id}/download`, {
      responseType: 'blob',
    });
  }
}
