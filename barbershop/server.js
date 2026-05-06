const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Inicializar banco de dados
const db = new sqlite3.Database('./barbershop.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    inicializarBanco();
  }
});

// Inicializar tabelas do banco
function inicializarBanco() {
  db.serialize(() => {
    // Tabela de agendamentos
    db.run(`
      CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data_agendamento DATE NOT NULL,
        hora_inicio TIME NOT NULL,
        servico TEXT NOT NULL,
        nome_cliente TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de horários indisponíveis (opcional, para futuros usos)
    db.run(`
      CREATE TABLE IF NOT EXISTS horarios_indisponiveis (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data DATE NOT NULL,
        hora_inicio TIME NOT NULL,
        hora_fim TIME NOT NULL,
        motivo TEXT
      )
    `);
  });
}

// Rota para obter horários disponíveis
app.post('/api/horarios-disponiveis', (req, res) => {
  const { data, servico } = req.body;

  // Gerar todos os horários possíveis (9h - 20h, intervalos de 30min)
  const horariosDisponiveis = gerarHorarios();

  // Buscar agendamentos já marcados para a data
  const query = `
    SELECT hora_inicio FROM agendamentos 
    WHERE data_agendamento = ? AND servico = ?
  `;

  db.all(query, [data, servico], (err, agendamentos) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar horários' });
    }

    const horariosOcupados = agendamentos.map(a => a.hora_inicio);
    const horarios = horariosDisponiveis.filter(h => !horariosOcupados.includes(h));

    res.json({ horarios: horarios });
  });
});

// Função para gerar horários (9h - 20h, 30 em 30 minutos)
function gerarHorarios() {
  const horarios = [];
  const inicio = 9; // 9h
  const fim = 20; // 20h
  
  for (let hora = inicio; hora < fim; hora++) {
    horarios.push(`${hora.toString().padStart(2, '0')}:00`);
    horarios.push(`${hora.toString().padStart(2, '0')}:30`);
  }
  
  return horarios;
}

// Rota para criar agendamento
app.post('/api/agendamentos', (req, res) => {
  const { data, hora, servico, nome, whatsapp } = req.body;

  // Validações
  if (!data || !hora || !servico || !nome || !whatsapp) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  // Validar formato do WhatsApp (apenas números)
  if (!/^\d{10,15}$/.test(whatsapp.replace(/\D/g, ''))) {
    return res.status(400).json({ erro: 'Número de WhatsApp inválido' });
  }

  // Verificar se a data é válida e não está no passado
  const [ano, mes, dia] = data.split('-').map(Number);
  const dataAgendamento = new Date(ano, mes - 1, dia, 0, 0, 0);
  const dataAtual = new Date();
  const dataAtualMeia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate(), 0, 0, 0);
  
  if (dataAgendamento < dataAtualMeia) {
    return res.status(400).json({ erro: 'Não é possível agendar para datas passadas' });
  }

  // Se for hoje, verificar se o horário não está no passado
  if (dataAgendamento.getTime() === dataAtualMeia.getTime()) {
    const [horaAgendamento, minutoAgendamento] = hora.split(':').map(Number);
    const agora = new Date();
    const horaAtual = agora.getHours();
    const minutoAtual = agora.getMinutes();
    
    if (horaAgendamento < horaAtual || (horaAgendamento === horaAtual && minutoAgendamento <= minutoAtual)) {
      return res.status(400).json({ erro: 'Não é possível agendar para horários que já passaram' });
    }
  }

  // Verificar se o horário já está ocupado
  const query = `
    SELECT id FROM agendamentos 
    WHERE data_agendamento = ? AND hora_inicio = ? AND servico = ?
  `;

  db.get(query, [data, hora, servico], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao verificar disponibilidade' });
    }

    if (row) {
      return res.status(400).json({ erro: 'Este horário já está ocupado' });
    }

    // Inserir o agendamento
    const insertQuery = `
      INSERT INTO agendamentos (data_agendamento, hora_inicio, servico, nome_cliente, whatsapp)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [data, hora, servico, nome, whatsapp], function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao criar agendamento' });
      }

      // Gerar mensagem WhatsApp
      const mensagensServico = {
        'corte': 'Corte de Cabelo',
        'barba': 'Barba',
        'corte-barba': 'Corte e Barba'
      };

      const nomeServico = mensagensServico[servico] || servico;
      const mensagem = `Olá ${nome}! Seu agendamento foi confirmado:\n\n📅 Data: ${formatarData(data)}\n🕐 Horário: ${hora}\n✂️ Serviço: ${nomeServico}\n\nAté breve!`;
      const linkWhatsapp = `https://wa.me/55${whatsapp}?text=${encodeURIComponent(mensagem)}`;

      res.json({
        sucesso: true,
        id: this.lastID,
        mensagem: 'Agendamento realizado com sucesso!',
        linkWhatsapp: linkWhatsapp,
        whatsappRaw: whatsapp
      });
    });
  });
});

// Rota para buscar agendamentos do cliente
app.get('/api/agendamentos/:whatsapp', (req, res) => {
  const { whatsapp } = req.params;

  const query = `
    SELECT * FROM agendamentos 
    WHERE whatsapp LIKE ? 
    ORDER BY data_agendamento DESC, hora_inicio DESC
  `;

  db.all(query, [`%${whatsapp.replace(/\D/g, '')}%`], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
    }

    res.json({ agendamentos: rows });
  });
});

// Rota para cancelar agendamento
app.delete('/api/agendamentos/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM agendamentos WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao cancelar agendamento' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }

    res.json({ sucesso: true, mensagem: 'Agendamento cancelado com sucesso' });
  });
});

// Função para formatar data
function formatarData(dataString) {
  const [ano, mes, dia] = dataString.split('-');
  const data = new Date(ano, mes - 1, dia);
  const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return data.toLocaleDateString('pt-BR', opcoes);
}

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
