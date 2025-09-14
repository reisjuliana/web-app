export interface User {
  id?: string
  nome: string
  email: string
  password?: string
  cpf: string
  sn_ativo: boolean
  created_at?: Date
  updated_at?: Date
  activationDate?: Date
}
