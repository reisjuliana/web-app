# InsumoPlus - Setup do Projeto

Este repositório contém a aplicação **InsumoPlus**, composta por um **backend** em NestJS e um **frontend** em Angular, além de um dump SQL para inicialização do banco de dados MySQL.

---

## Pré-requisitos

Antes de iniciar, garanta que você possui os seguintes requisitos instalados e configurados em sua máquina:

- [Node.js](https://nodejs.org/) (versão recomendada: LTS)
- [npm](https://www.npmjs.com/) (instalado junto com o Node.js)
- [Angular CLI](https://angular.io/cli)
- [MySQL](https://dev.mysql.com/downloads/) rodando localmente
- [Postman](https://www.postman.com/) ou similar para testar os endpoints

---

## Passo a Passo de Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/reisjuliana/web-app.git
cd web-app
```

### 2. Configurar o banco de dados

1. Certifique-se de que o MySQL está rodando na sua máquina.
2. Abra o arquivo `web-app/insumoplus dump.sql` no cliente MySQL de sua preferência.
3. Execute o script inteiro para criar e popular o banco de dados inicial.

### 3. Configurar o backend

1. Entre na pasta do backend:
   ```bash
   cd web-app/backend
   npm install
   ```
2. Ajuste o arquivo `src/app.module.ts` para inserir **login e senha do seu MySQL** corretamente.

### 4. Configurar o frontend

1. Em outro terminal, entre na pasta do frontend:
   ```bash
   cd web-app/frontend
   npm install
   ```

### 5. Executar os serviços

Recomenda-se abrir dois terminais, um para o backend e outro para o frontend.

- No backend:
  ```bash
  npm run start:dev
  ```
- No frontend:
  ```bash
  ng serve --open
  ```

---

## Criar usuário inicial

Após subir os serviços, registre um usuário via **Postman** no endpoint de cadastro:

**Endpoint**

```
POST http://localhost:3000/auth/register
```

**Body (JSON)**

> Observação: o CPF precisa ser válido e deve conter pontos e traços.

```json
{
  "name": "nome",
  "email": "nome@email.com",
  "password": "123456",
  "cpf": "111.111.111-11"
}
```

---

## Estrutura do Projeto

- **web-app/backend** → código do servidor (NestJS)
- **web-app/frontend** → aplicação cliente (Angular)
- **web-app/insumoplus dump.sql** → script para criação e carga inicial do banco de dados

---

## Considerações

- Certifique-se de que a porta `3000` está livre para o backend e a porta `4200` para o frontend.
- Ajuste as credenciais do banco conforme sua configuração local.
