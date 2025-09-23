import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;
  constructor(private http: HttpClient) {}

  getMetrics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/metrics`);
  }

  getLastEntries(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/last-entries`);
  }

  getProductQuantities(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/product-quantities`);
  }
}
