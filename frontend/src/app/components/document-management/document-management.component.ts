import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
import { DocumentService } from '../../services/document.service';
import { HttpClient } from '@angular/common/http';

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

  displayedColumns: string[] = [
    'filename',
    'id',
    'file_type',
    'upload_date',
    'download',
  ];

  constructor(
    private documentService: DocumentService,
    private http: HttpClient
  ) {}

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
      filters.filetype = this.filetypeFilter.value.trim().toLowerCase();
    }

    if (this.productIdFilter.value) {
      filters.product_id = this.productIdFilter.value;
    }

    this.documentService.getDocuments(filters).subscribe((data) => {
      this.documents = data;
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }

  downloadPdf(doc: { id: number; filename: string; file_type: string }) {
    this.documentService.downloadDocument(doc.id).subscribe({
      next: (fileBlob) => {
        // Cria o Blob com o tipo correto
        const blob = new Blob([fileBlob], {
          type:
            doc.file_type === 'pdf'
              ? 'application/pdf'
              : 'application/octet-stream',
        });

        // Cria a URL temporária para download
        const url = window.URL.createObjectURL(blob);

        // Cria um link "a" e dispara o download
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.filename || 'documento.pdf';
        a.click();

        // Libera memória
        window.URL.revokeObjectURL(url);

        console.log('Download iniciado para:', doc.filename);
      },
      error: (err) => console.error('Erro no download:', err),
    });
  }
}
