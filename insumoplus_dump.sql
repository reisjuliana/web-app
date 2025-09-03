
-- =============================================================
-- Insumo+ - Dump de Banco de Dados (MySQL 8)
-- Data de geração: CURRENT_TIMESTAMP at runtime
-- Observações:
--  - Charset padrão: utf8mb4
--  - Engine: InnoDB
--  - Este script cria o schema, tabelas, FKs, índices, views, e dados iniciais.
--  - Compatível com MySQL 8.x (requer suporte a JSON e CHECK).
-- =============================================================

-- Se desejar trocar o nome do schema, altere aqui:
SET @SCHEMA_NAME := 'insumoplus';
SET @DEFAULT_CHARSET := 'utf8mb4';
SET @DEFAULT_COLLATION := 'utf8mb4_general_ci';

-- Segurança: evita erros se o schema já existir
DROP DATABASE IF EXISTS `insumoplus`;
CREATE DATABASE IF NOT EXISTS `insumoplus`
  CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_general_ci;
USE `insumoplus`;

-- -------------------------------------------------------------
-- Tabelas de Usuários, Perfis e Auditoria
-- -------------------------------------------------------------
CREATE TABLE perfil_acesso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(30) NOT NULL UNIQUE,
  descricao VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  sn_ativo BOOLEAN NOT NULL DEFAULT TRUE,
  auth_provider VARCHAR(30) NOT NULL DEFAULT 'local',        -- p.ex.: local, google, github, firebase
  auth_subject VARCHAR(191) NULL,                             -- id externo do provedor (sub)
  password_hash VARCHAR(255) NULL,                            -- usado se auth_provider = 'local'
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  last_login_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE usuario_perfil (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  perfil_id INT NOT NULL,
  UNIQUE KEY uq_usuario_perfil (usuario_id, perfil_id),
  CONSTRAINT fk_up_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  CONSTRAINT fk_up_perfil FOREIGN KEY (perfil_id) REFERENCES perfil_acesso(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE log_auditoria (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NULL,
  entidade VARCHAR(80) NOT NULL,
  acao ENUM('INSERT','UPDATE','DELETE','LOGIN','LOGOUT','CALCULO','UPLOAD') NOT NULL,
  dados JSON NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_log_entidade_acao (entidade, acao),
  CONSTRAINT fk_log_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -------------------------------------------------------------
-- Tabelas de Cadastros Básicos
-- -------------------------------------------------------------
CREATE TABLE fornecedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  cnpj CHAR(14) NULL,
  contato_nome VARCHAR(120) NULL,
  telefone VARCHAR(30) NULL,
  email VARCHAR(120) NULL,
  endereco TEXT NULL,
  UNIQUE KEY uq_fornecedor_cnpj (cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  cnpj CHAR(14) NULL,
  contato_nome VARCHAR(120) NULL,
  telefone VARCHAR(30) NULL,
  email VARCHAR(120) NULL,
  endereco TEXT NULL,
  UNIQUE KEY uq_cliente_cnpj (cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  tipo VARCHAR(50) NULL,
  preco_unitario DECIMAL(12,2) NULL,
  descricao TEXT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE insumos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  tipo VARCHAR(50) NULL,
  unidade_medida VARCHAR(20) NOT NULL DEFAULT 'UN',     -- ex.: KG, L, UN
  custo_unitario DECIMAL(12,4) NULL,
  quantidade_ideal DECIMAL(18,3) NULL,
  descricao TEXT NULL,
  fornecedor_id INT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT fk_insumo_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Mapeamento de composição (BOM) Insumo -> Produto (UC_502)
CREATE TABLE insumo_produto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  insumo_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade DECIMAL(18,3) NOT NULL,
  parametros_uso JSON NULL,
  UNIQUE KEY uq_insumo_produto (insumo_id, produto_id),
  CONSTRAINT fk_ip_insumo FOREIGN KEY (insumo_id) REFERENCES insumos(id),
  CONSTRAINT fk_ip_produto FOREIGN KEY (produto_id) REFERENCES produtos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -------------------------------------------------------------
-- Ordem de Compra / Pedido e Itens
-- -------------------------------------------------------------
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('COMPRA','VENDA') NOT NULL DEFAULT 'COMPRA',
  cliente_id INT NULL,           -- usado quando tipo = VENDA
  fornecedor_id INT NULL,        -- usado quando tipo = COMPRA
  usuario_id INT NOT NULL,       -- criador
  data_emissao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('ABERTO','APROVADO','RECEBIDO','CANCELADO') NOT NULL DEFAULT 'ABERTO',
  numero_nf VARCHAR(60) NULL,
  chave_nfe VARCHAR(44) NULL,
  observacao TEXT NULL,
  INDEX idx_pedidos_tipo_status (tipo, status),
  CONSTRAINT fk_ped_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  CONSTRAINT fk_ped_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
  CONSTRAINT fk_ped_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  UNIQUE KEY uq_ped_chave_nfe (chave_nfe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Item do pedido pode referenciar um produto ou um insumo
CREATE TABLE itens_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NULL,
  insumo_id INT NULL,
  quantidade DECIMAL(18,3) NOT NULL,
  preco_unitario DECIMAL(12,2) NULL,
  observacao VARCHAR(255) NULL,
  CONSTRAINT fk_itped_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_itped_produto FOREIGN KEY (produto_id) REFERENCES produtos(id),
  CONSTRAINT fk_itped_insumo FOREIGN KEY (insumo_id) REFERENCES insumos(id),
  -- CHECK Mínimo: ao menos um dos dois (produto ou insumo)
  CONSTRAINT chk_itped_item CHECK ( (produto_id IS NOT NULL) OR (insumo_id IS NOT NULL) )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -------------------------------------------------------------
-- Movimentação de Insumo e Transferências
-- -------------------------------------------------------------
CREATE TABLE movimentacoes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('ENTRADA','SAIDA','TRANSFERENCIA','PRODUCAO','AJUSTE_POS','AJUSTE_NEG') NOT NULL,
  data_mov DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  insumo_id INT NOT NULL,
  quantidade DECIMAL(18,3) NOT NULL,
  usuario_id INT NOT NULL,
  origem_tipo ENUM('FORNECEDOR','CLIENTE','ESTOQUE','PRODUCAO','OUTRO') NULL,
  origem_id INT NULL,
  destino_tipo ENUM('FORNECEDOR','CLIENTE','ESTOQUE','PRODUCAO','OUTRO') NULL,
  destino_id INT NULL,
  pedido_id INT NULL,
  item_pedido_id INT NULL,
  observacao VARCHAR(255) NULL,
  INDEX idx_mov_insumo_data (insumo_id, data_mov),
  INDEX idx_mov_tipo (tipo),
  CONSTRAINT fk_mov_insumo FOREIGN KEY (insumo_id) REFERENCES insumos(id),
  CONSTRAINT fk_mov_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  CONSTRAINT fk_mov_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  CONSTRAINT fk_mov_item FOREIGN KEY (item_pedido_id) REFERENCES itens_pedido(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- View de saldo de estoque por insumo (evita inconsistência de triggers)
CREATE OR REPLACE VIEW vw_saldo_insumo AS
SELECT
  i.id AS insumo_id,
  i.nome AS insumo,
  COALESCE(SUM(
    CASE
      WHEN m.tipo IN ('ENTRADA','AJUSTE_POS') OR m.destino_tipo = 'ESTOQUE' THEN m.quantidade
      WHEN m.tipo IN ('SAIDA','AJUSTE_NEG') OR m.origem_tipo = 'ESTOQUE' THEN -m.quantidade
      ELSE 0
    END
  ), 0) AS saldo
FROM insumos i
LEFT JOIN movimentacoes m ON m.insumo_id = i.id
GROUP BY i.id, i.nome;

-- -------------------------------------------------------------
-- Balanço de Massa, Regras e Vínculo com Movimentações
-- -------------------------------------------------------------
CREATE TABLE regras_calculo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  parametros JSON NULL, -- ex: {"tolerancia_perda": 0.03}
  ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE balanco_massa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_ref DATE NOT NULL,
  regra_id INT NOT NULL,
  qtd_recebida DECIMAL(18,3) NOT NULL DEFAULT 0,
  qtd_utilizada DECIMAL(18,3) NOT NULL DEFAULT 0,
  perdas DECIMAL(18,3) NOT NULL DEFAULT 0,
  resultado JSON NULL, -- ex: {"saldo": 10.5, "eficiencia": 0.97}
  criado_por INT NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bal_regra FOREIGN KEY (regra_id) REFERENCES regras_calculo(id),
  CONSTRAINT fk_bal_usuario FOREIGN KEY (criado_por) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE movimentacao_balanco (
  id INT AUTO_INCREMENT PRIMARY KEY,
  balanco_id INT NOT NULL,
  movimentacao_id BIGINT NOT NULL,
  CONSTRAINT fk_mb_balanco FOREIGN KEY (balanco_id) REFERENCES balanco_massa(id) ON DELETE CASCADE,
  CONSTRAINT fk_mb_mov FOREIGN KEY (movimentacao_id) REFERENCES movimentacoes(id) ON DELETE CASCADE,
  UNIQUE KEY uq_mb (balanco_id, movimentacao_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -------------------------------------------------------------
-- Documentos e Relatórios
-- -------------------------------------------------------------
CREATE TABLE documentos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  mime_type VARCHAR(100) NULL,
  tamanho_bytes BIGINT NULL,
  url VARCHAR(255) NULL,            -- se armazenado externamente
  conteudo LONGBLOB NULL,           -- se armazenado no banco (opcional)
  hash_sha256 CHAR(64) NULL,
  data_upload DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT NOT NULL,
  relacionado_tipo ENUM('INSUMO','PRODUTO','PEDIDO','MOVIMENTACAO','OUTRO') NULL,
  relacionado_id BIGINT NULL,
  INDEX idx_doc_tipo_data (tipo, data_upload),
  UNIQUE KEY uq_doc_hash (hash_sha256),
  CONSTRAINT fk_doc_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE relatorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  descricao VARCHAR(255) NULL,
  filtro JSON NULL,
  formato ENUM('PDF','EXCEL','CSV','HTML') NOT NULL DEFAULT 'PDF',
  data_geracao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  usuario_gerador INT NOT NULL,
  conteudo LONGBLOB NULL,
  CONSTRAINT fk_rel_usuario FOREIGN KEY (usuario_gerador) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -------------------------------------------------------------
-- Triggers simples de auditoria (exemplo)
-- -------------------------------------------------------------
DELIMITER $$
CREATE TRIGGER trg_log_usuarios_ins
AFTER INSERT ON usuarios FOR EACH ROW
BEGIN
  INSERT INTO log_auditoria (usuario_id, entidade, acao, dados)
  VALUES (NEW.id, 'usuarios', 'INSERT', JSON_OBJECT('id', NEW.id, 'email', NEW.email));
END $$

CREATE TRIGGER trg_log_mov_ins
AFTER INSERT ON movimentacoes FOR EACH ROW
BEGIN
  INSERT INTO log_auditoria (usuario_id, entidade, acao, dados)
  VALUES (NEW.usuario_id, 'movimentacoes', 'INSERT',
          JSON_OBJECT('id', NEW.id, 'tipo', NEW.tipo, 'insumo_id', NEW.insumo_id, 'qtd', NEW.quantidade));
END $$
DELIMITER ;

-- -------------------------------------------------------------
-- Dados Iniciais
-- -------------------------------------------------------------
INSERT INTO perfil_acesso (nome, descricao) VALUES
  ('ADMINISTRADOR', 'Acesso total ao sistema'),
  ('OPERACIONAL', 'Operações do dia a dia'),
  ('GERENTE', 'Acesso a relatórios e configurações de relatórios'),
  ('AUDITOR', 'Consulta e auditoria');

INSERT INTO usuarios (nome, email, sn_ativo, auth_provider, password_hash)
VALUES
  ('Admin', 'admin@insumo.plus', TRUE, 'local', '$2y$10$hashfakeapenasparademo'),
  ('Operador', 'operador@insumo.plus', TRUE, 'local', '$2y$10$hashfakeapenasparademo');

-- vincula perfis
INSERT INTO usuario_perfil (usuario_id, perfil_id)
SELECT u.id, p.id FROM usuarios u JOIN perfil_acesso p ON p.nome = 'ADMINISTRADOR' WHERE u.email='admin@insumo.plus';
INSERT INTO usuario_perfil (usuario_id, perfil_id)
SELECT u.id, p.id FROM usuarios u JOIN perfil_acesso p ON p.nome = 'OPERACIONAL' WHERE u.email='operador@insumo.plus';

-- Cadastros básicos
INSERT INTO fornecedores (nome, cnpj, contato_nome, telefone, email) VALUES
  ('Fornecedor A', '12345678000100', 'Contato A', '51999990000', 'contatoA@forn.com');
INSERT INTO clientes (nome, cnpj, contato_nome, telefone, email) VALUES
  ('Cliente X', '00987654000199', 'Contato X', '51988880000', 'contatoX@cli.com');

INSERT INTO insumos (nome, tipo, unidade_medida, custo_unitario, quantidade_ideal, descricao, fornecedor_id)
VALUES
  ('Insumo 502 Exemplo', 'Quimico', 'KG', 10.5000, 500.000, 'Insumo usado no UC_502', 1);

INSERT INTO produtos (nome, tipo, preco_unitario, descricao) VALUES
  ('Produto P1', 'Acabado', 199.90, 'Produto final P1');

INSERT INTO insumo_produto (insumo_id, produto_id, quantidade, parametros_uso)
VALUES (1, 1, 2.500, JSON_OBJECT('temperatura','120C','tempo_min','30'));

-- Ordem de compra (pedido) e item (entrada de insumo)
INSERT INTO pedidos (tipo, cliente_id, fornecedor_id, usuario_id, status, observacao)
VALUES ('COMPRA', NULL, 1, 1, 'APROVADO', 'Ordem de compra inicial');

INSERT INTO itens_pedido (pedido_id, insumo_id, quantidade, preco_unitario, observacao)
VALUES (1, 1, 100.000, 10.50, 'Compra de Insumo 502');

-- Movimentação de entrada vinculada ao pedido
INSERT INTO movimentacoes (tipo, insumo_id, quantidade, usuario_id, origem_tipo, origem_id, destino_tipo, destino_id, pedido_id, item_pedido_id, observacao)
VALUES ('ENTRADA', 1, 100.000, 1, 'FORNECEDOR', 1, 'ESTOQUE', NULL, 1, 1, 'Recebimento da NF do pedido 1');

-- Regras e Balanço de Massa
INSERT INTO regras_calculo (nome, parametros, ativo)
VALUES ('Regra Padrão', JSON_OBJECT('tolerancia_perda', 0.03), TRUE);

INSERT INTO balanco_massa (data_ref, regra_id, qtd_recebida, qtd_utilizada, perdas, resultado, criado_por)
VALUES (CURRENT_DATE(), 1, 100.000, 80.000, 2.000, JSON_OBJECT('saldo', 18.000, 'eficiencia', 0.98), 1);

-- Vincula movimentações ao balanço (exemplo simples: a entrada acima)
INSERT INTO movimentacao_balanco (balanco_id, movimentacao_id) VALUES (1, 1);

-- Documento de exemplo (metadados + URL; conteúdo opcional)
INSERT INTO documentos (nome, tipo, mime_type, url, hash_sha256, usuario_id, relacionado_tipo, relacionado_id)
VALUES ('NF Pedido 1', 'NOTA_FISCAL', 'application/pdf', 'https://exemplo.com/nf1.pdf',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 1, 'PEDIDO', 1);

-- Relatório salvo de exemplo
INSERT INTO relatorios (nome, descricao, filtro, formato, usuario_gerador)
VALUES ('Entradas do Mês', 'Relatório de entradas de insumos no mês corrente',
        JSON_OBJECT('tipo','ENTRADA','periodo','mensal'), 'PDF', 1);

-- -------------------------------------------------------------
-- Views auxiliares para consultas
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_pedidos_com_itens AS
SELECT p.id AS pedido_id, p.tipo, p.status, p.data_emissao,
       COALESCE(c.nome, f.nome) AS parceiro,
       ip.id AS item_id, ip.quantidade, ip.preco_unitario,
       pr.nome AS produto, ins.nome AS insumo
FROM pedidos p
LEFT JOIN clientes c ON c.id = p.cliente_id
LEFT JOIN fornecedores f ON f.id = p.fornecedor_id
JOIN itens_pedido ip ON ip.pedido_id = p.id
LEFT JOIN produtos pr ON pr.id = ip.produto_id
LEFT JOIN insumos ins ON ins.id = ip.insumo_id;

-- -------------------------------------------------------------
-- Dicas de execução:
--   mysql -u root -p < insumoplus_dump.sql
-- -------------------------------------------------------------
