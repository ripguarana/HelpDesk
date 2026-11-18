const CHAVE_STORAGE = "chamados";

const STATUS_DISPONIVEIS = [
    "Aberto",
    "Em andamento",
    "Resolvido"
];

// Busca todos os chamados salvos.
function listarChamados() {
    const dados = localStorage.getItem(CHAVE_STORAGE);

    if (!dados) {
        return [];
    }

    try {
        const chamados = JSON.parse(dados);
        return Array.isArray(chamados) ? chamados : [];
    } catch (erro) {
        console.error("Erro ao ler chamados:", erro);
        return [];
    }
}

// Salva a lista completa no LocalStorage.
function salvarListaCompleta(chamados) {
    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(chamados)
    );
}

// Gera um novo ID.
function gerarNovoID() {
    const chamados = listarChamados();

    if (chamados.length === 0) {
        return 1;
    }

    const maiorId = Math.max(
        ...chamados.map(chamado => chamado.id)
    );

    return maiorId + 1;
}

// Registra um novo chamado.
function salvarChamado(dadosChamado) {
    const chamados = listarChamados();

    const novoChamado = {
        id: gerarNovoID(),
        setor: dadosChamado.setor,
        descricao: dadosChamado.descricao,
        prioridade: dadosChamado.prioridade,
        status: "Aberto",
        dataCriacao: new Date().toISOString()
    };

    chamados.push(novoChamado);

    salvarListaCompleta(chamados);

    return novoChamado;
}

// Atualiza o status de um chamado.
function atualizarStatus(id, novoStatus) {
    if (!STATUS_DISPONIVEIS.includes(novoStatus)) {
        return false;
    }

    const chamados = listarChamados();

    const chamado = chamados.find(
        chamado => chamado.id === id
    );

    if (!chamado) {
        console.warn(`Chamado com ID ${id} não encontrado.`);
        return false;
    }

    chamado.status = novoStatus;

    salvarListaCompleta(chamados);

    return true;
}

// Filtra os chamados por status.
function filtrarPorStatus(status) {
    const chamados = listarChamados();

    if (!status || status === "Todos") {
        return chamados;
    }

    return chamados.filter(
        chamado => chamado.status === status
    );
}

// Remove um chamado pelo ID.
function removerChamado(id) {
    const chamados = listarChamados();

    const listaAtualizada = chamados.filter(
        chamado => chamado.id !== id
    );

    if (listaAtualizada.length === chamados.length) {
        return false;
    }

    salvarListaCompleta(listaAtualizada);

    return true;
}

// Apaga todos os chamados.
function limparTodosChamados() {
    localStorage.removeItem(CHAVE_STORAGE);
}