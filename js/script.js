document.addEventListener("DOMContentLoaded", () => {
    const numerosTable = document.getElementById('numeros').getElementsByTagName('tr')[0];
    
    // Preenche a tabela com números de 01 a 25
    for (let i = 1; i <= 25; i++) {
        const td = document.createElement('td');
        td.textContent = i.toString().padStart(2, '0');
        numerosTable.appendChild(td);
    }
});

function gerarJogos() {
    const excluir = document.getElementById('excluir').value.split(',').map(num => Number(num.trim())).filter(num => !isNaN(num));
    const fixar = Number(document.getElementById('fixar').value.trim());
    const dezenasAdicionais = Number(document.getElementById('dezenas-adicionais').value.trim());
    const quantidadeJogos = Number(document.getElementById('jogos').value.trim());
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    jogosGeradosDiv.innerHTML = ''; // Limpa jogos anteriores

    // Validação básica
    if (excluir.length !== 3 || isNaN(fixar) || isNaN(quantidadeJogos) || !Number.isInteger(quantidadeJogos) || dezenasAdicionais < 0 || dezenasAdicionais > 5) {
        alert('Por favor, insira as dezenas corretamente e selecione uma quantidade de jogos válida.');
        return;
    }

    // Verifica se a dezena fixada está entre as dezenas excluídas
    if (excluir.includes(fixar)) {
        alert('A dezena a ser fixada não pode estar entre as dezenas excluídas. Por favor, escolha outra.');
        return;
    }

    // Números disponíveis excluindo os selecionados pelo usuário
    let numeros = [];
    for (let i = 1; i <= 25; i++) {
        if (!excluir.includes(i) && i !== fixar) {
            numeros.push(i);
        }
    }

    if (numeros.length < 14) {
        alert('Não há números suficientes disponíveis para gerar jogos.');
        return;
    }

    for (let j = 0; j < quantidadeJogos; j++) {
        let jogo = [fixar]; // Começa com a dezena fixada
        let numerosRestantes = [...numeros];

        // Seleciona as dezenas adicionais (opcional)
        let adicionaisSelecionados = [];
        for (let i = 0; i < dezenasAdicionais; i++) {
            const randomIndex = Math.floor(Math.random() * numerosRestantes.length);
            adicionaisSelecionados.push(numerosRestantes.splice(randomIndex, 1)[0]);
        }

        adicionaisSelecionados.sort((a, b) => a - b);
        jogo = jogo.concat(adicionaisSelecionados);

        // Preenche com números restantes até ter a quantidade correta de dezenas
        while (jogo.length < 15 + dezenasAdicionais) {
            const randomIndex = Math.floor(Math.random() * numerosRestantes.length);
            jogo.push(numerosRestantes.splice(randomIndex, 1)[0]);
        }

        jogo.sort((a, b) => a - b);

        const p = document.createElement('p');
        p.textContent = jogo.map(num => num.toString().padStart(2, '0')).join(', ');
        jogosGeradosDiv.appendChild(p);
    }
}

function salvarJogo() {
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    const jogos = jogosGeradosDiv.getElementsByTagName('p');
    let conteudo = '';
    for (let jogo of jogos) {
        conteudo += jogo.textContent + '\n';
    }

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'jogos_lotofacil.txt';
    link.click();
}

function resetarJogo() {
    document.getElementById('excluir').value = '';
    document.getElementById('fixar').value = '';
    document.getElementById('jogos').value = '';
    document.getElementById('dezenas-adicionais').value = '';
    document.getElementById('jogosGerados').innerHTML = '';
}

function exportarParaExcel() {
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    const jogos = jogosGeradosDiv.getElementsByTagName('p');
    let dados = [];
    for (let jogo of jogos) {
        dados.push(jogo.textContent.split(', '));
    }

    const ws = XLSX.utils.aoa_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Jogos');
    XLSX.writeFile(wb, 'jogos_lotofacil.xlsx');
}