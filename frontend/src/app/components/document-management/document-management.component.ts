import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

// Service
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.scss'],
})
export class DocumentManagementComponent implements OnInit {
  documents: any[] = [];

  filetypeFilter = new FormControl('');
  productIdFilter = new FormControl('');
  uploadDateFilter = new FormControl('');

  // Ordem das colunas ajustada: Nome do arquivo, Produto, Tipo de arquivo, Upload
  displayedColumns: string[] = [
    'filename',
    'product_id',
    'file_type',
    'upload_date',
  ];

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();

    this.filetypeFilter.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.loadDocuments());

    this.productIdFilter.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.loadDocuments());

    this.uploadDateFilter.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.loadDocuments());
  }

  loadDocuments(): void {
    const filters: any = {};

    if (this.filetypeFilter.value) {
      filters.file_type = this.filetypeFilter.value.trim().toLowerCase();
    }

    if (this.productIdFilter.value) {
      filters.product_id = this.productIdFilter.value;
    }

    // uploadDate ainda não implementado no backend
    // if (this.uploadDateFilter.value) {
    //   filters.upload_date = this.uploadDateFilter.value
    //     .toISOString()
    //     .split('T')[0];
    // }

    this.documentService.getDocuments(filters).subscribe((data) => {
      this.documents = data;
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }
}
