// API base URL
// Use o caminho relativo /api para funcionar no Vercel e no Vercel dev local.
const API_BASE = '/api';

// Número da barbearia para receber mensagens
const WHATSAPP_BARBEARIA = '33998034195';

// Dados de serviços - ATUALIZADO 6 de maio de 2025
const SERVICOS = [
    { id: 'corte', nome: 'Corte de Cabelo', preco: 'R$ 20,00' },
    { id: 'sobrancelha', nome: 'Sobrancelha', preco: 'R$ 5,00' },
    { id: 'corte-sobrancelha', nome: 'Corte + Sobrancelha', preco: 'R$ 25,00' },
    { id: 'corte-pigmentacao', nome: 'Corte + Pigmentação', preco: 'R$ 35,00' }
];

// Índices dos carrosseis
let carrosselIndex = 0;
let servicoIndex = 0;

// Dados do carrossel
let dadosCarrossel = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    inicializarPagina();
});

// Inicializar página
function inicializarPagina() {
    // Gerar carrosel de serviços
    gerarCarrosselServicos();

    // Definir serviço inicial no input hidden para envio
    document.getElementById('servico').value = SERVICOS[servicoIndex].id;

    // Event listeners
    document.getElementById('form-agendamento').addEventListener('submit', criarAgendamento);

    // Formatar WhatsApp conforme digita
    document.getElementById('whatsapp').addEventListener('input', formatarWhatsapp);
    document.getElementById('whatsapp-busca').addEventListener('input', formatarWhatsapp);

    // Fechar modal ao clicar fora
    document.getElementById('modal-whatsapp').addEventListener('click', (e) => {
        if (e.target.id === 'modal-whatsapp') {
            fecharModalWhatsapp();
        }
    });
}

// Gerar carrosel de serviços
function gerarCarrosselServicos() {
    const container = document.getElementById('carrossel-servicos');
    let html = '';

    SERVICOS.forEach((servico, index) => {
        const selecionado = index === servicoIndex ? 'selecionado' : '';
        html += `
            <div class="servico-card ${selecionado}" onclick="selecionarServico(${index})">
                <div class="servico-nome">${servico.nome}</div>
                <div class="servico-preco">${servico.preco}</div>
            </div>
        `;
    });

    container.innerHTML = html;
    atualizarServicoDisplay();
}

// Selecionar serviço
function selecionarServico(index) {
    servicoIndex = index;
    const servico = SERVICOS[index];
    document.getElementById('servico').value = servico.id;
    gerarCarrosselServicos();
    gerarSlotsCarrossel();
}

