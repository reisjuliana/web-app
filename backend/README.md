# InsumoPlus - Backend

Este diretório contém o **backend** da aplicação InsumoPlus, desenvolvido em [NestJS](https://nestjs.com/).  
Ele é responsável pela API e pela integração com o banco de dados MySQL.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão recomendada: LTS)
- [npm](https://www.npmjs.com/) (instalado junto com o Node.js)
- [MySQL](https://dev.mysql.com/downloads/) rodando localmente

---

## Passo a Passo de Configuração

### 1. Instalar dependências

Na raiz desta pasta (`backend`), execute:

```bash
npm install
```

### 2. Configurar conexão com MySQL

No arquivo `src/app.module.ts`, ajuste **login** e **senha** do seu MySQL local, por exemplo:

```ts
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'seu_usuario',
  password: 'sua_senha',
  database: 'insumoplus',
  autoLoadEntities: true,
  synchronize: false,
}),
```

> Certifique-se de já ter importado o banco de dados a partir do dump `insumoplus dump.sql`.

### 3. Executar o backend

Para rodar em ambiente de desenvolvimento:

```bash
npm run start:dev
```

O backend estará disponível em:

```
http://localhost:3000
```

---

## Endpoints Principais

- **Registro de usuário**  
  `POST http://localhost:3000/auth/register`

  Exemplo de body (JSON):

  ```json
  {
    "name": "nome",
    "email": "nome@email.com",
    "password": "123456",
    "cpf": "111.111.111-11"
  }
  ```

---

## Considerações

- Verifique se a porta `3000` está livre.
- Ajuste as credenciais do MySQL conforme sua configuração local.
