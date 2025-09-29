import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { CreateDocumentDTO } from './dto/create-document.dto';
import { DocumentDTO } from './dto/document.dto';
import { DocumentFilter } from './dto/document-filter.dto';
import { toDocumentDTO } from './mapper';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private documentsRepository: Repository<DocumentEntity>,
  ) {}

  async createDocument(dto: CreateDocumentDTO): Promise<DocumentDTO> {
    const doc = this.documentsRepository.create(dto);

    try {
      const saved = await this.documentsRepository.save(doc);
      return toDocumentDTO(saved);
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpException('Document already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findWithFilters(filters: DocumentFilter): Promise<DocumentDTO[]> {
    const query = this.documentsRepository
      .createQueryBuilder('doc')
      .leftJoinAndSelect('doc.user', 'user')
      .leftJoinAndSelect('doc.product', 'product');

    if (filters.file_type) {
      query.andWhere('doc.file_type = :file_type', { file_type: filters.file_type });
    }

    if (filters.user_id) {
      query.andWhere('user.id = :user_id', { user_id: Number(filters.user_id) });
    }

    if (filters.id) {
      query.andWhere('doc.id = :id', { id: Number(filters.id) });
    }

    if (filters.filename) {
      query.andWhere('LOWER(doc.filename) LIKE :filename', {
        filename: `%${filters.filename.toLowerCase()}%`,
      });
    }

    if (filters.upload_date) {
      query.andWhere('DATE(doc.upload_date) = :upload_date', { upload_date: filters.upload_date });
    }

    const docs = await query.getMany();
    return docs.map(toDocumentDTO);
  }

  async findById(id: number): Promise<DocumentDTO> {
    const doc = await this.documentsRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
    if (!doc) throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    return toDocumentDTO(doc);
  }

  async getDocumentById(id: number): Promise<DocumentEntity> {
    const document = await this.documentsRepository.findOne({ where: { id: id } });
    return document;
  }
}
