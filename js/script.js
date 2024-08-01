document.addEventListener("DOMContentLoaded", () => {
    const numerosTable = document.getElementById('numeros').getElementsByTagName('tr')[0];
    
    // Preenche a tabela com números de 01 a 25
    for (let i = 1; i <= 25; i++) {
        const td = document.createElement('td');
        td.textContent = i.toString().padStart(2, '0');
        td.style.fontFamily = 'Arial, sans-serif'; // Fonte para números
        td.style.fontSize = '14px'; // Tamanho da fonte
        td.style.padding = '5px'; // Espaçamento interno
        td.style.border = '1px solid #ccc'; // Borda
        td.style.textAlign = 'center'; // Centraliza o texto
        td.style.color = '#333'; // Cor do texto
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
        if (!excluir.includes(i)) {
            numeros.push(i);
        }
    }

    // Remove a dezena fixada dos números restantes
    numeros = numeros.filter(num => num !== fixar);

    if (numeros.length < 14) {
        alert('Não há números suficientes disponíveis para gerar jogos.');
        return;
    }

    // Define o limite máximo de jogos para evitar problemas de desempenho
    const limiteMaximoJogos = 5000; // Ajuste esse valor conforme necessário

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

    // Conjunto para verificar duplicidade
    const jogosUnicos = new Set();

    for (let j = 0; j < quantidadeJogos; j++) {
        let jogo = [fixar]; // Começa com a dezena fixada
        let numerosRestantes = [...numeros];

        // Seleciona as dezenas adicionais (opcional)
        let adicionaisSelecionados = [];
        for (let i = 0; i < dezenasAdicionais; i++) {
            const randomIndex = Math.floor(Math.random() * numerosRestantes.length);
            adicionaisSelecionados.push(numerosRestantes.splice(randomIndex, 1)[0]);
        }

        // Preenche com números restantes até ter a quantidade correta de dezenas
        while (jogo.length < 15 + dezenasAdicionais) {
            const randomIndex = Math.floor(Math.random() * numerosRestantes.length);
            jogo.push(numerosRestantes.splice(randomIndex, 1)[0]);
        }

        jogo.sort((a, b) => a - b); // Ordena as dezenas

        // Converte o jogo para uma string única para checar duplicidade
        const jogoString = jogo.join(', ');

        // Verifica se o jogo já foi gerado
        if (!jogosUnicos.has(jogoString)) {
            jogosUnicos.add(jogoString);

            const jogoElement = document.createElement('p');
            jogoElement.innerHTML = `J${j + 1}- ${jogo.map(num => {
                if (num === fixar) {
                    // Destaca a dezena fixada com uma cor diferente
                    return `<span style="color: red; font-weight: bold; font-family: Arial, sans-serif;">${num.toString().padStart(2, '0')}</span>`;
                } else {
                    return `<span style="font-family: Courier New, monospace;">${num.toString().padStart(2, '0')}</span>`;
                }
            }).join(', ')}`;
            jogoElement.style.border = '1px solid #dcdcdc'; // Tom de cinza claro para a borda
            jogoElement.style.padding = '10px';
            jogoElement.style.margin = '5px 0';
            jogoElement.style.textAlign = 'center'; // Centraliza o texto
            jogoElement.style.backgroundColor = '#f5f5f5'; // Tom de cinza claro para o fundo
            jogoElement.style.color = '#333'; // Tom de cinza escuro para o texto
            jogoElement.style.fontSize = fontSize; // Ajusta o tamanho da fonte
            jogoElement.style.borderRadius = '4px'; // Bordas arredondadas

            jogosGeradosDiv.appendChild(jogoElement);
        } else {
            // Reduz o índice para garantir que o número desejado de jogos seja gerado
            j--;
        }
    }
}

function salvarJogo() {
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    const jogos = jogosGeradosDiv.getElementsByTagName('p');
    let conteudo = '';
    
    for (let jogo of jogos) {
        // Obter o texto do jogo
        let texto = jogo.textContent;
        
        // Remove a letra 'J' seguida de números e espaços
        texto = texto.replace(/^J\d+\s*-?\s*/i, '');
        
        // Substituir as vírgulas por espaços
        texto = texto.replace(/,/g, ' ');
        
        // Adicionar o texto ao conteúdo final
        conteudo += texto.trim() + '\n';
    }

    // Criar um blob com o conteúdo e gerar um link para download
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'jogos_lotofacil.txt';
    
    // Simular o clique no link para iniciar o download
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
//INICIO PARA VALIDAÇÃO DOS IMPUTS

function validarExcluir() {
    const excluirInput = document.getElementById('excluir');
    const excluirError = document.getElementById('excluir-error');
    const excluirValues = excluirInput.value.split(',').map(num => num.trim());
    
    if (excluirValues.length !== 3) {
        excluirError.textContent = 'Você deve excluir exatamente 3 dezenas.';
        return false;
    } else {
        excluirError.textContent = '';
        return true;
    }
}

function validarFixar() {
    const fixarInput = document.getElementById('fixar');
    const fixarError = document.getElementById('fixar-error');
    const fixarValue = fixarInput.value.trim();
    
    if (fixarValue === '') {
        fixarError.textContent = 'Você deve escolher uma dezena para fixar.';
        return false;
    } else {
        fixarError.textContent = '';
        return true;
    }
}

function validarJogos() {
    const jogosInput = document.getElementById('jogos');
    const jogosError = document.getElementById('jogos-error');
    const jogosValue = parseInt(jogosInput.value, 10);
    
    if (isNaN(jogosValue) || jogosValue < 1 || jogosValue > 1000) {
        jogosError.textContent = 'Selecione um número válido de jogos (1 a 1000).';
        return false;
    } else {
        jogosError.textContent = '';
        return true;
    }
}

function validarFormulario() {
    const isExcluirValid = validarExcluir();
    const isFixarValid = validarFixar();
    const isJogosValid = validarJogos();

    const gerarJogosButton = document.getElementById('gerar-jogos');
    gerarJogosButton.disabled = !(isExcluirValid && isFixarValid && isJogosValid);
}

document.getElementById('excluir').addEventListener('input', validarFormulario);
document.getElementById('fixar').addEventListener('input', validarFormulario);
document.getElementById('jogos').addEventListener('input', validarFormulario);

/*
function gerarJogos() {
    // Lógica para gerar os jogos vai aqui
    alert('Jogos gerados!');
}*/


//FINAL PARA VALIDAÇÃO DOS INPUTS