import { Component, type OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ProductEntryService } from "../../services/product-entry.service";
import type { ProductEntry, Product, Supplier } from "../../models/product-entry.model";
import { type Observable, startWith, map } from "rxjs";
import { ProductEntryListDto } from './dto/list-product-entry.dto';

@Component({
  selector: "app-product-entry",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  templateUrl: "./product-entry.component.html",
  styleUrls: ["./product-entry.component.scss"],
})
export class ProductEntryComponent implements OnInit {
  entryForm: FormGroup;
  entries = new MatTableDataSource<ProductEntryListDto>([]);
  products: Product[] = [];
  suppliers: Supplier[] = [];
  filteredProducts!: Observable<Product[]>;
  filteredSuppliers!: Observable<Supplier[]>;

  displayedColumns: string[] = [
    "id",
    "productName",
    "supplierName",
    "entryDate",
    "quantity",
    "unitValue",
    "totalValue",
    "invoiceNumber",
    "actions",
  ];
  dataSource = new MatTableDataSource<ProductEntryListDto>();

  constructor(private fb: FormBuilder, private productEntryService: ProductEntryService) {
    this.entryForm = this.fb.group({
      productId: ["", Validators.required],
      productName: [""],
      supplierId: ["", Validators.required],
      supplierName: [""],
      entryDate: [new Date(), Validators.required],
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      unitValue: [null, [Validators.required, Validators.min(0.01)]],
      totalValue: [{ value: "", disabled: true }],
      invoiceNumber: ["", Validators.required],
      observations: [""],
      batch: [""],
      expirationDate: [""],
      category: [""],
    });

    this.filteredProducts = this.entryForm.get("productId")!.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterProducts(value)),
    );

    this.filteredSuppliers = this.entryForm.get("supplierId")!.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterSuppliers(value)),
    );
  }

  ngOnInit() {
    this.loadData();
    this.setupFormSubscriptions();

    // define filterPredicate para pesquisar em múltiplos campos
    this.entries.filterPredicate = (data: ProductEntryListDto, filter: string) => {
      const search = filter.trim().toLowerCase();
      return (
        (data.productName || "").toLowerCase().includes(search) ||
        (data.supplierName || "").toLowerCase().includes(search) ||
        (data.invoiceNumber || "").toLowerCase().includes(search)
      );
    };
  }

  private loadData() {
  this.productEntryService.getEntries().subscribe({
    next: (entries) => {
      this.entries.data = entries || [];
      console.log("Entradas carregadas:", this.entries.data); // debug
    },
    error: (e) => {
      console.error("Erro ao carregar entradas", e);
      this.entries.data = [];
    },
  });

  // continua carregando produtos
  this.productEntryService.getProducts().subscribe({
    next: (products) => (this.products = products || []),
    error: (e) => (this.products = []),
  });
}
  private loadEntries() {
    this.productEntryService.getEntries().subscribe({
      next: (entries) => (this.entries.data = entries || []),
      error: (e) => console.error("Erro ao carregar entradas:", e),
    });
  }

  private setupFormSubscriptions() {
    this.entryForm.get("quantity")?.valueChanges.subscribe(() => this.calculateTotal());
    this.entryForm.get("unitValue")?.valueChanges.subscribe(() => this.calculateTotal());

    // Produto
     this.entryForm.get("productId")?.valueChanges.subscribe((productId) => {
    if (!productId) {
      this.entryForm.patchValue({ productName: "" }, { emitEvent: false });
      return;
    }  
      
      const product = this.products.find((p) => p.id === productId);

      if (product) {
      // Produto encontrado localmente
      this.entryForm.patchValue({ productName: product.name }, { emitEvent: false });
    } else {
      // Produto não encontrado na lista local, limpa o campo (a verificação final será no blur)
      this.entryForm.patchValue({ productName: "" }, { emitEvent: false });
    }
  });

  // Fornecedor
    this.entryForm.get("supplierId")?.valueChanges.subscribe((supplierId) => {
      const supplier = this.suppliers.find((s) => s.id === supplierId);
      if (supplier && this.entryForm.get("supplierName")?.value !== supplier.name) {
        this.entryForm.patchValue({ supplierName: supplier.name }, { emitEvent: false });
      }
    });
  }

 onProductIdBlur() {
  const productIdNum = this.entryForm.get("productId")?.value;

  if (productIdNum == null || isNaN(productIdNum) || productIdNum <= 0) {
    alert("ID do produto inválido");
    this.entryForm.patchValue({ productId: null, productName: "" });
    return;
  }

  console.log("Buscando produto com id:", productIdNum);

  this.productEntryService.getProductById(productIdNum).subscribe({
    next: (product: Product | null) => {
      if (product) {
        this.entryForm.patchValue({ productName: product.name });
      } else {
        this.entryForm.patchValue({ productId: null, productName: "" });
        alert("Produto não encontrado. Cadastre antes de dar entrada.");
      }
    },
    error: (err: unknown) => {
      console.error("Erro ao buscar produto:", err);
      alert("Erro ao buscar produto. Tente novamente.");
    },
  });
}

 onSupplierIdBlur() {
  const supplierIdNum = this.entryForm.get("supplierId")?.value;

  if (supplierIdNum == null || isNaN(supplierIdNum) || supplierIdNum <= 0) {
    alert("ID do fornecedor inválido");
    this.entryForm.patchValue({ supplierId: null, supplierName: "" });
    return;
  }
  console.log("Buscando fornecedor com id:", supplierIdNum);

  this.productEntryService.getSupplierById(supplierIdNum).subscribe({
    next: (supplier) => {
      if (supplier) {
        this.entryForm.patchValue({ supplierName: supplier.name });
      } else {
        this.entryForm.patchValue({ supplierId: null, supplierName: "" });
        alert("Fornecedor não encontrado.");
      }
    },
    error: (err) => {
      console.error("Erro ao buscar fornecedor:", err);
      alert("Erro ao buscar fornecedor. Tente novamente.");
    },
  });
}

  onProductOptionSelected(selectedValue: string) {
    const product = this.products.find((p) => p.id === selectedValue);
    if (product) this.entryForm.patchValue({ productId: product.id, productName: product.name }, { emitEvent: false });
  }

