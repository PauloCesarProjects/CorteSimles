# Testes da API - Sistema de Agendamento de Barbearia

## 1. Obter horários disponíveis

```bash
curl -X POST http://localhost:3000/api/horarios-disponiveis \
  -H "Content-Type: application/json" \
  -d '{
    "data": "2024-05-10",
    "servico": "corte"
  }'
```

**Resposta esperada:**
```json
{
  "horarios": [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    ...
    "19:30"
  ]
}
```

## 2. Criar agendamento

```bash
curl -X POST http://localhost:3000/api/agendamentos \
  -H "Content-Type: application/json" \
  -d '{
    "data": "2024-05-10",
    "hora": "14:30",
    "servico": "corte",
    "nome": "João Silva",
    "whatsapp": "11999999999"
  }'
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "id": 1,
  "mensagem": "Agendamento realizado com sucesso!",
  "linkWhatsapp": "https://wa.me/5511999999999?text=...",
  "whatsappRaw": "11999999999"
}
```

## 3. Buscar agendamentos por WhatsApp

```bash
curl http://localhost:3000/api/agendamentos/11999999999
```

**Resposta esperada:**
```json
{
  "agendamentos": [
    {
      "id": 1,
      "data_agendamento": "2024-05-10",
      "hora_inicio": "14:30",
      "servico": "corte",
      "nome_cliente": "João Silva",
      "whatsapp": "11999999999",
      "criado_em": "2024-05-06 10:30:00"
    }
  ]
}
```

## 4. Cancelar agendamento

```bash
curl -X DELETE http://localhost:3000/api/agendamentos/1
```

**Resposta esperada:**
```json
{
  "sucesso": true,
  "mensagem": "Agendamento cancelado com sucesso"
}
```

## 5. Testar no Postman ou Insomnia

### GET /api/agendamentos/:whatsapp
- **Método**: GET
- **URL**: http://localhost:3000/api/agendamentos/11999999999

### POST /api/horarios-disponiveis
- **Método**: POST
- **URL**: http://localhost:3000/api/horarios-disponiveis
- **Body (JSON)**:
```json
{
  "data": "2024-05-10",
  "servico": "corte"
}
```

### POST /api/agendamentos
- **Método**: POST
- **URL**: http://localhost:3000/api/agendamentos
- **Body (JSON)**:
```json
{
  "data": "2024-05-10",
  "hora": "14:30",
  "servico": "corte",
  "nome": "Maria Santos",
  "whatsapp": "21987654321"
}
```

### DELETE /api/agendamentos/:id
- **Método**: DELETE
- **URL**: http://localhost:3000/api/agendamentos/1

## Códigos de erro esperados

- **400**: Dados inválidos ou horário indisponível
- **404**: Agendamento não encontrado
- **500**: Erro do servidor

## Validações esperadas

- ✓ Nome deve ter pelo menos 3 caracteres
- ✓ WhatsApp deve ter 10-11 dígitos
- ✓ Data não pode ser no passado
- ✓ Horário deve estar entre 13:30 e 19:30
- ✓ Horário já ocupado será rejeitado
- ✓ Serviço deve ser válido (corte, barba, corte-barba)
