# 🚀 GUIA RÁPIDO - Sistema de Agendamento para Barbearia

## ⚡ Comece em 3 Passos

### 1️⃣ Instalar as Dependências

Abra o **PowerShell** ou **CMD** na pasta do projeto e execute:

```bash
npm install
```

Isso vai baixar e instalar tudo que é necessário.

### 2️⃣ Iniciar o Servidor

Execute um destes comandos:

**Windows:**
```bash
npm start
```

Ou simplesmente clique 2 vezes em `start.bat`

**macOS / Linux:**
```bash
npm start
```

Ou execute: `./start.sh`

### 3️⃣ Acessar o Site

Abra seu navegador e digite:

```
http://localhost:3000
```

## ✨ O que você consegue fazer?

- ✅ **Agendar Horários**: Escolha data, horário e serviço
- ✅ **Escolher Serviço**: Corte, Barba ou Corte + Barba
- ✅ **Ver Horários Livres**: Automaticamente calcula o que está disponível (9h-20h)
- ✅ **Confirmar via WhatsApp**: Manda uma mensagem automática
- ✅ **Ver Meus Agendamentos**: Consulte seus agendamentos pelo WhatsApp
- ✅ **Cancelar Agendamento**: Cancele agendamentos futuros

## 📊 Dados Salvos

Tudo é salvo automaticamente no banco de dados `barbershop.db`.

Os agendamentos incluem:
- 👤 Nome do cliente
- 📱 Número de WhatsApp
- ✂️ Tipo de serviço
- 📅 Data e hora
- ⏰ Horário de criação

## 🎨 Como Personalizar?

### Mudar Cores
Abra: `public/styles.css`

Procure por `:root` e mude as cores hexadecimais:
```css
--cor-primaria: #1a1a1a;      /* Preto - mude para sua cor */
--cor-secundaria: #d4af37;    /* Dourado - mude para sua cor */
```

### Mudar Horários
Abra: `server.js`

Procure por `gerarHorarios()`:
```javascript
const inicio = 9;    // Mude para hora de abertura
const fim = 20;      /* Mude para hora de fechamento */
```

### Adicionar Serviços
1. Abra `public/index.html`
2. Procure por `<select id="servico">`
3. Adicione uma nova linha:
```html
<option value="novo">Seu Serviço - R$ XX,00</option>
```

4. Abra `server.js`
5. Procure por `mensagensServico = {`
6. Adicione:
```javascript
'novo': 'Seu Serviço',
```

## ❓ Problemas Comuns?

**"Não consigo acessar localhost:3000"**
- Verifique se o servidor está rodando (veja a mensagem no terminal)
- Tente limpar o cache: Ctrl+Shift+Del

**"Erro de módulo não encontrado"**
- Execute: `npm install`
- Reinicie o servidor

**"Porta 3000 em uso"**
- Windows: Ctrl+C no terminal e depois `npm start` novamente
- Ou finalize outros programas usando a porta 3000

**"Banco de dados corrompido"**
- Delete o arquivo `barbershop.db`
- Reinicie o servidor (ele cria automaticamente um novo)

## 📱 Acessar de Outro Computador

Se quiser acessar de outro PC da rede:

1. Descubra o IP do seu computador:
   - Windows: `ipconfig` (procure por "IPv4 Address")
   - macOS/Linux: `ifconfig` ou `ip addr`

2. No outro computador, acesse:
   ```
   http://seu_ip:3000
   ```

Por exemplo: `http://192.168.1.100:3000`

## 🔥 Dicas Úteis

- 💾 O banco de dados é salvo automaticamente
- 🔄 Não precisa reiniciar o servidor para mudanças no frontend
- 🌐 Abra em diferentes abas para testar múltiplos usuários
- 📲 Acesse pelo celular usando o IP (ótimo para testar!)
- 🔗 Os links do WhatsApp já vêm formatados corretamente

## 🆘 Precisa de Ajuda?

Verifique estes arquivos:
- `README.md` - Documentação completa
- `CONFIGURACAO.md` - Guia avançado
- `TESTES_API.md` - Testar as rotas da API

## 🎉 Pronto!

Agora você tem um sistema profissional de agendamento para sua barbearia!

Bom uso! ✂️

---

**Dúvidas ou sugestões?** Consulte a documentação ou customize conforme necessário!
