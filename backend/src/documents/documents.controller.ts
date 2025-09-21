import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDTO } from './dto/create-document.dto';
import { DocumentDTO } from './dto/document.dto';
import { DocumentFilter } from './dto/document-filter.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(@Body() dto: CreateDocumentDTO): Promise<DocumentDTO> {
    return this.documentsService.createDocument(dto);
  }

  // Atualizado para aceitar filtros via query params
  @Get()
  async findAll(@Query() query: DocumentFilter): Promise<DocumentDTO[]> {
    // encaminha os filtros para o service
    return this.documentsService.findWithFilters(query);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<DocumentDTO> {
    return this.documentsService.findById(+id);
  }
}
