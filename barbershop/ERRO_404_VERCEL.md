# 🔧 Como Resolver Erro 404: NOT_FOUND na Vercel

## Problema
Você está vendo este erro ao tentar acessar seu site na Vercel:
```
404: NOT_FOUND
Code: NOT_FOUND
ID: gru1::xxxxx-xxxxx-xxxxx
```

## Causas Possíveis

### 1. ❌ Variáveis de Ambiente Não Configuradas
As funções serverless falham porque não conseguem conectar ao Supabase.

### 2. ❌ Deploy Falhou
O deploy pode ter falhado devido a erros nas funções.

### 3. ❌ Estrutura de Arquivos Incorreta
Problemas na estrutura da pasta `api/`.

## ✅ Soluções

### Passo 1: Verificar Variáveis de Ambiente na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Entre no seu projeto
3. Vá em **Settings** > **Environment Variables**
4. Verifique se existem estas variáveis:
   - `SUPABASE_URL` = `https://xxxxx.supabase.co`
   - `SUPABASE_KEY` = `eyJxxxxx...` (chave anon)

**Se não existirem:**
1. Click **Add New**
2. Adicione as duas variáveis
3. **Redeploy** o projeto (Settings > Deployments > Trigger Redeploy)

### Passo 2: Verificar se o Deploy Funcionou

1. Vá em **Deployments** no painel da Vercel
2. O último deploy deve estar **verde** (Ready)
3. Se estiver vermelho, click nele para ver os logs de erro

### Passo 3: Testar as Funções

Após configurar as variáveis, teste estas URLs:

- **Site principal:** `https://seu-projeto.vercel.app`
- **API de horários:** `https://seu-projeto.vercel.app/api/horarios-disponiveis`
- **API de agendamentos:** `https://seu-projeto.vercel.app/api/agendamentos`

Se ainda der 404, verifique os logs do deploy.

### Passo 4: Redeploy Manual

Se nada funcionar:

1. Faça um commit no GitHub:
   ```bash
   git add .
   git commit -m "Fix: Redeploy após configurar variáveis"
   git push origin main
   ```

2. A Vercel vai fazer um novo deploy automaticamente.

## 🆘 Ainda Não Funciona?

Se o problema persistir:

1. **Delete o projeto** na Vercel
2. **Crie um novo projeto** do zero
3. **Configure as variáveis de ambiente** ANTES do primeiro deploy
4. **Faça o deploy**

## 📞 Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Fórum Vercel](https://vercel.community)

---

**Lembre-se:** O erro 404 geralmente significa que as funções serverless não estão funcionando devido à falta das credenciais do Supabase! 🔑