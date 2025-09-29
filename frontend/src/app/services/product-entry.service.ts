import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import type { Product, Supplier } from '../models/product-entry.model';
import { ProductEntryListDto } from '../components/product-entry/dto/list-product-entry.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductEntryService {
  private entryApiUrl = `${environment.apiUrl}/product-entry`;
  private productApiUrl = `${environment.apiUrl}/products`;
  private supplierApiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  // ================= ENTRADAS =================
  getEntries(): Observable<ProductEntryListDto[]> {
    return this.http.get<ProductEntryListDto[]>(
      `${environment.apiUrl}/product-entry`
    );
  }

  createEntry(formData: FormData) {
    return this.http.post<ProductEntryListDto>(
      `${environment.apiUrl}/product-entry`,
      formData
    );
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

    return this.http
      .get<Product>(`${this.productApiUrl}/${id}`)
      .pipe(catchError(() => of(null)));
  }

  // ================= FORNECEDORES =================
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.supplierApiUrl);
  }

  getSupplierById(id: number): Observable<Supplier | null> {
    if (isNaN(id)) return of(null);

    return this.http
      .get<Supplier>(`${this.supplierApiUrl}/${id}`)
      .pipe(catchError(() => of(null)));
  }

  // ================= UTILITÁRIOS =================
  generateEntryId(productName: string): string {
    const initials = productName
      .split(' ')
      .map((word) => word.charAt(0))
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
