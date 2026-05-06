const { supabase } = require('./lib/supabase');

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

  // Verificar se Supabase está configurado
  if (!supabase) {
    return res.status(500).json({ erro: 'Banco de dados não configurado. Verifique as variáveis de ambiente SUPABASE_URL e SUPABASE_KEY.' });
  }

  try {
    const { data, servico } = req.body;

    if (!data || !servico) {
      return res.status(400).json({ erro: 'Data e serviço são obrigatórios' });
    }

    // Gerar todos os horários possíveis
    const horariosDisponiveis = gerarHorarios();

    // Buscar agendamentos já marcados para a data
    const { data: agendamentos, error } = await supabase
      .from('agendamentos')
      .select('hora_inicio')
      .eq('data_agendamento', data)
      .eq('servico', servico);

    if (error) {
      console.error('Erro ao buscar agendamentos:', error);
      return res.status(500).json({ erro: 'Erro ao buscar horários' });
    }

    const horariosOcupados = agendamentos.map(a => a.hora_inicio);
    const horarios = horariosDisponiveis.filter(h => !horariosOcupados.includes(h));

    res.status(200).json({ horarios });
  } catch (erro) {
    console.error('Erro:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

// Gerar horários (9h - 22h, 30 em 30 minutos)
function gerarHorarios() {
  const horarios = [];
  const inicio = 9;
  const fim = 22;
  
  for (let hora = inicio; hora < fim; hora++) {
    horarios.push(`${hora.toString().padStart(2, '0')}:00`);
    horarios.push(`${hora.toString().padStart(2, '0')}:30`);
  }
  
  return horarios;
}
