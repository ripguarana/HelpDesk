const containerLista = document.getElementById("lista-chamados");
const mensagemVazia = document.getElementById("mensagem-vazia");
const filtroStatus = document.getElementById("filtro-status");

// Renderiza os chamados ao abrir a página.
renderizarLista();

// Atualiza a lista quando o filtro muda.
filtroStatus.addEventListener("change", renderizarLista);

function renderizarLista() {
    const statusSelecionado = filtroStatus.value;

    const chamados = filtrarPorStatus(statusSelecionado);

    containerLista.innerHTML = "";

    if (chamados.length === 0) {
        mensagemVazia.hidden = false;
        return;
    }

    mensagemVazia.hidden = true;

    // Mostra os chamados mais recentes primeiro.
    const chamadosOrdenados = [...chamados].reverse();

    chamadosOrdenados.forEach(chamado => {
        containerLista.appendChild(
            criarCartaoChamado(chamado)
        );
    });
}

// Cria um elemento HTML com texto seguro.
function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}

// Cria o cartão de um chamado.
function criarCartaoChamado(chamado) {
    const cartao = criarElemento("article", "cartao-chamado");

    // Cabeçalho.
    const topo = criarElemento("div", "cartao-chamado-topo");

    const numero = criarElemento(
        "span",
        "numero-chamado",
        `#${chamado.id}`
    );

    const prioridade = criarElemento(
        "span",
        `badge-prioridade prioridade-${chamado.prioridade.toLowerCase()}`,
        chamado.prioridade
    );

    topo.append(numero, prioridade);

    // Informações.
    const titulo = criarElemento(
        "h2",
        "titulo-chamado",
        `Local: ${chamado.setor}`
    );

    const descricao = criarElemento(
        "p",
        "descricao-chamado",
        chamado.descricao
    );

    const data = criarElemento(
        "span",
        "data-chamado",
        `Criado em: ${formatarData(chamado.dataCriacao)}`
    );

    // Rodapé e alteração de status.
    const rodape = criarElemento("div", "rodape-chamado");

    const label = criarElemento(
        "label",
        "rotulo-status",
        "Status:"
    );

    const seletorStatus = document.createElement("select");
    seletorStatus.className = "select-status";
    seletorStatus.dataset.id = chamado.id;

    seletorStatus.setAttribute(
        "aria-label",
        `Status do chamado ${chamado.id}`
    );

    STATUS_DISPONIVEIS.forEach(status => {
        const opcao = document.createElement("option");

        opcao.value = status;
        opcao.textContent = status;

        if (status === chamado.status) {
            opcao.selected = true;
        }

        seletorStatus.appendChild(opcao);
    });

    seletorStatus.addEventListener("change", aoMudarStatus);

    label.htmlFor = `status-${chamado.id}`;
    seletorStatus.id = `status-${chamado.id}`;

    rodape.append(label, seletorStatus);

    cartao.append(
        topo,
        titulo,
        descricao,
        data,
        rodape
    );

    return cartao;
}

// Executada quando o usuário altera o status.
function aoMudarStatus(evento) {
    const id = Number(evento.target.dataset.id);
    const novoStatus = evento.target.value;

    const sucesso = atualizarStatus(id, novoStatus);

    if (!sucesso) {
        alert("Não foi possível atualizar o status desse chamado.");
        return;
    }

    renderizarLista();
}

// Formata a data para DD/MM/AAAA HH:MM.
function formatarData(dataISO) {
    const data = new Date(dataISO);

    if (Number.isNaN(data.getTime())) {
        return "Data indisponível";
    }

    return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}