onSupplierOptionSelected(selectedValue: number) {
  const supplier = this.suppliers.find(s => Number(s.id) === selectedValue);
  if (supplier) {
    this.entryForm.patchValue({ supplierId: supplier.id, supplierName: supplier.name }, { emitEvent: false });
  }
}

  private calculateTotal() {
    const q = parseFloat(this.entryForm.get("quantity")?.value) || 0;
    const v = parseFloat(this.entryForm.get("unitValue")?.value) || 0;
    this.entryForm.patchValue({ totalValue: (q * v).toFixed(2) }, { emitEvent: false });
  }

  private _filterProducts(value: string | Product | null): Product[] {
    const raw = value ?? "";
    const filterValue = typeof raw === "string" ? raw.toLowerCase() : (raw?.name || raw?.id || "").toLowerCase();
    return this.products.filter(p => (p.name || "").toLowerCase().includes(filterValue) || (p.id || "").toLowerCase().includes(filterValue));
  }

  private _filterSuppliers(value: string | Supplier | null): Supplier[] {
    const raw = value ?? "";
    const filterValue = typeof raw === "string" ? raw.toLowerCase() : (raw?.name || raw?.id || "").toLowerCase();
    return this.suppliers.filter(s => (s.name || "").toLowerCase().includes(filterValue) || (s.id || "").toLowerCase().includes(filterValue));
  }

  displayProduct(value: Product | string | null): string {
    if (!value) return "";
    if (typeof value === "string") {
      const p = this.products.find((x) => x.id === value);
      return p ? `${p.id} - ${p.name}` : value;
    }
    return `${value.id} - ${value.name}`;
  }

  displaySupplier(value: Supplier | string | null): string {
    if (!value) return "";
    if (typeof value === "string") {
      const s = this.suppliers.find((x) => x.id === value);
      return s ? `${s.id} - ${s.name}` : value;
    }
    return `${value.id} - ${value.name}`;
  }

  onSubmit() {
    if (!this.entryForm.valid) {
    this.entryForm.markAllAsTouched(); // marca todos como touched para mostrar os erros
    return;
    }

    const formValue = this.entryForm.getRawValue();
    const payload = {
      productId: formValue.productId,
      supplierId: formValue.supplierId,
      entryDate: formValue.entryDate,
      quantity: formValue.quantity,
      unitValue: formValue.unitValue,
      totalValue: formValue.totalValue,
      invoiceNumber: formValue.invoiceNumber,
      batch: formValue.batch || undefined,
      expirationDate: formValue.expirationDate || undefined,
      category: formValue.category || undefined,
      observations: formValue.observations || undefined,
    };

 this.productEntryService.createEntry(payload).subscribe({
  next: (savedEntryRaw) => {
    const savedEntry: ProductEntryListDto = {
      id: savedEntryRaw.id!, // garantir que não é undefined
      productName: savedEntryRaw.productName || '',
      supplierName: savedEntryRaw.supplierName ||'',
      entryDate: new Date(savedEntryRaw.entryDate),
      quantity: savedEntryRaw.quantity || 0,
      unitValue: savedEntryRaw.unitValue || 0,
      totalValue: savedEntryRaw.totalValue || 0,
      invoiceNumber: savedEntryRaw.invoiceNumber ||'',
      batch: savedEntryRaw.batch || '',
      category: savedEntryRaw.category || '',
      
    };

    // Adiciona no início da lista
    this.entries.data = [savedEntry, ...this.entries.data];

    // Reseta formulário
    this.resetForm();
  },
  error: (err) =>
    alert('Erro ao salvar: ' + (err.error?.message || 'Verifique os dados')),
});
  }
  onCancel() {
    this.resetForm();
  }

  private resetForm() {
    
  this.entryForm.reset({
    productId: null,
    productName: "",
    supplierId: null,
    supplierName: "",
    entryDate: new Date(),
    quantity: null,
    unitValue: null,
    totalValue: null,
    invoiceNumber: "",
    batch: "",
    expirationDate: null,
    category: "",
    observations: "",
  });

  // Garante que o formulário pareça “intocado”
  this.entryForm.markAsPristine();
  this.entryForm.markAsUntouched();
   Object.keys(this.entryForm.controls).forEach(key => {
    this.entryForm.get(key)?.updateValueAndValidity({ onlySelf: true });
   });
}

  deleteEntry(entry: ProductEntry) {
    if (entry.id && confirm("Tem certeza que deseja deletar esta entrada?")) {
      this.productEntryService.deleteEntry(entry.id).subscribe({
        next: () => this.loadEntries(),
        error: (error) => console.error("Error deleting entry:", error),
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.entries.filter = filterValue.trim().toLowerCase();
}
    applyFilterByInput(value: string) {
  this.entries.filter = value.trim().toLowerCase();
  
}
}
