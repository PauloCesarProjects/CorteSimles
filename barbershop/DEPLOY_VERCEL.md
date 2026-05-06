# Deploy na Vercel

Este projeto está configurado para ser deployado na Vercel sem necessidade de servidor local.

## Passos para Deploy

### 1. Configurar Banco de Dados (Supabase)

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Na seção "SQL Editor", execute o seguinte SQL para criar as tabelas:

```sql
-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
  id BIGSERIAL PRIMARY KEY,
  data_agendamento DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  servico TEXT NOT NULL,
  nome_cliente TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de horários indisponíveis (opcional)
CREATE TABLE IF NOT EXISTS horarios_indisponiveis (
  id BIGSERIAL PRIMARY KEY,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  motivo TEXT
);

-- Índices para melhor performance
CREATE INDEX idx_agendamentos_data ON agendamentos(data_agendamento);
CREATE INDEX idx_agendamentos_servico ON agendamentos(servico);
CREATE INDEX idx_agendamentos_whatsapp ON agendamentos(whatsapp);
```

5. Vá em Settings > API > Project Keys
6. Copie a **URL** e a chave **anon** (public)

### 2. Configurar Variáveis de Ambiente na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "Add New..." > "Project"
4. Selecione este repositório
5. Em "Environment Variables", adicione:
   - `SUPABASE_URL`: Cole a URL do Supabase
   - `SUPABASE_KEY`: Cole a chave anon do Supabase
6. Clique em "Deploy"

### 3. Atualizar URL da API no Cliente

Se a URL da API mudar após o deploy, atualize a constante `API_BASE` em `public/script.js`:

```javascript
const API_BASE = 'https://seu-projeto.vercel.app/api';
```

## Desenvolvimento Local

Para testar localmente com as mesmas funções serverless:

1. Copie `.env.local.example` para `.env.local`
2. Preencha com suas credenciais do Supabase
3. Instale o Vercel CLI: `npm i -g vercel`
4. Execute: `vercel dev`
5. Abra http://localhost:3000

## Estrutura de Pastas

```
api/
├── lib/
│   └── supabase.js          # Configuração do Supabase
├── agendamentos.js          # POST (criar) e GET (buscar)
├── agendamentos/[id].js     # DELETE (cancelar)
└── horarios-disponiveis.js  # POST (listar horários)

public/
├── index.html               # Interface
├── script.js                # JavaScript (atualize API_BASE)
└── styles.css               # CSS
```

## Notas Importantes

- O SQLite não funciona em Vercel (é efêmero). Use Supabase ou outro banco em nuvem
- As funções serverless têm um timeout de 10 segundos
- CORS está habilitado para aceitar requisições de qualquer origem
- O banco de dados Supabase tem um plano free muito generoso

## Suporte

Se tiver dúvidas:
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
