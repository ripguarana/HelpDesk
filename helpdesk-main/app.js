const formChamado = document.getElementById("form-chamado");
const mensagemStatus = document.getElementById("mensagem-status");

formChamado.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const dadosChamado = {
        setor: document.getElementById("setor").value.trim(),
        prioridade: document.getElementById("prioridade").value,
        descricao: document.getElementById("descricao").value.trim()
    };

    if (!validarDadosChamado(dadosChamado)) {
        exibirMensagem("Preencha todos os campos.", "erro");
        return;
    }

    try {
        const chamadoCriado = salvarChamado(dadosChamado);

        exibirMensagem(
            `Chamado #${chamadoCriado.id} registrado com sucesso!`,
            "sucesso"
        );

        formChamado.reset();

    } catch (erro) {
        console.error(erro);
        exibirMensagem(
            "Não foi possível salvar o chamado.",
            "erro"
        );
    }
});

function validarDadosChamado(dados) {
    return (
        dados.setor !== "" &&
        dados.prioridade !== "" &&
        dados.descricao !== ""
    );
}

function exibirMensagem(texto, tipo) {
    mensagemStatus.textContent = texto;
    mensagemStatus.className = `mensagem-status ${tipo}`;
}