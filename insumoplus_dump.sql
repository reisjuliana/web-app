-- -------------------------------------------------------------
-- Criar o banco de dados
-- -------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS insumoplus CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE insumoplus;

-- -------------------------------------------------------------
-- Tabela Users
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (uid, name, email, cpf, password)
VALUES
('vitor', 'Vítor', 'vitor@insumoplus.com', '123.456.789-01','123456'),
('joana', 'Joana', 'joana@insumoplus.com', '123.456.789-02','123456'),
('rafael', 'Rafael', 'rafael@insumoplus.com', '123.456.789-03','123456'),
('maria', 'Maria', 'maria@insumoplus.com', '123.456.789-04','123456'),
('lucas', 'Lucas', 'lucas@insumoplus.com', '123.456.789-05','123456');

-- -------------------------------------------------------------
-- Tabela Suppliers
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  cnpj CHAR(14) NULL,
  phone VARCHAR(30) NULL,
  email VARCHAR(120) NULL,
  UNIQUE KEY uq_suppliers_cnpj (cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO suppliers (name, cnpj, phone, email)
VALUES
('PlastiRecic LTDA', '11111111000101', '+55 (51) 1111-1111', 'contato@plastirecic.com'),
('EcoPlast S.A.', '22222222000102', '+55 (51) 2222-2222', 'vendas@ecoplast.com'),
('ReciclaBrasil', '33333333000103', '+55 (51) 3333-3333', 'comercial@reciclabrasil.com'),
('GreenPlastic', '44444444000104', '+55 (51) 4444-4444', 'contato@greenplastic.com'),
('PlastiNova', '55555555000105', '+55 (51) 5555-5555', 'vendas@plastinova.com');

-- -------------------------------------------------------------
-- Tabela Products
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  average_price DECIMAL(12,2) NULL,
  average_consumption DECIMAL(12,2) NULL,
  stock_quantity INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO products (name, description, average_price, average_consumption, stock_quantity)
VALUES
('PET reciclado', 'Polietileno tereftalato reciclado', 10.50, 500.00, 1000),
('PEAD reciclado', 'Polietileno de alta densidade reciclado', 8.20, 300.00, 800),
('PP reciclado', 'Polipropileno reciclado', 7.50, 400.00, 900),
('PVC reciclado', 'Policloreto de vinila reciclado', 9.00, 200.00, 500),
('PS reciclado', 'Poliestireno reciclado', 6.80, 150.00, 400),
('ABS reciclado', 'Acrilonitrila butadieno estireno reciclado', 12.00, 100.00, 300),
('PLA reciclado', 'Ácido polilático reciclado', 15.00, 50.00, 200),
('PET-G reciclado', 'PET-G reciclado para impressão 3D', 14.50, 60.00, 150),
('PEBD reciclado', 'Polietileno de baixa densidade reciclado', 7.00, 500.00, 700),
('PP homopolímero', 'Polipropileno homopolímero reciclado', 8.50, 250.00, 600);

-- -------------------------------------------------------------
-- Tabela Product Entries
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  supplier_id INT NOT NULL,
  entry_date DATE NULL,
  unitValue DECIMAL(12,4) NULL,
  quantity DECIMAL(18,3) NULL,
  invoice_number VARCHAR(50) NULL,
  totalValue DECIMAL(10,2) NULL,
  batch VARCHAR(50) NULL,
  category VARCHAR(80) NULL,
  observations TEXT NULL,
  document_id INT NULL,
  user_id INT NULL,
  CONSTRAINT fk_entry_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_entry_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  CONSTRAINT fk_entry_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO product_entries (product_id, supplier_id, entry_date, unitValue, quantity, totalValue, invoice_number, batch, category, observations, user_id)
VALUES
(1, 1, CURDATE(), 10.00, 1000, 10000, 'NF-10001', 'B001-PET', 'Plástico Reciclado', 'Entrada inicial PET', 1),
(2, 2, CURDATE(), 8.00, 800, 1600, 'NF-10002', 'B002-PEAD', 'Plástico Reciclado', 'Entrada inicial PEAD', 2),
(3, 3, CURDATE(), 7.00, 900, 6300, 'NF-10003', 'B003-PP', 'Plástico Reciclado', 'Entrada inicial PP', 3),
(4, 4, CURDATE(), 9.00, 500, 4500, 'NF-10004', 'B004-PVC', 'Plástico Reciclado', 'Entrada inicial PVC', 4),
(5, 5, CURDATE(), 6.00, 400, 2400, 'NF-10005', 'B005-PS', 'Plástico Reciclado', 'Entrada inicial PS', 5),
(6, 1, CURDATE(), 12.00, 300, 3600, 'NF-10006', 'B006-ABS', 'Plástico Reciclado', 'Entrada inicial ABS', 1),
(7, 2, CURDATE(), 15.00, 200, 3000, 'NF-10007', 'B007-PLA', 'Plástico Reciclado', 'Entrada inicial PLA', 2),
(8, 3, CURDATE(), 14.00, 150, 2100, 'NF-10008', 'B008-PETG', 'Plástico Reciclado', 'Entrada inicial PET-G', 3),
(9, 4, CURDATE(), 7.00, 700, 1400, 'NF-10009', 'B009-PEBD', 'Plástico Reciclado', 'Entrada inicial PEBD', 4),
(10, 5, CURDATE(), 8.00, 600, 4800, 'NF-10010', 'B010-PPH', 'Plástico Reciclado', 'Entrada inicial PP Homopolímero', 5);

-- -------------------------------------------------------------
-- Tabela Documents
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NULL,
  product_entry_id INT NULL,
  filename VARCHAR(150) NOT NULL,
  file_content BLOB NOT NULL,
  upload_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  file_type ENUM('pdf', 'xml') NULL,
  hash_sha256 CHAR(64) NOT NULL,
  user_id INT NOT NULL,
  INDEX idx_doc_type_date (file_type, upload_date),
  UNIQUE KEY uq_doc_hash (hash_sha256),
  CONSTRAINT fk_doc_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_doc_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_doc_product_entry FOREIGN KEY (product_entry_id) REFERENCES product_entries(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO documents (product_id, filename, file_content, file_type, hash_sha256, user_id)
VALUES
(1, 'PET_ficha_tecnica.pdf', 'PDF_BINARY_PLACEHOLDER', 'pdf', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 1),
(2, 'PEAD_manual.pdf', 'PDF_BINARY_PLACEHOLDER', 'pdf', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 2),
(3, 'PP_relatorio.xml', 'XML_BINARY_PLACEHOLDER', 'xml', 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', 3),
(4, 'PVC_ficha_tecnica.pdf', 'PDF_BINARY_PLACEHOLDER', 'pdf', 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 4),
(5, 'PS_manual.pdf', 'PDF_BINARY_PLACEHOLDER', 'pdf', 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', 5);
