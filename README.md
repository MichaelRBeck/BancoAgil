
# 💰 Banco Ágil

Projeto desenvolvido como parte da pós-graduação em Engenharia de Front-End — FIAP.

O **Banco Ágil** é uma aplicação bancária digital onde usuários podem se cadastrar, realizar login e, após autenticados, acessar funcionalidades como consulta de saldo, depósitos, saques e transferências entre usuários cadastrados. Foi pensado como um banco simples e funcional, ideal para estudos, demonstrações ou aplicações básicas.

---

## 📚 Descrição do Projeto

Este projeto simula o funcionamento de um banco digital com funcionalidades essenciais:

- Cadastro e login de usuários
- Operações bancárias (depósito, saque, transferência)
- Visualização de saldo
- Histórico de transações
- Interface moderna e responsiva

---

## 🚀 Tecnologias Utilizadas

- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Styled-Components
- **Banco de dados:** MongoDB com Mongoose

---

## 🧭 Estrutura de Pastas

```
📦 raiz
├── api/
│   ├── get-user/
│   ├── login/
│   ├── register/
│   └── transaction/
├── components/
│   ├── footer/
│   ├── modalComponents/
│   ├── modals/
│   ├── navbar/
│   └── tables/
├── homepage/
│   ├── components/
│   └── hooks/
├── transactions/
│   ├── components/
│   ├── hooks/
│   └── types/
├── lib/
├── models/
├── services/
├── types/
├── utils/
├── page.tsx
├── layout.tsx
├── globals.css
└── .env.local
```

---

## 🛠️ Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/MichaelRBeck/BancoAgil.git
cd BancoAgil
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Antes de rodar o projeto, copie o arquivo `.env.example` para `.env.local` e preencha as variáveis com seus dados reais:

```bash
cp .env.example .env.local
```

Exemplo do que deve conter no `.env.local`:

```env
MONGODB_URI="mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/?retryWrites=true&w=majority&appName=BancoAgil&authSource=admin"
```

### 4. Execute a aplicação

```bash
npm run dev
```

Acesse via: [http://localhost:3000](http://localhost:3000)

---

## 📖 Rodando o Storybook

O projeto também possui o Storybook configurado para visualização dos componentes isoladamente.

Para rodar o Storybook localmente, execute:

```bash
npm run storybook
```

O Storybook ficará disponível em: [http://localhost:6006](http://localhost:6006)

Para gerar a build estática do Storybook, use:

```bash
npm run build-storybook
```

---

## 🧩 Funcionalidades

- ✅ Cadastro de usuários
- ✅ Login com verificação
- ✅ Visualização de saldo
- ✅ Realização de depósitos, saques e transferências
- ✅ Histórico de transações por usuário
- ✅ Interface 100% responsiva

---

## 🎨 Protótipo no Figma

Você pode visualizar o protótipo visual do sistema aqui:

🔗 [Figma - Tech Challenge Bank - Banco Ágil](https://www.figma.com/design/kp1chKhMvojYEHY5r49Dml/Tech-Challenge-Bank---BancoAgil?node-id=0-1&t=VPIS1ZWjOoAfcIgK-1)

---

## 👤 Autor

**Michael Ribeiro Beck Barboza**  
📘 RM: 363609  
🎓 Pós-graduação: Engenharia de Front-End  
📚 Turma: Pós Tech - 3FRNT
