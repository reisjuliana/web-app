import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDTO } from './dto/create-document.dto';
import { DocumentDTO } from './dto/document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(@Body() dto: CreateDocumentDTO): Promise<DocumentDTO> {
    return this.documentsService.createDocument(dto);
  }

  @Get()
  async findAll(): Promise<DocumentDTO[]> {
    return this.documentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<DocumentDTO> {
    return this.documentsService.findById(+id);
  }
}
