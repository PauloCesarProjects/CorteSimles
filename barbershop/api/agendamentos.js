const { addAgendamento, getAgendamentosByWhatsapp, isHorarioOcupado } = require('./lib/store');

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

  try {
    if (req.method === 'POST') {
      // Criar agendamento
      const { data, hora, servico, nome, whatsapp } = req.body;

      // Validações
      if (!data || !hora || !servico || !nome || !whatsapp) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
      }

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
      if (isHorarioOcupado(data, hora, servico)) {
        return res.status(400).json({ erro: 'Este horário já está ocupado' });
      }

      // Inserir agendamento
      const novoAgendamento = addAgendamento({
        data_agendamento: data,
        hora_inicio: hora,
        servico,
        nome_cliente: nome,
        whatsapp: whatsapp.replace(/\D/g, ''),
        criado_em: new Date().toISOString()
      });

      const mensagensServico = {
        'corte': 'Corte de Cabelo',
        'sobrancelha': 'Sobrancelha',
        'corte-sobrancelha': 'Corte + Sobrancelha',
        'corte-pigmentacao': 'Corte + Pigmentação'
      };

      const nomeServico = mensagensServico[servico] || servico;
      const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
      const mensagem = `Olá ${nome}! Seu agendamento foi confirmado:\n\n📅 Data: ${dataFormatada}\n🕐 Horário: ${hora}\n✂️ Serviço: ${nomeServico}\n\nAté breve!`;
      const linkWhatsapp = `https://wa.me/55${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;

      return res.status(200).json({
        sucesso: true,
        id: novoAgendamento.id,
        mensagem: 'Agendamento realizado com sucesso!',
        linkWhatsapp: linkWhatsapp,
        whatsappRaw: whatsapp.replace(/\D/g, '')
      });

    } else if (req.method === 'GET') {
      // Buscar agendamentos por WhatsApp
      const { whatsapp } = req.query;

      if (!whatsapp) {
        return res.status(400).json({ erro: 'WhatsApp é obrigatório' });
      }

      const whatsappLimpo = whatsapp.replace(/\D/g, '');
      const agendamentos = getAgendamentosByWhatsapp(whatsappLimpo);

      return res.status(200).json({ agendamentos });

    } else {
      return res.status(405).json({ erro: 'Método não permitido' });
    }
  } catch (erro) {
    console.error('Erro:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