// Deslizar carrosel de serviços
function deslizarServicos(direcao) {
    const novoIndex = servicoIndex + direcao;
    
    if (novoIndex >= 0 && novoIndex < SERVICOS.length) {
        selecionarServico(novoIndex);
        
        // Scroll automático
        const carrossel = document.getElementById('carrossel-servicos');
        const card = carrossel.children[novoIndex];
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// Atualizar display do serviço selecionado
function atualizarServicoDisplay() {
    const servico = SERVICOS[servicoIndex];
    const display = document.getElementById('servico-selecionado-display');
    display.textContent = `✓ ${servico.nome} - ${servico.preco}`;
}

// Gerar slots do carrossel
async function gerarSlotsCarrossel() {
    const servico = SERVICOS[servicoIndex].id;

    // Gerar próximos 14 dias úteis (sem domingos)
    const slots = [];
    const hoje = new Date();
    const data = new Date(hoje);

    while (slots.length < 14) {
        const diaSemana = data.getDay();
        if (diaSemana !== 0) {
            const dataStr = data.toISOString().split('T')[0];
            slots.push({
                data: dataStr,
                dataFormatada: formatarDataCarrossel(data),
                diaSemana: obterDiaSemana(data),
            });
        }

        data.setDate(data.getDate() + 1);
    }

    dadosCarrossel = slots;
    carrosselIndex = 0;
    renderizarCarrossel();
    await carregarHorariosData();
}

// Renderizar carrossel
function renderizarCarrossel() {
    const container = document.getElementById('carrossel-slots');
    let html = '';

    dadosCarrossel.forEach((slot, index) => {
        const selecionado = index === carrosselIndex ? 'selecionado' : '';
        const dataComDia = `${slot.diaSemana} ${slot.dataFormatada}`;
        html += `
            <div class="slot ${selecionado}" onclick="selecionarSlot(${index})">
                <div class="slot-data">${dataComDia}</div>
            </div>
        `;
    });

    container.innerHTML = html;
    atualizarDataDisplay();
}

// Selecionar slot
function selecionarSlot(index) {
    carrosselIndex = index;
    renderizarCarrossel();
}

// Atualizar display da data selecionada
async function atualizarDataDisplay() {
    if (dadosCarrossel.length === 0) return;
    
    const slot = dadosCarrossel[carrosselIndex];
    const dataDisplay = document.getElementById('data-selecionada-display');
    dataDisplay.textContent = `${slot.diaSemana}, ${slot.dataFormatada}`;
    
    document.getElementById('data').value = slot.data;
    document.getElementById('hora').value = '';
    
    // Carregar horários para essa data
    await carregarHorariosData();
}

// Carregar horários disponíveis para a data selecionada
async function carregarHorariosData() {
    const slot = dadosCarrossel[carrosselIndex];
    const servico = SERVICOS[servicoIndex].id;
    
    if (!slot || !servico) return;

    try {
        const resposta = await fetch(`${API_BASE}/horarios-disponiveis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: slot.data, servico })
        });

        const dados = await resposta.json();
        
        if (resposta.ok) {
            renderizarHorarios(dados.horarios);
        } else {
            document.getElementById('horarios-grid').innerHTML = 
                '<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 10px;">Nenhum horário disponível</div>';
        }
    } catch (erro) {
        console.error('Erro ao carregar horários:', erro);
        document.getElementById('horarios-grid').innerHTML =
            '<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 10px;">Erro ao carregar horários. Verifique se o servidor está rodando.</div>';
    }
}

// Renderizar horários disponíveis
function renderizarHorarios(horarios) {
    const grid = document.getElementById('horarios-grid');
    const slot = dadosCarrossel[carrosselIndex];
    
    // Filtrar horários que já passaram se for hoje
    let horariosFiltrados = horarios;
    
    if (slot && ehHoje(slot.data)) {
        const agora = new Date();
        const minutoAtual = agora.getHours() * 60 + agora.getMinutes();
        
        horariosFiltrados = horarios.filter(horario => {
            const [hora, minuto] = horario.split(':').map(Number);
            const minutoHorario = hora * 60 + minuto;
            return minutoHorario >= minutoAtual;
        });
    }
    
    if (horariosFiltrados.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #999; padding: 10px;">Nenhum horário disponível</div>';
        return;
    }
    
    let html = '';
    horariosFiltrados.forEach(horario => {
        html += `
            <button type="button" class="horario-btn" onclick="selecionarHorario(event, '${horario}')">
                ${horario}
            </button>
        `;
    });
    
    grid.innerHTML = html;
}

// Verificar se a data é hoje
function ehHoje(dataStr) {
    const hoje = new Date();
    const dataParaComparar = new Date(dataStr + 'T00:00:00');
    
    return hoje.getFullYear() === dataParaComparar.getFullYear() &&
           hoje.getMonth() === dataParaComparar.getMonth() &&
           hoje.getDate() === dataParaComparar.getDate();
}

// Selecionar horário
function selecionarHorario(event, horario) {
    const slot = dadosCarrossel[carrosselIndex];
    
    // Atualizar valor do input hidden
    document.getElementById('hora').value = horario;
    document.getElementById('data').value = slot.data;
    
    // Atualizar visual do botão
    const botoes = document.querySelectorAll('.horario-btn');
    botoes.forEach(btn => {
        btn.classList.remove('selecionado');
    });
    event.target.classList.add('selecionado');
    
    // Atualizar info de slot selecionado
    const infoDiv = document.getElementById('slot-selecionado');
    infoDiv.innerHTML = `✓ ${slot.diaSemana}, ${slot.dataFormatada} às ${horario}`;
    infoDiv.classList.add('selecionado');
}

// Deslizar carrossel
function deslizarCarrossel(direcao) {
    const novoIndex = carrosselIndex + direcao;
    
    if (novoIndex >= 0 && novoIndex < dadosCarrossel.length) {
        carrosselIndex = novoIndex;
        renderizarCarrossel();
        
        // Scroll automático
        const carrossel = document.getElementById('carrossel-slots');
        const slot = carrossel.children[novoIndex];
        slot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

// Formatar data para carrossel
function formatarDataCarrossel(data) {
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    return `${dia}/${mes}`;
}

// Obter dia da semana (completo)
function obterDiaSemana(data) {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[data.getDay()];
}

// Formatar WhatsApp
function formatarWhatsapp(evento) {
    let valor = evento.target.value.replace(/\D/g, '');
    
    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }
    
    if (valor.length === 0) {
        evento.target.value = '';
    } else if (valor.length <= 2) {
        evento.target.value = `(${valor}`;
    } else if (valor.length <= 7) {
        evento.target.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    } else {
        evento.target.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
    }
}

// Gerar horários (13:30 - 19:30, 30 em 30 minutos)
function gerarHorarios() {
    const horarios = [];
    const inicio = 13;
    const fim = 20;
    
    for (let hora = inicio; hora < fim; hora++) {
        if (hora === 13) {
            horarios.push('13:30');
        } else {
            horarios.push(`${hora.toString().padStart(2, '0')}:00`);
            horarios.push(`${hora.toString().padStart(2, '0')}:30`);
        }
    }
    
    return horarios;
}

// Criar agendamento
async function criarAgendamento(evento) {
    evento.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.replace(/\D/g, '');
    const servico = SERVICOS[servicoIndex].id;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    // Validações
    if (!nome || !whatsapp || !data || !hora) {
        mostrarMensagem('Por favor, preencha todos os campos', 'erro');
        return;
    }

    if (nome.length < 3) {
        mostrarMensagem('Nome deve ter pelo menos 3 caracteres', 'erro');
        return;
    }

    if (whatsapp.length < 10) {
        mostrarMensagem('Número de WhatsApp inválido', 'erro');
        return;
    }

    try {
        const botao = document.querySelector('#form-agendamento button[type="submit"]');
        botao.disabled = true;
        botao.innerHTML = '<span class="spinner"></span> Agendando...';

        // Verificar se o horário já está ocupado (usando API)
        const respostaVerificacao = await fetch(`${API_BASE}/horarios-disponiveis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, servico })
        });

        if (respostaVerificacao.ok) {
            const dadosVerificacao = await respostaVerificacao.json();
            if (!dadosVerificacao.horarios.includes(hora)) {
                mostrarMensagem('Este horário não está mais disponível', 'erro');
                botao.disabled = false;
                botao.innerHTML = 'Agendar';
                return;
            }
        }

        // Criar agendamento no localStorage
        const agendamento = {
            id: Date.now().toString(),
            nome_cliente: nome,
            whatsapp: whatsapp,
            servico: servico,
            data_agendamento: data,
            hora_inicio: hora,
            criado_em: new Date().toISOString()
        };

        salvarAgendamentoLocal(agendamento);

        // Mostrar modal de confirmação
        mostrarModalConfirmacao(agendamento, nome, servico, data, hora, whatsapp);
        limparFormulario();

        botao.disabled = false;
        botao.innerHTML = 'Agendar';
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao criar agendamento', 'erro');
        const botao = document.querySelector('#form-agendamento button[type="submit"]');
        botao.disabled = false;
        botao.innerHTML = 'Agendar';
    }
}

