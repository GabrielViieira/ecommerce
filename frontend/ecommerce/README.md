# E-commerce Frontend

Frontend do sistema E-commerce construido com React, TypeScript e Vite.

## 📋 Visão Geral

Esta aplicação frontend consome a API do backend para fornecer uma experiência de compra completa, incluindo:

- Catálogo de produtos
- Carrinho de compras
- Autenticação de usuários
- Processamento de checkout

## 🚀 Funcionalidades

- **Página Inicial**: Banners promocionais e produtos em destaque
- **Lista de Produtos**: Navegação, busca e filtragem de produtos
- **Detalhe do Produto**: Visualização completa de informações do produto
- **Carrinho de Compras**: Adicionar/remover itens, atualizar quantidades, calcular total
- **Autenticação**: Login, registro e gerenciamento de perfil
- **Checkout**: Finalização de compra com forma de pagamento e endereço

## 🛠️ Tecnologias

- **React 18+** - Biblioteca para construção de interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e servidor de desenvolvimento rápido
- **React Router DOM** - Navegação entre páginas
- **Axios** - Cliente HTTP para consumo da API
- **CSS Puro** - Estilização (pode ser migrado para CSS Modules ou styled-components no futuro)

## 📁 Estrutura de Pastas

```
src/
├── components/     # Componentes reutilizáveis (buttons, cards, modais, etc.)
├── model/          # Interfaces e tipos TypeScript
├── pages/          # Páginas da aplicação (Home, Login, Cart, Products, etc.)
├── services/       # Serviços de consumo da API
├── App.tsx         # Componente raiz com rotas
├── main.tsx        # Ponto de entrada da aplicação
└── index.css       # Estilos globais
```

## ⚙️ Configuração

### Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Backend do sistema E-commerce rodando e acessível

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend com:

```env
VITE_API_URL=http://localhost:3000  # URL do backend API
```

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Aplicação estará disponível em http://localhost:5173
```

### Build para Produção

```bash
# Gerar arquivos de produção
npm run build

# Arquivos serão gerados na pasta /dist
```

## 🔌 Integração com API

O frontend consome a API do backend através dos serviços localizados em `src/services/`. Todos os serviços utilizam o axios com configuração baseada na variável `VITE_API_URL`.

### Serviços Disponíveis

- `getProductsService()` - Lista produtos
- `getCartService()` - Obtém carrinho do usuário
- `addProductsService()` - Adiciona produto ao carrinho
- `loginUserService()` - Autentica usuário
- `registerUserService()` - Registra novo usuário
- `getUsersService()` - Obtém lista de usuários (admin)

## 🧪 Testes

Para implementar testes no futuro:

```bash
# Testes unitários (exemplo com Vitest)
npm run test

# Testes E2E (exemplo com Cypress)
npm run e2e
```

## 📱 Responsividade

A aplicação é projetada para ser responsiva, funcionando em:
- Desktop (≥1024px)
- Tablet (768px - 1023px)
- Mobile (<768px)

## 🚨 Tratamento de Erros

- Erros de API são capturados e exibidos de forma amigável ao usuário
- Estados de carregamento são mostrados durante requisições
- Páginas de erro personalizadas para 404 e 500

## 🔐 Segurança

- Tokens JWT são armazenados em `localStorage` (considerar httpOnly cookies para maior segurança em produção)
- Axios interceptor adiciona automaticamente o token de autorização às requisições
- Rotas protegidas verificam autenticação antes de renderizar

## 🤝 Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

---

*Desenvolvido como parte do sistema E-commerce completo com backend Node.js/Express.*