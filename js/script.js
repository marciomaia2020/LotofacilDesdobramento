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
        if (!excluir.includes(i) && i !== fixar) {
            numeros.push(i);
        }
    }

    if (numeros.length < 14) {
        alert('Não há números suficientes disponíveis para gerar os jogos. Verifique suas exclusões.');
        return;
    }

    // Gera os jogos com base na lógica fornecida
    const jogos = [];
    for (let i = 0; i < quantidadeJogos; i++) {
        let jogo = [fixar];
        let nums = [...numeros]; // Cópia do array de números disponíveis
        nums = nums.filter(num => num !== fixar); // Remove a dezena fixa da lista de números disponíveis

        // Adiciona números ao jogo
        while (jogo.length < 15) {
            let num = nums[Math.floor(Math.random() * nums.length)];
            if (!jogo.includes(num)) {
                jogo.push(num);
            }
        }
        
        // Ordena e formata o jogo
        jogo.sort((a, b) => a - b);
        jogos.push(jogo);
    }

    // Exibe os jogos gerados
    jogos.forEach((jogo, index) => {
        const jogoFormatado = jogo.map(num => num === fixar ? `<span class="dezena-fixa">${num.toString().padStart(2, '0')}</span>` : num.toString().padStart(2, '0')).join(', ');
        jogosGeradosDiv.innerHTML += `<p><small>Jogo ${index + 1}:</small> ${jogoFormatado}</p>`;
    });
}

function salvarJogo() {
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    if (!jogosGeradosDiv.innerHTML) {
        alert('Nenhum jogo gerado para salvar.');
        return;
    }

    let textoParaSalvar = '';
    const jogos = jogosGeradosDiv.getElementsByTagName('p');

    for (let jogo of jogos) {
        // Remove a parte "Jogo X:" e formata as dezenas separadas por espaço
        const jogoTexto = jogo.innerText.replace(/^Jogo \d+:\s*/, '');
        const jogoFormatado = jogoTexto.split(',').map(num => num.trim()).join(' ');
        textoParaSalvar += jogoFormatado + '\n';
    }

    // Cria um blob com o texto formatado
    const blob = new Blob([textoParaSalvar], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Cria um link temporário para download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Lotofacil.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Limpa o URL
}

function resetarJogo() {
    document.getElementById('excluir').value = '';
    document.getElementById('fixar').value = '';
    document.getElementById('dezenas-adicionais').value = '';
    document.getElementById('jogos').value = '';
    document.getElementById('jogosGerados').innerHTML = '';
}

function exportarParaExcel() {
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    if (!jogosGeradosDiv.innerHTML) {
        alert('Nenhum jogo gerado para exportar.');
        return;
    }

    let data = [];
    const jogos = jogosGeradosDiv.getElementsByTagName('p');
    for (let jogo of jogos) {
        data.push([jogo.innerText]);
    }

    let worksheet = XLSX.utils.aoa_to_sheet(data);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jogos');
    XLSX.writeFile(workbook, 'jogos.xlsx');
}
