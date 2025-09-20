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
  entries = new MatTableDataSource<ProductEntry>([]);
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

  constructor(private fb: FormBuilder, private productEntryService: ProductEntryService) {
    this.entryForm = this.fb.group({
      productId: ["", Validators.required],
      productName: [""], // não obrigatório (permite inserir manualmente)
      supplierId: ["", Validators.required],
      supplierName: [""], // não obrigatório
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

    // observables de filtro (trata inputs string e objetos com segurança)
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
  }

  private loadData() {
    this.productEntryService.getProducts().subscribe({
      next: (products) => {
        this.products = products || [];
      },
      error: (e) => {
        console.error("Erro ao carregar produtos:", e);
        this.products = [];
      },
    });

    this.productEntryService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers || [];
      },
      error: (e) => {
        console.error("Erro ao carregar fornecedores:", e);
        this.suppliers = [];
      },
    });

    this.loadEntries();
  }

  private loadEntries() {
    this.productEntryService.getEntries().subscribe({
      next: (entries) => (this.entries.data = entries || []),
      error: (e) => console.error("Erro ao carregar entradas:", e),
    });
  }

  private setupFormSubscriptions() {
    // recalcula total quando quantidade ou unitValue mudam
    this.entryForm.get("quantity")?.valueChanges.subscribe(() => this.calculateTotal());
    this.entryForm.get("unitValue")?.valueChanges.subscribe(() => this.calculateTotal());

    // sempre que productId mudar tentamos preencher o nome (se achar no "banco")
    this.entryForm.get("productId")?.valueChanges.subscribe((productId) => {
      const product = this.products.find((p) => p.id === productId);
      if (product) {
        // só sobrescreve se for diferente (evita apagar edição manual)
        if (this.entryForm.get("productName")?.value !== product.name) {
          this.entryForm.patchValue({ productName: product.name }, { emitEvent: false });
        }
      } else {
        // não sobrescrever caso o usuário já tenha digitado um nome manual
      }
    });

    // supplier
    this.entryForm.get("supplierId")?.valueChanges.subscribe((supplierId) => {
      const supplier = this.suppliers.find((s) => s.id === supplierId);
      if (supplier) {
        if (this.entryForm.get("supplierName")?.value !== supplier.name) {
          this.entryForm.patchValue({ supplierName: supplier.name }, { emitEvent: false });
        }
      } else {
        // manter nome manual caso já tenha sido digitado
      }
    });
  }

  // tentativa de preencher ao perder o foco (útil quando usuário digita código e sai do campo)
  onProductIdBlur() {
    const productId = this.entryForm.get("productId")?.value;
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      this.entryForm.patchValue({ productName: product.name }, { emitEvent: false });
    }
  }

  onSupplierIdBlur() {
    const supplierId = this.entryForm.get("supplierId")?.value;
    const supplier = this.suppliers.find((s) => s.id === supplierId);
    if (supplier) {
      this.entryForm.patchValue({ supplierName: supplier.name }, { emitEvent: false });
    }
  }

  // quando opção é selecionada pelo autocomplete (função ligada ao (optionSelected) no template)
  onProductOptionSelected(selectedValue: string) {
    const product = this.products.find((p) => p.id === selectedValue);
    if (product) {
      this.entryForm.patchValue({ productId: product.id, productName: product.name }, { emitEvent: false });
    }
  }

  onSupplierOptionSelected(selectedValue: string) {
    const supplier = this.suppliers.find((s) => s.id === selectedValue);
    if (supplier) {
      this.entryForm.patchValue({ supplierId: supplier.id, supplierName: supplier.name }, { emitEvent: false });
    }
  }

  private calculateTotal() {
    const q = parseFloat(this.entryForm.get("quantity")?.value) || 0;
    const v = parseFloat(this.entryForm.get("unitValue")?.value) || 0;
    const total = q * v;
    // atualiza control (mesmo desabilitado, patchValue funciona)
    this.entryForm.patchValue({ totalValue: total.toFixed(2) }, { emitEvent: false });
  }

  private _filterProducts(value: string | Product | null): Product[] {
    const raw = value ?? "";
    const filterValue =
      typeof raw === "string"
        ? raw.toLowerCase()
        : (raw?.name || raw?.id || "").toLowerCase();
    return this.products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(filterValue) ||
        (p.id || "").toLowerCase().includes(filterValue),
    );
  }

  private _filterSuppliers(value: string | Supplier | null): Supplier[] {
    const raw = value ?? "";
    const filterValue =
      typeof raw === "string"
        ? raw.toLowerCase()
        : (raw?.name || raw?.id || "").toLowerCase();
    return this.suppliers.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(filterValue) ||
        (s.id || "").toLowerCase().includes(filterValue),
    );
  }

  // displayWith resiliente: aceita string (id) ou objeto
  displayProduct(value: Product | string | null): string {
    if (!value) return "";
    if (typeof value === "string") {
      const p = this.products.find((x) => x.id === value);
      return p ? `${p.id} - ${p.name}` : value;
    } else {
      return `${value.id} - ${value.name}`;
    }
  }

  displaySupplier(value: Supplier | string | null): string {
    if (!value) return "";
    if (typeof value === "string") {
      const s = this.suppliers.find((x) => x.id === value);
      return s ? `${s.id} - ${s.name}` : value;
    } else {
      return `${value.id} - ${value.name}`;
    }
  }

  onSubmit() {
  console.log("onSubmit chamado - form válido:", this.entryForm.valid);

  if (!this.entryForm.valid) {
    console.warn("Form inválido. Erros:");
    Object.keys(this.entryForm.controls).forEach((key) => {
      const c = this.entryForm.get(key);
      if (c && c.invalid) {
        console.warn(key, c.errors);
      }
    });
    return;
  }

  const formValue = this.entryForm.getRawValue();

  // monta payload conforme o DTO do backend
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

  console.log("Payload enviado ao backend:", payload);

  this.productEntryService.createEntry(payload).subscribe({
    next: (savedEntry) => {
      console.log("Entrada salva com sucesso:", savedEntry);
      this.loadEntries(); // atualiza tabela
      this.resetForm();
    },
    error: (err) => {
      console.error("Erro ao salvar entrada:", err);
      alert("Erro ao salvar: " + (err.error?.message || "Verifique os dados"));
    },
  });
}


  onCancel() {
    this.resetForm();
  }

  private resetForm() {
    this.entryForm.reset();
    this.entryForm.patchValue({ entryDate: new Date() });
  }

  deleteEntry(entry: ProductEntry) {
    if (entry.id && confirm("Tem certeza que deseja deletar esta entrada?")) {
      this.productEntryService.deleteEntry(entry.id).subscribe({
        next: () => {
          this.loadEntries();
        },
        error: (error) => {
          console.error("Error deleting entry:", error);
        },
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.entries.filter = filterValue.trim().toLowerCase();
  }

  // utilitário para debug (pode remover depois)
  debugForm() {
    console.log("Form valid:", this.entryForm.valid);
    console.log(this.entryForm);
  }
}
