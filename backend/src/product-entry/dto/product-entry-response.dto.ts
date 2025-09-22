export class ProductEntryResponseDto {
  id: number;
  productId: number;
  productName: string;
  supplierId: number;
  supplierName: string;
  entryDate: Date;
  quantity: number;
  unitValue: number;
  totalValue: number;
  invoiceNumber: string;
  batch: string;
  expirationDate: Date | null;
  category: string;
  observations: string;
}