// Mostrar modal de confirmação
function mostrarModalConfirmacao(agendamento, nome, servico, data, hora, whatsapp) {
    const servicoNome = obterNomeServico(servico);

    // Encontrar o slot selecionado para pegar as informações formatadas
    const slot = dadosCarrossel.find(s => s.data === data);
    const dataFormatadaModal = slot ? `${slot.diaSemana}, ${slot.dataFormatada}` : formatarDataCompleta(data);

    // Mensagem para a barbearia
    const mensagem = `Novo Agendamento!\n\n👤 Cliente: ${nome}\n📱 WhatsApp: +55${whatsapp}\n✂️ Serviço: ${servicoNome}\n📅 Data: ${dataFormatadaModal}\n🕐 Horário: ${hora}\n\nID do Agendamento: #${agendamento.id}`;
    const linkWhatsapp = `https://wa.me/55${WHATSAPP_BARBEARIA}?text=${encodeURIComponent(mensagem)}`;
    
    document.getElementById('modal-mensagem').innerHTML = `
        <strong>${nome}</strong>, seu agendamento foi criado com sucesso!<br><br>
        Confirme os dados:<br>
        <strong>${servicoNome}</strong><br>
        📅 ${dataFormatadaModal}<br>
        🕐 ${hora}
    `;
    
    document.getElementById('link-whatsapp-barbearia').href = linkWhatsapp;
    
    const modal = document.getElementById('modal-whatsapp');
    modal.classList.add('ativa');
}

// Fechar modal WhatsApp
function fecharModalWhatsapp() {
    const modal = document.getElementById('modal-whatsapp');
    modal.classList.remove('ativa');
}

