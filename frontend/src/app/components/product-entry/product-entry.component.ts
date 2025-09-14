import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatTableModule, MatTableDataSource } from "@angular/material/table"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatAutocompleteModule } from "@angular/material/autocomplete"
import { MatCardModule } from "@angular/material/card"
import { MatChipsModule } from "@angular/material/chips"
import { MatTooltipModule } from "@angular/material/tooltip"
import { ProductEntryService } from "../../services/product-entry.service"
import type { ProductEntry, Product, Supplier } from "../../models/product-entry.model"
import { type Observable, startWith, map } from "rxjs"

@Component({
  selector: "app-product-entry",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, FormsModule,
    MatTableModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDatepickerModule, MatNativeDateModule,
    MatAutocompleteModule, MatCardModule,
    MatChipsModule, MatTooltipModule,
  ],
  templateUrl: "./product-entry.component.html",
  styleUrls: ["./product-entry.component.scss"],
})
export class ProductEntryComponent implements OnInit {
  entryForm: FormGroup
  entries = new MatTableDataSource<ProductEntry>()
  products: Product[] = []
  suppliers: Supplier[] = []
  filteredProducts!: Observable<Product[]>
  filteredSuppliers!: Observable<Supplier[]>

  displayedColumns: string[] = [
    "id", "productName", "supplierName", "entryDate", "quantity",
    "unitValue", "totalValue", "invoiceNumber", "actions",
  ]

  constructor(
    private fb: FormBuilder,
    private productEntryService: ProductEntryService,
  ) {
    this.entryForm = this.fb.group({
      productId: ["", Validators.required],
      productName: [{ value: "", disabled: true }],
      supplierId: ["", Validators.required],
      supplierName: [{ value: "", disabled: true }],
      entryDate: [new Date(), Validators.required],
      quantity: ["", [Validators.required, Validators.min(0.01)]],
      unitValue: ["", [Validators.required, Validators.min(0.01)]],
      totalValue: [{ value: "", disabled: true }],
      invoiceNumber: ["", Validators.required],
      observations: [""],
      batch: [""],
      expirationDate: [""],
      category: [""],
    })

    this.filteredProducts = this.entryForm.get("productId")!.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterProducts(value)),
    )

    this.filteredSuppliers = this.entryForm.get("supplierId")!.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterSuppliers(value)),
    )
  }

  ngOnInit() {
    this.loadData()
    this.setupFormSubscriptions()
  }

 
  private loadData() {
    this.productEntryService.getProducts().subscribe((products) => {
      this.products = products
    })

    this.productEntryService.getSuppliers().subscribe((suppliers) => {
      this.suppliers = suppliers
    })

    this.loadEntries()
  }

  private loadEntries() {
    this.productEntryService.getEntries().subscribe((entries) => {
      this.entries.data = entries
    })
  }

  private setupFormSubscriptions() {
    // Auto-calculate total value
    this.entryForm.get("quantity")?.valueChanges.subscribe(() => this.calculateTotal())
    this.entryForm.get("unitValue")?.valueChanges.subscribe(() => this.calculateTotal())

    // Auto-fill product name
    this.entryForm.get("productId")?.valueChanges.subscribe((productId) => {
      const product = this.products.find((p) => p.id === productId)
      if (product) {
        this.entryForm.patchValue({ productName: product.name })
      }
    })

    // Auto-fill supplier name
    this.entryForm.get("supplierId")?.valueChanges.subscribe((supplierId) => {
      const supplier = this.suppliers.find((s) => s.id === supplierId)
      if (supplier) {
        this.entryForm.patchValue({ supplierName: supplier.name })
      }
    })
  }

  private calculateTotal() {
    const quantity = this.entryForm.get("quantity")?.value || 0
    const unitValue = this.entryForm.get("unitValue")?.value || 0
    const total = quantity * unitValue
    this.entryForm.patchValue({ totalValue: total.toFixed(2) })
  }

  private _filterProducts(value: string): Product[] {
    const filterValue = value.toLowerCase()
    return this.products.filter(
      (product) => product.name.toLowerCase().includes(filterValue) || product.id.toLowerCase().includes(filterValue),
    )
  }

  private _filterSuppliers(value: string): Supplier[] {
    const filterValue = value.toLowerCase()
    return this.suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(filterValue) || supplier.id.toLowerCase().includes(filterValue),
    )
  }

  displayProduct(product: Product): string {
    return product ? `${product.id} - ${product.name}` : ""
  }

  displaySupplier(supplier: Supplier): string {
    return supplier ? `${supplier.id} - ${supplier.name}` : ""
  }

  onSubmit() {
    if (this.entryForm.valid) {
      const formValue = this.entryForm.getRawValue()
      const productName = formValue.productName

      const entry: ProductEntry = {
        ...formValue,
        id: this.productEntryService.generateEntryId(productName),
      }

      this.productEntryService.createEntry(entry).subscribe({
        next: () => {
          this.loadEntries()
          this.resetForm()
        },
        error: (error) => {
          console.error("Error creating entry:", error)
        },
      })
    }
  }

  onCancel() {
    this.resetForm()
  }

  private resetForm() {
    this.entryForm.reset()
    this.entryForm.patchValue({ entryDate: new Date() })
  }

  deleteEntry(entry: ProductEntry) {
    if (entry.id && confirm("Tem certeza que deseja deletar esta entrada?")) {
      this.productEntryService.deleteEntry(entry.id).subscribe({
        next: () => {
          this.loadEntries()
        },
        error: (error) => {
          console.error("Error deleting entry:", error)
        },
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.entries.filter = filterValue.trim().toLowerCase()
  }
}
