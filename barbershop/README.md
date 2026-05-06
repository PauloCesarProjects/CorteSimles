# 💈 Barbearia - Sistema de Agendamento Online

Um sistema completo de agendamento online para barbearias, desenvolvido com HTML, CSS, JavaScript, Node.js e SQLite.

## ✨ Características

- ✂️ **Agendamento Online**: Interface intuitiva para marcar horários
- 📅 **Gerenciamento de Datas**: Horários disponíveis de 9h a 20h (intervalos de 30 minutos)
- 💬 **Integração WhatsApp**: Envio automático de confirmação via WhatsApp
- 📱 **Responsivo**: Design adaptado para desktop e mobile
- 🗄️ **Banco de Dados**: SQLite para persistência de dados
- 🔍 **Consulta de Agendamentos**: Clientes podem visualizar seus horários agendados

## 📋 Requisitos

- Node.js (v14 ou superior)
- npm (gerenciador de pacotes Node.js)

## 🚀 Instalação

### 1. Instalar dependências

```bash
npm install
```

Este comando irá instalar:
- **express**: Framework web para Node.js
- **sqlite3**: Driver SQLite para Node.js
- **body-parser**: Middleware para parsing de dados
- **cors**: Middleware para CORS (requisições entre domínios)

### 2. Iniciar o servidor

```bash
npm start
```

Ou em modo desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em: **http://localhost:3000**

## 📖 Como Usar

### Para o Cliente

1. **Acesse o site**: Abra `http://localhost:3000` no navegador
2. **Preencha seus dados**:
   - Nome completo
   - Número de WhatsApp (com DDD)
   - Tipo de serviço (Corte, Barba ou Corte e Barba)
   - Data desejada
   - Horário disponível
3. **Confirme via WhatsApp**: Clique no link gerado para enviar a confirmação

### Para Consultar Agendamentos

1. Clique em "📅 Ver Meus Agendamentos"
2. Insira seu número de WhatsApp
3. Clique em "Buscar"
4. Você verá todos seus agendamentos
5. Pode cancelar agendamentos futuros

## 🗄️ Estrutura do Banco de Dados

### Tabela: agendamentos
```
- id (INTEGER PRIMARY KEY)
- data_agendamento (DATE)
- hora_inicio (TIME)
- servico (TEXT): corte, barba, corte-barba
- nome_cliente (TEXT)
- whatsapp (TEXT)
- criado_em (DATETIME)
```

## 🔌 API Endpoints

### Obter horários disponíveis
```
POST /api/horarios-disponiveis
Body: { "data": "2024-05-06", "servico": "corte" }
```

### Criar agendamento
```
POST /api/agendamentos
Body: {
  "data": "2024-05-06",
  "hora": "14:30",
  "servico": "corte",
  "nome": "João Silva",
  "whatsapp": "11999999999"
}
```

### Buscar agendamentos
```
GET /api/agendamentos/:whatsapp
```

### Cancelar agendamento
```
DELETE /api/agendamentos/:id
```

## 📁 Estrutura do Projeto

```
barbershop/
├── server.js              # Servidor Express
├── package.json          # Dependências do projeto
├── barbershop.db         # Banco de dados SQLite (criado automaticamente)
└── public/
    ├── index.html        # Página principal
    ├── styles.css        # Estilos
    └── script.js         # JavaScript frontend
```

## 🎨 Personalização

### Cores
Edite as variáveis CSS em `public/styles.css`:
```css
:root {
    --cor-primaria: #1a1a1a;      /* Preto */
    --cor-secundaria: #d4af37;    /* Dourado */
    --cor-fundo: #f5f5f5;         /* Cinza claro */
    --cor-texto: #333;            /* Cinza escuro */
    --cor-erro: #e74c3c;          /* Vermelho */
    --cor-sucesso: #27ae60;       /* Verde */
}
```

### Horários
Para alterar os horários disponíveis, edite a função `gerarHorarios()` em `server.js`:
```javascript
const inicio = 9;  // Hora de início (9h)
const fim = 20;    // Hora de término (20h)
```

### Serviços
Para adicionar/modificar serviços, edite:
1. `public/index.html` - Adicione opções no select de serviços
2. `server.js` - Adicione no objeto `mensagensServico`

## 🔒 Segurança

- Validação de todos os dados de entrada
- Prevenção de SQL Injection via prepared statements
- Validação de datas (não permite agendamentos no passado)
- Validação de número de WhatsApp

## 💡 Próximas Melhorias

- [ ] Autenticação de usuários
- [ ] Histórico de agendamentos
- [ ] Notificações por SMS
- [ ] Painel administrativo
- [ ] Blacklist de horários
- [ ] Múltiplos barbeiros
- [ ] Sistema de pagamento
- [ ] Email de confirmação

## 📞 Contato e Suporte

Para problemas ou sugestões, verifique:
1. Se o servidor está rodando em `http://localhost:3000`
2. Se as dependências foram instaladas com `npm install`
3. Se a porta 3000 está disponível

## 📄 Licença

Este projeto é livre para uso pessoal e comercial.

---

**Desenvolvido com ❤️ para barbearias modernas**
