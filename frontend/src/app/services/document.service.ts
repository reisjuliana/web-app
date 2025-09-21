import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = 'http://localhost:3000/documents'; // Ajuste conforme sua API

  constructor(private http: HttpClient) {}

  getDocuments(filters: any = {}): Observable<Document[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get<Document[]>(this.apiUrl, { params });
  }

  downloadDocument(id: number, filename: string): void {
    this.http
      .get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' })
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
