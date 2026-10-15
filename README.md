# Sistema E-commerce

Aplicação full-stack de e-commerce construída com Node.js/Express no backend e React/Vite no frontend.

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Contribuindo](#contribuindo)
- [Licença](#licença)
- [Contato](#contato)

## 📖 Sobre o Projeto

Sistema completo de e-commerce com funcionalidades incluindo catálogo de produtos, carrinho de compras, autenticação de usuários, processamento de pedidos e painel administrativo. O projeto segue boas práticas de desenvolvimento com separação clara de responsabilidades entre backend e frontend.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web para construção da API
- **TypeORM** - ORM para mapeamento objeto-relacional (baseado na estrutura de model/repository)
- **TypeScript** - Superset tipado do JavaScript
- **JWT** - Para autenticação segura
- **bcryptjs** - Para hash de senhas
- **cors** - Middleware para habilitar CORS
- **dotenv** - Para gerenciamento de variáveis de ambiente

### Frontend
- **React 18+** - Biblioteca para construção de interfaces
- **Vite** - Bundler e servidor de desenvolvimento rápido
- **TypeScript** - Para tipagem estática
- **React Router DOM** - Para navegação entre páginas
- **Axios** - Cliente HTTP para comunicação com a API
- **CSS Padrão** - Para estilização (verificar se há CSS modules ou styled-components configurados)

## 🔧 Instalação

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- Banco de dados configurado

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone [URL-do-repositório]
   cd sistema E-commerce
   ```

2. Instale as dependências do backend:
   ```bash
   cd backend
   npm install
   ```

3. Instale as dependências do frontend:
   ```bash
   cd frontend/ecommerce
   npm install
   ```

## ▶️ Como Executar

### Desenvolvimento

#### Backend (Terminal 1)
```bash
cd backend
npm run dev   # ou npm start, conforme configurado no package.json
```

#### Frontend (Terminal 2)
```bash
cd frontend/ecommerce
npm run dev   # normalmente roda em http://localhost:5173
```

### Produção

#### Build do Backend
```bash
cd backend
npm run build   # se o script estiver configurado
```

#### Build do Frontend
```bash
cd frontend/ecommerce
npm run build   # gera arquivos otimizados em /dist
```

## 📁 Estrutura do Projeto

```
sistema E-commerce/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controller/      # Controladores da API
│   │   ├── model/           # Modelos de dados
│   │   ├── repository/      # Camada de acesso a dados
│   │   ├── routes/          # Definição das rotas
│   │   ├── middleware/      # Middlewares personalizados
│   │   ├── config/          # Configurações (DB, etc.)
│   │   └── app.ts           # Entrada da aplicação
│   ├── .env                 # Variáveis de ambiente
│   ├── package.json
│   └── package-lock.json
├── frontend/                # Frontend React/Vite
│   └── ecommerce/
│       ├── src/
│       │   ├── components/  # Componentes reutilizáveis
│       │   ├── model/       # Modelos TypeScript
│       │   ├── pages/       # Páginas da aplicação
│       │   ├── services/    # Serviços de API
│       │   ├── App.tsx      # Componente raiz
│       │   ├── main.tsx     # Ponto de entrada
│       │   └── index.css    # Estilos globais
│       ├── .env             # Variáveis de ambiente
│       ├── package.json
│       └── package-lock.json
└── .claude/                 # Configurações do Claude Code
    └── settings.local.json
```

## 📚 Documentação da API

A documentação detalhada dos endpoints da API pode ser encontrada:
- No backend, verificando os arquivos em `backend/src/routes/`
- Ou através de ferramentas como Swagger/OpenAPI se configurado (verificar se há arquivos de documentação)

Principais módulos da API:
- **Auth**: Registro, login e gerenciamento de tokens
- **Products**: Listagem, busca, criação, atualização e exclusão de produtos
- **Cart**: Operações de carrinho de compras
- **Users**: Gerenciamento de perfis de usuários
- **Orders**: Criação e consulta de pedidos
- **Admin**: Rotas protegidas para administração do sistema

## 🧪 Testes

Verifique se há configurações de teste nos arquivos `package.json` de ambos backend e frontend.
- Testes unitários para serviços e utilitários
- Testes de integração para endpoints críticos
- Testes E2E para fluxos de usuário importantes (opcional)

Para executar os testes:
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend/ecommerce
npm test
```

## 🚀 Build e Deploy

### Build de Produção
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend/ecommerce
npm run build
```

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE) ou outra conforme definido no repositório.

## 👥 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Contato

Para dúvidas ou sugestões, abra uma issue neste repositório ou entre em contato através dos canais definidos no projeto.

---

*Documentação gerada automaticamente e mantida atualizada conforme o projeto evolui.*