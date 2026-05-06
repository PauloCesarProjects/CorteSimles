const { removeAgendamento } = require('./lib/store');

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

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ erro: 'ID do agendamento é obrigatório' });
    }

    const removed = removeAgendamento(id);

    if (!removed) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }

    return res.status(200).json({ sucesso: true, mensagem: 'Agendamento cancelado com sucesso' });
  } catch (erro) {
    console.error('Erro:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