// Limpar formulário
function limparFormulario() {
    document.getElementById('form-agendamento').reset();
    document.getElementById('slot-selecionado').innerHTML = '';
    document.getElementById('slot-selecionado').classList.remove('selecionado');
    
    // Limpar seleção de horário
    document.querySelectorAll('.horario-btn').forEach(btn => {
        btn.classList.remove('selecionado');
    });
    
    gerarCarrosselServicos();
    gerarSlotsCarrossel();
}

// Mostrar mensagem
function mostrarMensagem(texto, tipo) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.textContent = texto;
    mensagemDiv.className = `mensagem ${tipo}`;
    
    if (tipo === 'erro') {
        setTimeout(() => {
            mensagemDiv.className = '';
            mensagemDiv.textContent = '';
        }, 5000);
    }
}

// Mostrar meus agendamentos
function mostrarMeusAgendamentos() {
    document.getElementById('secao-agendamento').classList.remove('ativa');
    document.getElementById('secao-agendamento').classList.add('oculta');
    document.getElementById('secao-meus-agendamentos').classList.remove('oculta');
    document.getElementById('secao-meus-agendamentos').classList.add('ativa');
    document.getElementById('lista-agendamentos').innerHTML = '';
}

// Voltar para agendamento
function voltarParaAgendamento() {
    document.getElementById('secao-meus-agendamentos').classList.remove('ativa');
    document.getElementById('secao-meus-agendamentos').classList.add('oculta');
    document.getElementById('secao-agendamento').classList.remove('oculta');
    document.getElementById('secao-agendamento').classList.add('ativa');
    document.getElementById('whatsapp-busca').value = '';
    document.getElementById('lista-agendamentos').innerHTML = '';
}

// Buscar agendamentos
async function buscarAgendamentos() {
    const whatsapp = document.getElementById('whatsapp-busca').value.replace(/\D/g, '');

    console.log('Buscando agendamentos para WhatsApp:', whatsapp);

    if (whatsapp.length < 10) {
        mostrarMensagemBusca('Por favor, digite um número de WhatsApp válido', 'erro');
        return;
    }

    try {
        const botao = event.target;
        botao.disabled = true;
        botao.innerHTML = '<span class="spinner"></span>';

        // Buscar agendamentos do localStorage
        const agendamentos = obterAgendamentosPorWhatsapp(whatsapp);
        console.log('Agendamentos encontrados:', agendamentos.length);

        exibirAgendamentos(agendamentos);

        botao.disabled = false;
        botao.innerHTML = 'Buscar';
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagemBusca('Erro ao buscar agendamentos', 'erro');
    }
}

// Exibir agendamentos
function exibirAgendamentos(agendamentos) {
    const listaDiv = document.getElementById('lista-agendamentos');

    if (agendamentos.length === 0) {
        listaDiv.innerHTML = `
            <div class="vazio">
                <p>Nenhum agendamento encontrado para este número.</p>
                <small>Verifique se o número de WhatsApp está correto.</small>
            </div>
        `;
        return;
    }

    let html = '<div class="agendamentos-lista">';

    agendamentos.forEach(agendamento => {
        const dataFormatada = formatarDataCompleta(agendamento.data_agendamento);
        const servicoNome = obterNomeServico(agendamento.servico);
        const dataAgendamento = new Date(agendamento.data_agendamento + 'T00:00:00');
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataAgendamentoMeiaNoite = new Date(dataAgendamento);
        dataAgendamentoMeiaNoite.setHours(0, 0, 0, 0);
        const podeCancelar = dataAgendamentoMeiaNoite >= hoje;

        html += `
            <div class="agendamento-item">
                <div class="agendamento-info">
                    <h3>✂️ ${servicoNome}</h3>
                    <p><strong>📅 Data:</strong> ${dataFormatada}</p>
                    <p><strong>🕐 Horário:</strong> ${agendamento.hora_inicio}</p>
                    <p><strong>👤 Nome:</strong> ${agendamento.nome_cliente}</p>
                    <p><strong>ID:</strong> #${agendamento.id}</p>
                </div>
                <div class="agendamento-acoes">
                    ${podeCancelar ? `
                        <button class="btn btn-danger" onclick="cancelarAgendamento(${agendamento.id})">
                            ✕ Cancelar
                        </button>
                    ` : `
                        <span style="color: #999; font-size: 0.9em;">Agendamento passado</span>
                    `}
                </div>
            </div>
        `;
    });

    html += '</div>';
    listaDiv.innerHTML = html;
}

