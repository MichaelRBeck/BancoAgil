# 💰 Banco Ágil

Projeto desenvolvido como parte da pós-graduação em Engenharia de Front-End — FIAP.

O **Banco Ágil** é uma aplicação bancária digital moderna, responsiva e com foco em segurança. Usuários podem se cadastrar, realizar login e, após autenticados, acessar funcionalidades como saldo, transações financeiras e análises gráficas.

---

## 📚 Descrição do Projeto

Este projeto simula o funcionamento de um banco digital com funcionalidades essenciais:

- Cadastro e login de usuários com autenticação via JWT
- Visualização de saldo atualizado
- Operações de depósito, saque e transferência entre usuários
- Histórico completo de transações
- Gráficos dinâmicos com análise financeira
- Interface moderna, acessível e 100% responsiva
- Arquitetura baseada em `Redux` e `MongoDB`

---

## 🚀 Tecnologias Utilizadas

- **Framework**: Next.js 15 (Pages Router + App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + Styled-Components
- **Gerenciamento de estado**: Redux Toolkit + `next-redux-wrapper`
- **Autenticação**: JWT com armazenamento seguro
- **Banco de Dados**: MongoDB com Mongoose
- **Visualização de dados**: Recharts
- **Ícones**: Lucide + React Icons
- **Outros**: Recoil (resíduos legados), ESLint, Docker, etc.

---

## 🗂️ Estrutura de Pastas

src/
├── app/                       # App Router (layouts, page.tsx, etc)
│   ├── api/                   # Rotas da API (register, login, transações)
│   ├── components/            # Componentes reutilizáveis e estilizados
│   ├── homepage/              # Página inicial com dashboard e gráficos
│   ├── transactions/          # Página de transações e filtros
│   ├── lib/                   # Conexão com MongoDB e registries
│   ├── models/                # Modelos Mongoose
│   ├── services/              # Requisições e lógicas de negócio
│   ├── state/                 # Slices ou persistência legacy
│   ├── types/                 # Tipagens globais
│   └── utils/                 # Funções auxiliares e validações
├── pages/                     # Pages Router (SSR/SSG)
│   ├── homepage/              # SSR da página inicial
│   ├── transactions/          # SSR da página de transações
│   └── api/                   # API routes (compatibilidade)
├── redux/                     # Slices e store Redux
├── styles/                    # CSS global
└── styled/                    # Styled-components organizados por feature


---

## 🐳 Docker

### 📦 Build da imagem

```bash
docker build -t banco-agil .
🚀 Subir o container
bash
Copiar
Editar
docker run -p 3000:3000 --env-file .env.local banco-agil
Acesse em: http://localhost:3000

🛠️ Como Rodar Localmente
Clone o repositório:

bash
Copiar
Editar
git clone https://github.com/MichaelRBeck/BancoAgil.git
cd BancoAgil
Instale as dependências:

bash
Copiar
Editar
npm install
Configure o .env.local:

bash
Copiar
Editar
cp .env.example .env.local
Preencha com sua URI do MongoDB:

env
Copiar
Editar
MONGODB_URI="mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/?retryWrites=true&w=majority"
JWT_SECRET="sua_chave_secreta_segura"
Execute a aplicação:

bash
Copiar
Editar
npm run dev
Acesse em: http://localhost:3000

🧩 Funcionalidades
✅ Cadastro e login com validações

✅ Autenticação com JWT

✅ Visualização e atualização de saldo

✅ Depósito, saque e transferência entre usuários

✅ Histórico filtrável de transações

✅ Análises financeiras com gráficos

✅ Componentes reutilizáveis e estilizados

✅ Arquitetura modular e escalável

✅ Docker Ready para deploy em produção

👤 Autor
Michael Ribeiro Beck Barboza
📘 RM: 363609
🎓 Pós-graduação: Engenharia de Front-End - FIAP
📚 Turma: Pós Tech - 3FRNT
