import { Controller, Post, Body, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDTO } from './dto/create-document.dto';
import { DocumentDTO } from './dto/document.dto';
import { DocumentFilter } from './dto/document-filter.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(@Body() dto: CreateDocumentDTO): Promise<DocumentDTO> {
    return this.documentsService.createDocument(dto);
  }

  @Get()
  async findAll(@Query() query: DocumentFilter): Promise<DocumentDTO[]> {
    // Encaminha os filtros para o service
    return this.documentsService.findWithFilters(query);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<DocumentDTO> {
    return this.documentsService.findById(+id);
  }

  @Get(':id/download')
  async download(@Param('id') id: number, @Res() res: Response) {
    const doc = await this.documentsService.getDocumentById(+id);
    if (!doc) {
      return res.status(404).send('Documento não encontrado');
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${doc.filename}"`,
      'Content-Length': doc.file_content.length,
    });

    res.end(doc.file_content);
  }
}
