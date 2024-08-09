document.addEventListener("DOMContentLoaded", () => {
    const numerosTable = document.getElementById('numeros').getElementsByTagName('tr')[0];
    
    // Preenche a tabela com números de 01 a 25
    for (let i = 1; i <= 25; i++) {
        const td = document.createElement('td');
        td.textContent = i.toString().padStart(2, '0');
        td.style.fontFamily = 'Arial, sans-serif';
        td.style.fontSize = '14px';
        td.style.padding = '5px';
        td.style.border = '1px solid #ccc';
        td.style.textAlign = 'center';
        td.style.color = '#333';
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

    if (numeros.length < (15 - 1)) { // 15 menos a dezena fixada
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

/*ANTES
    // Adiciona um cabeçalho acima dos jogos gerados
    const header = document.createElement('div');
    header.innerHTML = `<span style="color: red; font-weight: bold;">${quantidadeJogos}</span> Jogo${quantidadeJogos > 1 ? 's' : ''} gerado${quantidadeJogos > 1 ? 's' : ''} com sucesso!`;
    header.style.backgroundColor = '#dff0d8';
    header.style.padding = '10px';
    header.style.border = '1px solid #d0e9c6';
    header.style.borderRadius = '5px';
    header.style.textAlign = 'center';
    header.style.marginBottom = '15px';
    jogosGeradosDiv.appendChild(header);
*/

/*DEPOIS*/
// Adiciona um cabeçalho acima dos jogos gerados
const header = document.createElement('div');
header.innerHTML = `<span style="color: red; font-weight: bold;">${quantidadeJogos}</span> Jogo${quantidadeJogos > 1 ? 's' : ''} gerado${quantidadeJogos > 1 ? 's' : ''} com <span style="color: red;">${15 + dezenasAdicionais}</span> dezena${15 + dezenasAdicionais > 1 ? 's' : ''} cada um!`;
header.style.backgroundColor = '#dff0d8';
header.style.padding = '10px';
header.style.border = '1px solid #d0e9c6';
header.style.borderRadius = '5px';
header.style.textAlign = 'center';
header.style.marginBottom = '15px';
jogosGeradosDiv.appendChild(header);


    // Conjunto para verificar duplicidade
    const jogosUnicos = new Set();
    let resultados = [];

    for (let j = 0; j < quantidadeJogos; j++) {
        let jogo = [fixar]; // Começa com a dezena fixada
        let numerosRestantes = [...numeros];

        // Seleciona as dezenas adicionais (opcional)
        let adicionaisSelecionados = [];
        for (let i = 0; i < dezenasAdicionais; i++) {
            if (numerosRestantes.length > 0) {
                const randomIndex = Math.floor(Math.random() * numerosRestantes.length);
                adicionaisSelecionados.push(numerosRestantes.splice(randomIndex, 1)[0]);
            }
        }

        // Preenche com números restantes até ter a quantidade correta de dezenas
        while (jogo.length < 15 + dezenasAdicionais) {
            if (numerosRestantes.length > 0) {
                const randomIndex = Math.floor(Math.random() * numerosRestantes.length);
                jogo.push(numerosRestantes.splice(randomIndex, 1)[0]);
            }
        }

        jogo.sort((a, b) => a - b); // Ordena as dezenas

        // Converte o jogo para uma string única para checar duplicidade
        const jogoString = jogo.join(', ');

        // Verifica se o jogo já foi gerado
        if (!jogosUnicos.has(jogoString)) {
            jogosUnicos.add(jogoString);

            const jogoElement = `J${j + 1}- ${jogo.map(num => {
                if (num === fixar) {
                    // Destaca a dezena fixada com uma cor diferente
                    return `<span style="color: red; font-weight: bold; font-family: Arial, sans-serif;">${num.toString().padStart(2, '0')}</span>`;
                } else {
                    return `<span style="font-family: Courier New, monospace;">${num.toString().padStart(2, '0')}</span>`;
                }
            }).join(', ')}`;

            resultados.push(`<p style="border: 1px solid #dcdcdc; padding: 10px; margin: 5px 0; text-align: center; background-color: #f5f5f5; color: #333; font-size: ${fontSize}; border-radius: 4px;">${jogoElement}</p>`);
        } else {
            // Reduz o índice para garantir que o número desejado de jogos seja gerado
            j--;
        }
    }

    jogosGeradosDiv.innerHTML += resultados.join('');


/*ANTES
    // Mensagem de sucesso exibida ao centro da tela
    const mensagemSucesso = document.createElement('div');
    mensagemSucesso.innerHTML = `<span style="color: red; font-weight: bold;">${quantidadeJogos}</span> Jogo${quantidadeJogos > 1 ? 's' : ''} gerado${quantidadeJogos > 1 ? 's' : ''} com sucesso!`;
    mensagemSucesso.style.position = 'fixed';
    mensagemSucesso.style.top = '50%';
    mensagemSucesso.style.left = '50%';
    mensagemSucesso.style.transform = 'translate(-50%, -50%)';
    mensagemSucesso.style.backgroundColor = '#dff0d8';
    mensagemSucesso.style.padding = '20px';
    mensagemSucesso.style.border = '1px solid #d0e9c6';
    mensagemSucesso.style.borderRadius = '5px';
    mensagemSucesso.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    mensagemSucesso.style.zIndex = '5000';
    document.body.appendChild(mensagemSucesso);

    setTimeout(() => {
        mensagemSucesso.remove();
    }, 3000); // Remove a mensagem após 3 segundos
*/

    /*DEPOIS*/
    // Mensagem de sucesso exibida ao centro da tela
    const mensagemSucesso = document.createElement('div');
    mensagemSucesso.innerHTML = `<span style="color: red; font-weight: bold;">${quantidadeJogos}</span> Jogo${quantidadeJogos > 1 ? 's' : ''} gerado${quantidadeJogos > 1 ? 's' : ''} com <span style="color: red;">${15 + dezenasAdicionais}</span> dezena${15 + dezenasAdicionais > 1 ? 's' : ''} cada um!`;
    mensagemSucesso.style.position = 'fixed';
    mensagemSucesso.style.top = '50%';
    mensagemSucesso.style.left = '50%';
    mensagemSucesso.style.transform = 'translate(-50%, -50%)';
    mensagemSucesso.style.backgroundColor = '#dff0d8';
    mensagemSucesso.style.padding = '20px';
    mensagemSucesso.style.border = '1px solid #d0e9c6';
    mensagemSucesso.style.borderRadius = '5px';
    mensagemSucesso.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    mensagemSucesso.style.zIndex = '5000';
    document.body.appendChild(mensagemSucesso);

    setTimeout(() => {
        mensagemSucesso.remove();
    }, 5000); // Remove a mensagem após 5 segundos


}

// Restante das funções de validação e outras lógicas


//INICIO PARA VALIDAÇÃO DOS InPUTS

function validarExcluir() {
    const excluirInput = document.getElementById('excluir');
    const excluirError = document.getElementById('excluir-error');
    const excluirValues = excluirInput.value.split(',').map(num => num.trim());
    const validRange = /^[0-9]{2}$/;

    // Verificar se o número de dezenas é exatamente 3
    if (excluirValues.length !== 3) {
        excluirError.textContent = 'Você deve excluir exatamente 3 dezenas.';
        return false;
    }

    // Verificar cada valor para garantir que esteja no formato correto e no intervalo válido
    for (let value of excluirValues) {
        if (!validRange.test(value)) {
            excluirError.textContent = 'Cada dezena deve ter exatamente dois dígitos (01 a 25).';
            return false;
        }

        const number = parseInt(value, 10);
        if (number < 1 || number > 25) {
            excluirError.textContent = 'Cada dezena deve ser um número entre 01 e 25.';
            return false;
        }
    }

    // Se todas as validações passarem
    excluirError.textContent = '';
    return true;
}


function validarFixar() {
    const fixarInput = document.getElementById('fixar');
    const fixarError = document.getElementById('fixar-error');
    const fixarValue = fixarInput.value.trim();

    // Verifica se o campo está vazio
    if (fixarValue === '') {
        fixarError.textContent = 'Você deve escolher uma dezena para fixar.';
        return false;
    }

    // Verifica se o valor está entre 1 e 25
    const fixarNumber = parseInt(fixarValue, 10);
    if (isNaN(fixarNumber) || fixarNumber < 1 || fixarNumber > 25) {
        fixarError.textContent = 'Por favor, insira uma dezena válida entre 01 e 25.';
        return false;
    }

    // Se todas as validações passarem
    fixarError.textContent = '';
    return true;
}

/* ANTES

function validarJogos() {
    const jogosInput = document.getElementById('jogos');
    const jogosError = document.getElementById('jogos-error');
    const jogosValue = parseInt(jogosInput.value, 10);
    
    if (isNaN(jogosValue) || jogosValue < 1 || jogosValue > 5000) {
        jogosError.textContent = 'Selecione um número válido de jogos (1 a 5000).';
        return false;
    } else {
        jogosError.textContent = '';
        return true;
    }
}
*/

/*DEPOIS*/
function validarJogos() {
    const jogosInput = document.getElementById('jogos');
    const jogosError = document.getElementById('jogos-error');
    const jogosValue = parseInt(jogosInput.value.trim(), 10);

    // Validação do número de jogos, agora permitido de 1 até 5000
    if (isNaN(jogosValue) || jogosValue < 1 || jogosValue > 5000) {
        jogosError.textContent = 'Selecione um número válido de jogos (1 a 5000).';
        return false;
    } else {
        jogosError.textContent = '';
        return true;
    }
}

function validarDezenasAdicionais() {
    const dezenasAdicionaisInput = document.getElementById('dezenas-adicionais');
    const dezenasAdicionaisError = document.getElementById('dezenas-adicionais-error');
    const dezenasAdicionaisValue = parseInt(dezenasAdicionaisInput.value.trim(), 10);

    // Verifica se o valor é um número
    if (isNaN(dezenasAdicionaisValue)) {
        dezenasAdicionaisError.textContent = 'Por favor, insira um número válido.';
        return false;
    }

    // Verifica se o valor está no intervalo válido
    if (dezenasAdicionaisValue < 0 || dezenasAdicionaisValue > 5) {
        dezenasAdicionaisError.textContent = 'As dezenas adicionais devem estar entre 0 e 5.';
        return false;
    }

    // Mensagem para o caso de 0 dezenas adicionais
    if (dezenasAdicionaisValue === 0) {
        dezenasAdicionaisError.textContent = 'Se escolher zero, o jogo será gerado com um jogo simples (15 dezenas).';
        return true; // O valor 0 é aceitável, então retornamos true aqui
    }

    // Se todas as validações passarem
    dezenasAdicionaisError.textContent = '';
    return true;
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



//ESTE
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

//ESTE
function resetar() {
    // Limpa os valores dos campos de entrada
    document.getElementById('excluir').value = '';
    document.getElementById('fixar').value = '';
    document.getElementById('jogos').value = '';
    document.getElementById('dezenas-adicionais').value = '';

    // Limpa o conteúdo gerado
    document.getElementById('jogosGerados').innerHTML = '';

    // Limpa as mensagens de erro
    document.getElementById('excluir-error').textContent = '';
    document.getElementById('fixar-error').textContent = '';
    document.getElementById('jogos-error').textContent = '';
    document.getElementById('dezenas-adicionais-error').textContent = '';
}

//ESTE
function exportarParaExcel() {
    const jogosGeradosDiv = document.getElementById('jogosGerados');
    if (!jogosGeradosDiv) {
        alert('Elemento com id "jogosGerados" não encontrado.');
        return;
    }

    const jogos = jogosGeradosDiv.getElementsByTagName('p');
    if (jogos.length === 0) {
        alert('Nenhum jogo encontrado para exportar.');
        return;
    }

    let dados = [];
    let maxDezenas = 0;

    for (let jogo of jogos) {
        // Extrai o texto e separa os números
        const texto = jogo.textContent;
        const partes = texto.split('-')[1].trim(); // Extrai a parte após o hífen
        const dezenas = partes.split(', ').map(num => num.trim()); // Divide as dezenas

        // Atualiza o número máximo de dezenas
        if (dezenas.length > maxDezenas) {
            maxDezenas = dezenas.length;
        }

        // Adiciona cada dezena em uma célula separada na mesma linha
        dados.push(dezenas);
    }

    // Cria o cabeçalho com base no número máximo de dezenas
    let cabecalho = [];
    for (let i = 1; i <= maxDezenas; i++) {
        cabecalho.push(`Dez ${i < 10 ? '0' + i : i}`); // Formata o número com dois dígitos
    }
    
    // Adiciona o cabeçalho à primeira linha dos dados
    dados.unshift(cabecalho);

    // Cria a planilha e o livro
    const ws = XLSX.utils.aoa_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Jogos');

    // Salva o arquivo Excel
    XLSX.writeFile(wb, 'jogos_lotofacil.xlsx');
}


