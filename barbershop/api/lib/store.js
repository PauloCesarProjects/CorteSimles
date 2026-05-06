// In-memory store for bookings (not persistent across server restarts)
let agendamentos = [];
let nextId = 1;

module.exports = {
  agendamentos,
  getNextId: () => nextId++,
  addAgendamento: (agendamento) => {
    agendamento.id = module.exports.getNextId();
    agendamentos.push(agendamento);
    return agendamento;
  },
  findAgendamento: (id) => agendamentos.find(a => a.id == id),
  removeAgendamento: (id) => {
    const index = agendamentos.findIndex(a => a.id == id);
    if (index > -1) {
      agendamentos.splice(index, 1);
      return true;
    }
    return false;
  },
  getAgendamentosByWhatsapp: (whatsapp) => agendamentos.filter(a => a.whatsapp === whatsapp).sort((a,b) => {
    const dateA = new Date(a.data_agendamento + ' ' + a.hora_inicio);
    const dateB = new Date(b.data_agendamento + ' ' + b.hora_inicio);
    return dateB - dateA; // descending
  }),
  isHorarioOcupado: (data, hora, servico) => agendamentos.some(a => a.data_agendamento === data && a.hora_inicio === hora && a.servico === servico)
};