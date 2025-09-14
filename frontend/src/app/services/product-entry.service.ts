import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { ProductEntry, Product, Supplier } from "../models/product-entry.model"

@Injectable({
  providedIn: "root",
})
export class ProductEntryService {
  private apiUrl = "/api"

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`)
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/suppliers`)
  }

  getEntries(): Observable<ProductEntry[]> {
    return this.http.get<ProductEntry[]>(`${this.apiUrl}/entries`)
  }

  createEntry(entry: ProductEntry): Observable<ProductEntry> {
    return this.http.post<ProductEntry>(`${this.apiUrl}/entries`, entry)
  }

  deleteEntry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/entries/${id}`)
  }

  generateEntryId(productName: string): string {
    const initials = productName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
    const randomNum = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")
    const combined = (initials + randomNum)
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
    return combined.substring(0, 6)
  }
}
