export interface ProductEntry {
  id?: number
  productId: number
  productName?: string
  supplierId: number
  supplierName?: string
  entryDate: Date
  quantity: number
  unitValue: number
  totalValue?: number
  invoiceNumber: string
  observations?: string
  batch?: string
  expirationDate?: Date
  category?: string
}

export interface Product {
  id: string
  name: string
  category?: string
}

export interface Supplier {
  id: string
  name: string
}
