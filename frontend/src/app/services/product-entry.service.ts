// src/app/services/product-entry.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import type { ProductEntry, Product, Supplier } from '../models/product-entry.model';

@Injectable({
  providedIn: 'root',
})
export class ProductEntryService {
  private entryApiUrl = `${environment.apiUrl}/product-entry`;
  private productApiUrl = `${environment.apiUrl}/products`;
  private supplierApiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  // ================= ENTRADAS =================
  getEntries(): Observable<ProductEntry[]> {
    return this.http
      .get<{ entries: ProductEntry[] }>(this.entryApiUrl)
      .pipe(map(response => response.entries));
  }

  createEntry(entry: ProductEntry): Observable<ProductEntry> {
    return this.http.post<ProductEntry>(this.entryApiUrl, entry);
  }

  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.entryApiUrl}/${id}`);
  }

  // ================= PRODUTOS =================
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productApiUrl);
  }

  getProductById(id: number): Observable<Product | null> {
    if (isNaN(id)) return of(null);

    return this.http.get<Product>(`${this.productApiUrl}/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  // ================= FORNECEDORES =================
  getSupplierById(id: number): Observable<Supplier | null> {
    if (isNaN(id)) return of(null);

    return this.http.get<Supplier>(`${this.supplierApiUrl}/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  // ================= UTILITÁRIOS =================
  generateEntryId(productName: string): string {
    const initials = productName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();

    const randomNum = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, '0');

    const combined = (initials + randomNum)
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    return combined.substring(0, 6);
  }
}
