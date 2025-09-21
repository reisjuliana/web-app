import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.scss'],
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
    MatTableModule,
    MatButtonModule,
  ],
  providers: [DatePipe],
})
export class DocumentManagementComponent implements OnInit {
  documents: Document[] = [];
  filteredDocuments: Document[] = [];

  productIdFilter = new FormControl('');
  productNameFilter = new FormControl('');
  filenameFilter = new FormControl('');
  filetypeFilter = new FormControl('');
  uploadDateFilter = new FormControl('');

  productNames = ['Produto A', 'Produto B', 'Produto C']; // Exemplo, pode vir da API
  filetypes = ['PDF', 'DOCX', 'XLSX']; // Exemplo

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    const filters: any = {};

    if (this.productIdFilter.value)
      filters.productId = this.productIdFilter.value;
    if (this.productNameFilter.value)
      filters.productName = this.productNameFilter.value;
    if (this.filenameFilter.value) filters.filename = this.filenameFilter.value;
    if (this.filetypeFilter.value) filters.filetype = this.filetypeFilter.value;
    if (this.uploadDateFilter.value) {
      const date = new Date(this.uploadDateFilter.value);
      filters.uploadDate = date.toISOString().split('T')[0];
    }

    this.documentService.getDocuments(filters).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.filteredDocuments = docs;
      },
      error: (err) => {
        console.error('Erro ao buscar documentos:', err);
      },
    });
  }

  download(doc: Document): void {
    this.documentService.downloadDocument(doc.id, doc.filename);
  }
}
