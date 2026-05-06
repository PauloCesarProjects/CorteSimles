# Guia de Configuração - Sistema de Agendamento de Barbearia

## 🚀 Início Rápido

### 1. Instalação (Primeira vez)

#### Windows:
```bash
# Abra o terminal (PowerShell ou CMD) na pasta do projeto
# Double-click em: start.bat

# Ou manualmente:
npm install
npm start
```

#### macOS / Linux:
```bash
# Navegue até a pasta do projeto
cd barbershop

# Execute o script de inicialização
chmod +x start.sh
./start.sh

# Ou manualmente:
npm install
npm start
```

### 2. Acessar a Aplicação

Abra seu navegador e acesse:
```
http://localhost:3000
```

## 🗄️ Banco de Dados

O arquivo `barbershop.db` é criado automaticamente na primeira execução.

### Estrutura do Banco

#### Tabela: agendamentos
```sql
CREATE TABLE agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    servico TEXT NOT NULL,           -- corte, barba, corte-barba
    nome_cliente TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índice para melhor performance
CREATE INDEX idx_agendamentos_data_servico ON agendamentos(data_agendamento, servico);
```

### Visualizar Dados do Banco

#### Usando SQLite3 (Linha de Comando):
```bash
# Instalar SQLite3 se não tiver
# Depois, abrir o banco:
sqlite3 barbershop.db

# Dentro do SQLite3:
SELECT * FROM agendamentos;
SELECT * FROM agendamentos WHERE data_agendamento = '2024-05-10';
.exit
```

#### Usando GUI (Recomendado):
- **DB Browser for SQLite** (Gratuito): https://sqlitebrowser.org/
- **SQLiteStudio**: https://sqlitestudio.pl/

## 🔧 Configurações

### Alterar Horários de Funcionamento

Edite em `server.js`, função `gerarHorarios()`:

```javascript
function gerarHorarios() {
    const horarios = [];
    const inicio = 9;    // Mude para a hora de abertura
    const fim = 20;      // Mude para a hora de fechamento
    
    for (let hora = inicio; hora < fim; hora++) {
        horarios.push(`${hora.toString().padStart(2, '0')}:00`);
        horarios.push(`${hora.toString().padStart(2, '0')}:30`);
    }
    
    return horarios;
}
```

### Adicionar Novos Serviços

1. **No HTML** (`public/index.html`):
```html
<select id="servico" name="servico" required>
    <option value="">Selecione um serviço</option>
    <option value="corte">Corte de Cabelo - R$ 40,00</option>
    <option value="barba">Barba - R$ 30,00</option>
    <option value="corte-barba">Corte e Barba - R$ 65,00</option>
    <!-- Adicione novos aqui -->
    <option value="novo-servico">Novo Serviço - R$ XX,00</option>
</select>
```

2. **No JavaScript** (`server.js`):
```javascript
const mensagensServico = {
    'corte': 'Corte de Cabelo',
    'barba': 'Barba',
    'corte-barba': 'Corte e Barba',
    'novo-servico': 'Novo Serviço'  // Adicione aqui
};
```

### Alterar Cores do Site

Edite em `public/styles.css`, seção `:root`:

```css
:root {
    --cor-primaria: #1a1a1a;      /* Cor principal (preto) */
    --cor-secundaria: #d4af37;    /* Cor de destaque (dourado) */
    --cor-fundo: #f5f5f5;         /* Fundo da página */
    --cor-texto: #333;            /* Cor do texto */
    --cor-border: #ddd;           /* Cor das bordas */
    --cor-erro: #e74c3c;          /* Cor de erro */
    --cor-sucesso: #27ae60;       /* Cor de sucesso */
}
```

## 🐛 Troubleshooting

### Problema: "Porta 3000 já está em uso"

```bash
# Windows (PowerShell)
Get-Process -Name node | Stop-Process -Force

# macOS / Linux
lsof -ti:3000 | xargs kill -9
```

### Problema: "Cannot find module 'express'"

```bash
npm install
```

### Problema: "Banco de dados corrompido"

```bash
# Remova o arquivo de banco de dados
rm barbershop.db
# Ou no Windows:
del barbershop.db

# O novo banco será criado na próxima execução
npm start
```

## 📊 Backups e Exportação de Dados

### Fazer Backup

```bash
# Copiar o arquivo de banco de dados
cp barbershop.db backup-2024-05-06.db

# Ou no Windows:
copy barbershop.db backup-2024-05-06.db
```

### Exportar para CSV

```bash
sqlite3 barbershop.db ".mode csv" ".output agendamentos.csv" "SELECT * FROM agendamentos;" ".exit"
```

### Restaurar Backup

```bash
# Remova o banco atual
rm barbershop.db

# Copie o backup
cp backup-2024-05-06.db barbershop.db

# Reinicie o servidor
npm start
```

## 🔒 Segurança

### Boas Práticas

1. **Senhas**: Se adicionar autenticação, use bcrypt para hash de senhas
2. **HTTPS**: Em produção, configure SSL/TLS
3. **Variáveis de Ambiente**: Use `.env` para dados sensíveis
4. **Rate Limiting**: Implemente limite de requisições para prevenir abuso
5. **Validação**: Todos os dados já são validados no servidor

### Exemplo de .env (Futuro)

```
PORT=3000
NODE_ENV=production
DATABASE_PATH=./barbershop.db
```

## 🚀 Deploy

### Deploy no Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar aplicação
heroku create seu-app-name

# Deploy
git push heroku main
```

### Deploy em VPS

```bash
# SSH na VPS
ssh usuario@seu-servidor.com

# Clonar repositório
git clone seu-repositorio

# Instalar dependências
npm install

# Usar PM2 para manter rodando
npm install -g pm2
pm2 start server.js --name "barbershop"
pm2 startup
pm2 save
```

## 📈 Monitoramento

### Logs de Erro

Os logs são exibidos no terminal. Para salvar em arquivo:

```bash
npm start > server.log 2>&1
```

### Monitorar Uso de Recursos

```bash
# Instalar
npm install -g pm2

# Monitorar
pm2 monit
```

## 📚 Recursos Adicionais

- **Documentação Express.js**: https://expressjs.com
- **Documentação SQLite3**: https://www.sqlite.org/docs.html
- **MDN Web Docs**: https://developer.mozilla.org
- **Node.js Guide**: https://nodejs.org/en/docs/

## ❓ Perguntas Frequentes

**P: Como adiciono mais barbeiros?**
A: Modifique o modelo de dados para adicionar um campo `barbeiro_id` aos agendamentos.

**P: Como integro com sistema de pagamento?**
A: Você pode usar APIs como Stripe, PayPal ou MercadoPago.

**P: Posso usar MySQL em vez de SQLite?**
A: Sim! Substitua o módulo `sqlite3` por `mysql2` e adapte as queries.

**P: Como faço backup automático?**
A: Crie um script com `cron` (Linux) ou `Task Scheduler` (Windows).

---

Para mais informações ou suporte, consulte a documentação oficial das tecnologias utilizadas.
