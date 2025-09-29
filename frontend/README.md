# InsumoPlus - Frontend

Este diretório contém o **frontend** da aplicação InsumoPlus, desenvolvido em [Angular](https://angular.io/).  
Ele é responsável pela interface do usuário e comunicação com o backend.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão recomendada: LTS)
- [npm](https://www.npmjs.com/) (instalado junto com o Node.js)
- [Angular CLI](https://angular.io/cli) instalado globalmente

---

## Passo a Passo de Configuração

### 1. Instalar dependências

Na raiz desta pasta (`frontend`), execute:

```bash
npm install
```

### 2. Executar o frontend

Para iniciar o servidor de desenvolvimento:

```bash
ng serve --open
```

Isso abrirá automaticamente a aplicação no navegador em:

```
http://localhost:4200
```

---

## Comunicação com o Backend

O frontend está configurado para consumir a API do backend rodando em:

```
http://localhost:3000
```

Certifique-se de que o **backend** esteja em execução antes de utilizar o frontend.

---

## Considerações

- Verifique se a porta `4200` está livre.
- Caso precise alterar a URL da API, ajuste no arquivo de configuração de ambiente do Angular (`src/environments/environment.ts`).
