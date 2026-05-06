const { supabase } = require('../barbershop/api/lib/supabase');

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

    // Se Supabase não está configurado, retornar todos os horários
    if (!supabase) {
      console.warn('Supabase não configurado, retornando todos os horários');
      return res.status(200).json({ horarios: horariosDisponiveis });
    }

    try {
      // Buscar agendamentos já marcados para a data
      const { data: agendamentos, error } = await supabase
        .from('agendamentos')
        .select('hora_inicio')
        .eq('data_agendamento', data)
        .eq('servico', servico);

      if (error) {
        console.warn('Erro ao buscar agendamentos, retornando todos os horários:', error);
        return res.status(200).json({ horarios: horariosDisponiveis });
      }

      const horariosOcupados = agendamentos.map(a => a.hora_inicio);
      const horarios = horariosDisponiveis.filter(h => !horariosOcupados.includes(h));

      res.status(200).json({ horarios });
    } catch (erroSupabase) {
      console.error('Erro ao conectar ao Supabase:', erroSupabase);
      // Em caso de erro, retornar todos os horários disponíveis
      res.status(200).json({ horarios: horariosDisponiveis });
    }
  } catch (erro) {
    console.error('Erro geral:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

// Gerar horários (9h - 22h, 30 em 30 minutos) - VERSÃO 2025
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
