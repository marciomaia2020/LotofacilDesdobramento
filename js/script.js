document.addEventListener("DOMContentLoaded", () => {
    const numerosTable = document.getElementById('numeros').getElementsByTagName('tr')[0];

    // Preenche a tabela com números de 01 a 25
    for (let i = 1; i <= 25; i++) {
        const td = document.createElement('td');
        td.textContent = i.toString().padStart(2, '0');
        td.classList.add('numero');
        numerosTable.appendChild(td);
    }
});

function gerarJogos() {
    const dezenasAdicionaisCheckboxes = document.querySelectorAll('.number-selection input[type="checkbox"]:checked');
    const dezenasAdicionais = Array.from(dezenasAdicionaisCheckboxes).map(checkbox => parseInt(checkbox.value));
    const excluir = document.getElementById('excluir').value.split(',').map(num => Number(num.trim())).filter(num => !isNaN(num));
    const fixar = Number(document.getElementById('fixar').value.trim());
    const quantidadeJogos = Number(document.getElementById('jogos').value.trim());
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    jogosGeradosDiv.innerHTML = ''; // Limpa jogos anteriores

    // Validação básica
    if (excluir.length !== 3 || isNaN(fixar) || isNaN(quantidadeJogos) || !Number.isInteger(quantidadeJogos)) {
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
        if (!excluir.includes(i)) {
            numeros.push(i);
        }
    }

    // Geração dos jogos
    for (let i = 0; i < quantidadeJogos; i++) {
        let jogo = [];
        if (fixar) {
            jogo.push(fixar);
        }
        // Adiciona as dezenas adicionais
        jogo = jogo.concat(dezenasAdicionais);
        // Adiciona números aleatórios restantes
        while (jogo.length < 15) {
            let numeroAleatorio = numeros[Math.floor(Math.random() * numeros.length)];
            if (!jogo.includes(numeroAleatorio)) {
                jogo.push(numeroAleatorio);
            }
        }
        jogo = jogo.sort((a, b) => a - b); // Ordena os números
        let jogoStr = jogo.map(num => num.toString().padStart(2, '0')).join(', ');

        // Adiciona o jogo à visualização
        const p = document.createElement('p');
        p.textContent = jogoStr;
        jogosGeradosDiv.appendChild(p);
    }
}

function salvarJogo() {
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    const jogos = Array.from(jogosGeradosDiv.getElementsByTagName('p')).map(p => p.textContent);

    if (jogos.length === 0) {
        alert('Nenhum jogo gerado para salvar.');
        return;
    }

    let conteudo = jogos.join('\n');
    let blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'jogos_loto.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function resetarJogo() {
    document.getElementById('excluir').value = '';
    document.getElementById('fixar').value = '';
    document.getElementById('jogos').value = '';
    document.querySelectorAll('.number-selection input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    document.getElementById('jogosGerados').innerHTML = '';
}

function exportarParaExcel() {
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    const jogos = Array.from(jogosGeradosDiv.getElementsByTagName('p')).map(p => p.textContent);

    if (jogos.length === 0) {
        alert('Nenhum jogo gerado para exportar.');
        return;
    }

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(jogos.map(jogo => [jogo]));
    XLSX.utils.book_append_sheet(wb, ws, "Jogos");
    XLSX.writeFile(wb, 'jogos_loto.xlsx');
}