// Cancelar agendamento
async function cancelarAgendamento(id) {
    // Buscar o agendamento antes de mostrar o modal
    const agendamentos = obterAgendamentosLocais();
    const agendamento = agendamentos.find(a => a.id === id);

    if (!agendamento) {
        mostrarMensagemBusca('Agendamento não encontrado', 'erro');
        return;
    }

    // Mostrar modal de confirmação personalizado
    mostrarModalCancelamento(agendamento);
}

// Mostrar modal de cancelamento
function mostrarModalCancelamento(agendamento) {
    const servicoNome = obterNomeServico(agendamento.servico);
    const dataFormatada = formatarDataCompleta(agendamento.data_agendamento);

    document.getElementById('modal-cancelamento-mensagem').innerHTML = `
        <strong>Tem certeza que deseja cancelar este agendamento?</strong><br><br>
        <strong>✂️ ${servicoNome}</strong><br>
        📅 ${dataFormatada}<br>
        🕐 ${agendamento.hora_inicio}<br>
        👤 ${agendamento.nome_cliente}<br><br>
        <span style="color: #e74c3c; font-weight: bold;">⚠️ Esta ação não pode ser desfeita!</span>
    `;

    // Armazenar o ID do agendamento para uso posterior
    window.agendamentoParaCancelar = agendamento.id;

    const modal = document.getElementById('modal-cancelamento');
    modal.classList.add('ativa');
}

// Fechar modal de cancelamento
function fecharModalCancelamento() {
    const modal = document.getElementById('modal-cancelamento');
    modal.classList.remove('ativa');
    window.agendamentoParaCancelar = null;
}

// Confirmar cancelamento
async function confirmarCancelamento() {
    const id = window.agendamentoParaCancelar;

    if (!id) {
        console.error('ID do agendamento não encontrado');
        return;
    }

    console.log('Iniciando cancelamento do agendamento ID:', id);

    try {
        // Fechar modal
        fecharModalCancelamento();

        // Buscar o agendamento novamente
        const agendamentos = obterAgendamentosLocais();
        const agendamento = agendamentos.find(a => a.id === id);

        if (!agendamento) {
            console.error('Agendamento não encontrado para ID:', id);
            mostrarMensagemBusca('Agendamento não encontrado', 'erro');
            return;
        }

        console.log('Agendamento encontrado:', agendamento);

        // Remover do localStorage
        const removido = removerAgendamentoLocal(id);
        console.log('Agendamento removido do localStorage:', removido);

        if (removido) {
            // Enviar mensagem de cancelamento via WhatsApp
            console.log('Enviando mensagem de cancelamento...');
            enviarMensagemCancelamento(agendamento);

            mostrarMensagemBusca('Agendamento cancelado com sucesso! Mensagem enviada para o barbeiro.', 'sucesso');

            // Atualizar a lista após cancelamento
            const whatsapp = document.getElementById('whatsapp-busca').value.replace(/\D/g, '');
            console.log('Atualizando lista de agendamentos...');
            setTimeout(() => {
                buscarAgendamentos();
                // Atualizar horários disponíveis após cancelamento
                console.log('Atualizando horários disponíveis...');
                carregarHorariosData();
            }, 1000);
        } else {
            console.error('Erro ao remover agendamento do localStorage');
            mostrarMensagemBusca('Erro ao cancelar agendamento', 'erro');
        }
    } catch (erro) {
        console.error('Erro ao cancelar agendamento:', erro);
        mostrarMensagemBusca('Erro ao cancelar agendamento', 'erro');
    }
}

// Mostrar mensagem na busca
function mostrarMensagemBusca(texto, tipo) {
    const listaDiv = document.getElementById('lista-agendamentos');
    const mensagem = document.createElement('div');
    mensagem.className = `mensagem ${tipo}`;
    mensagem.textContent = texto;
    listaDiv.innerHTML = '';
    listaDiv.appendChild(mensagem);
}

// Obter nome do serviço
function obterNomeServico(servico) {
    const nomes = {
        'corte': 'Corte de Cabelo',
        'sobrancelha': 'Sobrancelha',
        'corte-sobrancelha': 'Corte + Sobrancelha',
        'corte-pigmentacao': 'Corte + Pigmentação'
    };
    return nomes[servico] || servico;
}

