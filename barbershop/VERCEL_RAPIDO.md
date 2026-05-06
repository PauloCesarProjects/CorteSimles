# Guia Rápido: Deploy na Vercel ✨

## O que mudou?

Seu projeto agora pode ser deployado na Vercel **sem servidor local**! Usaremos:
- ✅ **Vercel** para hospedar (grátis)
- ✅ **Supabase** para banco de dados PostgreSQL (grátis)
- ✅ **Funções Serverless** em vez de Express tradicional

## 1️⃣ Criar Conta Supabase (2 min)

1. Acesse [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Confirme o email
4. Crie um novo projeto (escolha a região mais próxima)
5. Copie a URL e a chave anon em Settings > API

## 2️⃣ Configurar Banco de Dados (3 min)

1. Na seção "SQL Editor" do Supabase, clique "+ New Query"
2. Cole o SQL do arquivo `DEPLOY_VERCEL.md`
3. Execute (play)
4. Pronto! Suas tabelas estão criadas

## 3️⃣ Fazer Push no GitHub

```bash
git add .
git commit -m "Adaptar para Vercel"
git push origin main
```

## 4️⃣ Deploy na Vercel (3 min)

1. Acesse [vercel.com](https://vercel.com)
2. Click "Add New..." > "Project"
3. Selecione seu repositório GitHub
4. Em "Environment Variables", adicione:
   - `SUPABASE_URL` = (cole a URL do Supabase)
   - `SUPABASE_KEY` = (cole a chave anon)
5. Click "Deploy"
6. ✅ Pronto! Seu site está no ar!

## 📝 URLs após Deploy

- Site: `https://seu-projeto.vercel.app`
- API: `https://seu-projeto.vercel.app/api`

O script.js detecta automaticamente se está em localhost ou em produção.

## 🧪 Testar Localmente (opcional)

Se quiser testar as funções serverless localmente:

```bash
npm install -g vercel
vercel env pull   # Puxa as variáveis de ambiente
vercel dev        # Inicia o servidor local na porta 3000
```

## ❓ Dúvidas Frequentes

**P: E meu banco SQLite?**
R: Não funciona em Vercel (é efêmero). Supabase é grátis e muito melhor!

**P: Preciso mudar meu código?**
R: Não! O código já foi adaptado. Apenas configure as variáveis de ambiente.

**P: Quanto vai custar?**
R: Nada! Vercel e Supabase têm planos free muito generosos.

**P: Como adiciono dados manualmente?**
R: Use o painel do Supabase > Table Editor para adicionar dados.

**P: Está dando 404 NOT_FOUND?**
R: Certifique-se de que as variáveis de ambiente SUPABASE_URL e SUPABASE_KEY estão configuradas na Vercel. Vá em Project Settings > Environment Variables e verifique se estão lá.

---

Sucesso! 🚀 Seu sistema de agendamento está online!
