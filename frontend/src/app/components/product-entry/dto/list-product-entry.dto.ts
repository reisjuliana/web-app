export interface ProductEntryListDto {
  id: number;
  productName: string;
  supplierName: string;
  entryDate: Date;
  quantity: number;
  unitValue: number;
  totalValue: number;
  invoiceNumber: string;
  batch?: string;
  category?: string;
}
