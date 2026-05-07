const { agendamentos } = require('./lib/store');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    const { data, servico } = req.body;

    if (!data || !servico) {
      return res.status(400).json({ erro: 'Data e serviço são obrigatórios' });
    }

    // Gerar todos os horários possíveis
    const horariosDisponiveis = gerarHorarios();

    // Buscar agendamentos já marcados para a data
    const horariosOcupados = agendamentos
      .filter(a => a.data_agendamento === data && a.servico === servico)
      .map(a => a.hora_inicio);

    const horarios = horariosDisponiveis.filter(h => !horariosOcupados.includes(h));

    res.status(200).json({ horarios });
  } catch (erro) {
    console.error('Erro geral:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

// Gerar horários (14:00 - 19:30, 30 em 30 minutos)
function gerarHorarios() {
  const horarios = [];
  const inicio = 14;
  const fim = 20;
  
  for (let hora = inicio; hora < fim; hora++) {
    horarios.push(`${hora.toString().padStart(2, '0')}:00`);
    horarios.push(`${hora.toString().padStart(2, '0')}:30`);
  }
  
  return horarios;
}
