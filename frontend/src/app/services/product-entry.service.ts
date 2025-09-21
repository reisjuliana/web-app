// src/app/services/product-entry.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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

  /// Produtos
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/products`);
}

// Buscar produto direto pelo ID no backend
getProductByCode(id: number): Observable<Product | null> {
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return of(null); // evita chamar backend com NaN
  }
  return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
    catchError(() => of(null)) // retorna null se não encontrado ou erro
  );
}

// Fornecedores
getSupplierById(id: string | number): Observable<Supplier | null> {
  const numericId = Number(id);
  if (isNaN(numericId)) return of(null);

  return this.http.get<Supplier>(`${this.apiUrl}/suppliers/${numericId}`).pipe(
    catchError(() => of(null))
  );
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
