// src/app/services/product-entry.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import type { ProductEntry, Product, Supplier } from '../models/product-entry.model';

@Injectable({
  providedIn: 'root',
})
export class ProductEntryService {
  private apiUrl = `${environment.apiUrl}/product-entry`;

  constructor(private http: HttpClient) {}

  // Entradas
  getEntries(): Observable<ProductEntry[]> {
    return this.http
      .get<{ entries: ProductEntry[] }>(this.apiUrl)
      .pipe(map(response => response.entries));
  }

  createEntry(entry: ProductEntry): Observable<ProductEntry> {
    return this.http.post<ProductEntry>(this.apiUrl, entry);
  }

  deleteEntry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Produtos
  getProducts(): Observable<Product[]> {
    return this.http
      .get<{ products: Product[] }>(`${this.apiUrl}/products`)
      .pipe(map(response => response.products));
  }

  // Fornecedores
  getSuppliers(): Observable<Supplier[]> {
    return this.http
      .get<{ suppliers: Supplier[] }>(`${this.apiUrl}/suppliers`)
      .pipe(map(response => response.suppliers));
  }

  // Geração de ID aleatório
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
