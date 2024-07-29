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

    // Define o limite máximo de jogos para evitar problemas de desempenho
    const limiteMaximoJogos = 20; // Ajuste esse valor conforme necessário

    if (quantidadeJogos > limiteMaximoJogos) {
        alert(`A quantidade máxima de jogos é ${limiteMaximoJogos}. Por favor, ajuste a quantidade de jogos.`);
        return;
    }

    // Função para calcular o tamanho da fonte com base no número de jogos
    function getFontSize(numJogos) {
        if (numJogos <= 15) {
            return '16px'; // Tamanho padrão para até 15 jogos
        } else if (numJogos <= 20) {
            return '14px'; // Reduz um pouco o tamanho para até 20 jogos
        } else {
            return '12px'; // Reduz ainda mais para mais de 20 jogos
        }
    }

    // Calcula o tamanho da fonte com base no número de jogos
    const fontSize = getFontSize(quantidadeJogos);

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

        jogo.sort((a, b) => a - b); // Ordena as dezenas

        const jogoElement = document.createElement('p');
        jogoElement.textContent = `J${j + 1}- ${jogo.map(num => num.toString().padStart(2, '0')).join(', ')}`;
        jogoElement.style.border = '1px solid #ccc';
        jogoElement.style.padding = '10px';
        jogoElement.style.margin = '5px 0';
        jogoElement.style.textAlign = 'center'; // Centraliza o texto
        jogoElement.style.backgroundColor = 'green'; // Define a cor de fundo
        jogoElement.style.color = 'white'; // Define a cor do texto
        jogoElement.style.fontSize = fontSize; // Ajusta o tamanho da fonte

        jogosGeradosDiv.appendChild(jogoElement);
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