// Formatar data completa
function formatarDataCompleta(dataString) {
    const data = new Date(dataString + 'T00:00:00');
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return data.toLocaleDateString('pt-BR', opcoes)
        .split(' ')
        .map((palavra, index) => index === 0 ? palavra.charAt(0).toUpperCase() + palavra.slice(1) : palavra)
        .join(' ');
}

// Funções para localStorage de agendamentos
function salvarAgendamentoLocal(agendamento) {
    const agendamentos = obterAgendamentosLocais();
    agendamentos.push(agendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

function obterAgendamentosLocais() {
    const agendamentos = localStorage.getItem('agendamentos');
    return agendamentos ? JSON.parse(agendamentos) : [];
}

function obterAgendamentosPorWhatsapp(whatsapp) {
    const agendamentos = obterAgendamentosLocais();
    console.log('Total de agendamentos no localStorage:', agendamentos.length);
    console.log('Filtrando por WhatsApp:', whatsapp);

    const filtrados = agendamentos.filter(a => a.whatsapp === whatsapp);
    console.log('Agendamentos filtrados:', filtrados.length);

    return filtrados;
}

function removerAgendamentoLocal(id) {
    console.log('Removendo agendamento ID:', id);
    const agendamentos = obterAgendamentosLocais();
    console.log('Agendamentos antes da remoção:', agendamentos.length);

    const filtrados = agendamentos.filter(a => a.id !== id);
    console.log('Agendamentos após filtro:', filtrados.length);

    localStorage.setItem('agendamentos', JSON.stringify(filtrados));

    const removido = agendamentos.length !== filtrados.length;
    console.log('Agendamento removido com sucesso:', removido);

    return removido;
}

// Enviar mensagem de cancelamento via WhatsApp
function enviarMensagemCancelamento(agendamento) {
    const servicoNome = obterNomeServico(agendamento.servico);
    const dataFormatada = formatarDataCompleta(agendamento.data_agendamento);

    // Mensagem de cancelamento para a barbearia
    const mensagem = `CANCELAMENTO DE AGENDAMENTO!\n\n❌ Agendamento CANCELADO\n\n👤 Cliente: ${agendamento.nome_cliente}\n📱 WhatsApp: +55${agendamento.whatsapp}\n✂️ Serviço: ${servicoNome}\n📅 Data: ${dataFormatada}\n🕐 Horário: ${agendamento.hora_inicio}\n\nID do Agendamento: #${agendamento.id}`;

    const linkWhatsapp = `https://wa.me/55${WHATSAPP_BARBEARIA}?text=${encodeURIComponent(mensagem)}`;

    console.log('Tentando abrir WhatsApp com link:', linkWhatsapp);
    console.log('Mensagem:', mensagem);

    try {
        // Método 1: Tentar abrir em nova aba
        const novaAba = window.open(linkWhatsapp, '_blank', 'noopener,noreferrer');

        // Método 2: Se foi bloqueado, tentar criar link e clicar
        if (!novaAba || novaAba.closed || typeof novaAba.closed === 'undefined') {
            console.log('Popup bloqueado, tentando método alternativo...');

            // Criar um link temporário e simular clique
            const linkTemp = document.createElement('a');
            linkTemp.href = linkWhatsapp;
            linkTemp.target = '_blank';
            linkTemp.rel = 'noopener noreferrer';
            linkTemp.style.display = 'none';

            document.body.appendChild(linkTemp);
            linkTemp.click();
            document.body.removeChild(linkTemp);

            console.log('Link temporário clicado');
        } else {
            console.log('WhatsApp aberto com sucesso na nova aba');
        }
    } catch (erro) {
        console.error('Erro ao abrir WhatsApp:', erro);

        // Método 3: Fallback - mostrar link para copiar
        const linkCopiar = `https://wa.me/55${WHATSAPP_BARBEARIA}?text=${encodeURIComponent(mensagem)}`;
        console.log('Link para copiar manualmente:', linkCopiar);

        // Tentar copiar para área de transferência
        if (navigator.clipboard) {
            navigator.clipboard.writeText(linkCopiar).then(() => {
                alert('Link do WhatsApp copiado para a área de transferência! Cole no navegador.');
            }).catch(() => {
                alert(`Não foi possível abrir o WhatsApp automaticamente.\n\nCopie este link e abra no navegador:\n\n${linkCopiar}`);
            });
        } else {
            alert(`Não foi possível abrir o WhatsApp automaticamente.\n\nCopie este link e abra no navegador:\n\n${linkCopiar}`);
        }
    }
}
