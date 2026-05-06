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

  if (req.method !== 'DELETE') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  // Verificar se Supabase está configurado
  if (!supabase) {
    return res.status(500).json({ erro: 'Banco de dados não configurado. Verifique as variáveis de ambiente SUPABASE_URL e SUPABASE_KEY.' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ erro: 'ID do agendamento é obrigatório' });
    }

    const { error, count } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao cancelar agendamento:', error);
      return res.status(500).json({ erro: 'Erro ao cancelar agendamento' });
    }

    if (count === 0) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }

    return res.status(200).json({ sucesso: true, mensagem: 'Agendamento cancelado com sucesso' });
  } catch (erro) {
    console.error('Erro:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
