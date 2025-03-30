// Variável global para pontuação
let currentScore = 0;

// Função para atualizar a pontuação
function updateScore(points) {
    currentScore += points;
    document.getElementById('current-score').textContent = currentScore;
}

// Funções para instruções
function showInstructions() {
    document.getElementById('initial-screen').classList.remove('active');
    document.getElementById('instructions-screen').classList.add('active');
}

function hideInstructions() {
    document.getElementById('instructions-screen').classList.remove('active');
    document.getElementById('initial-screen').classList.add('active');
}

function startGame() {
    updateScore(50); // Pontuação inicial
    const initialScreen = document.getElementById('initial-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    
    initialScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
}

function goToNextScreen() {
    const playerName = document.getElementById('player-name').value.trim();
    
    if (!playerName) {
        alert('Por favor, digite seu nome para continuar!');
        return;
    }
    
    localStorage.setItem('playerName', playerName);
    
    // Mostrar a tela do alfabeto
    document.getElementById('welcome-screen').classList.remove('active');
    const alphabetScreen = document.getElementById('alphabet-screen');
    alphabetScreen.classList.add('active');
    
    // Gerar o alfabeto
    generateAlphabet();
}

function generateAlphabet() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const container = document.getElementById('alphabet-container');
    container.innerHTML = '';
    
    alphabet.forEach(letter => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter';
        letterDiv.textContent = letter;
        letterDiv.onclick = () => selectLetter(letter);
        container.appendChild(letterDiv);
    });
}

function selectLetter(letter) {
    const answerBox = document.getElementById('answer-box');
    const letterDiv = document.createElement('div');
    letterDiv.className = 'letter selected-letter';
    letterDiv.textContent = letter;
    letterDiv.onclick = () => letterDiv.remove(); // Permite remover a letra ao clicar
    answerBox.appendChild(letterDiv);
    
    // Criar uma nova letra no alfabeto para substituir a selecionada
    const container = document.getElementById('alphabet-container');
    const newLetterDiv = document.createElement('div');
    newLetterDiv.className = 'letter';
    newLetterDiv.textContent = letter;
    newLetterDiv.onclick = () => selectLetter(letter);
    container.appendChild(newLetterDiv);
}

function addSpace(containerId) {
    const container = document.getElementById(containerId);
    const spaceDiv = document.createElement('div');
    spaceDiv.className = 'letter selected-letter';
    spaceDiv.textContent = ' ';
    spaceDiv.style.width = '20px';
    spaceDiv.style.backgroundColor = '#e0e0e0';
    spaceDiv.onclick = () => spaceDiv.remove();
    container.appendChild(spaceDiv);
}

function deleteLastLetter(containerId) {
    const container = document.getElementById(containerId);
    if (container.lastChild) {
        container.removeChild(container.lastChild);
    }
}

function getWord(containerId) {
    const container = document.getElementById(containerId);
    const letters = Array.from(container.children).map(div => div.textContent);
    return letters.join('');
}

function checkAnswer() {
    const word = getWord('answer-box');
    
    if (word.trim().length === 0) {
        alert('Por favor, forme uma palavra antes de continuar!');
        return;
    }
    
    updateScore(100); // Pontuação por formar palavra de felicidade
    // Salvar a resposta
    localStorage.setItem('felicidade', word);
    
    // Navegar para a próxima tela
    document.getElementById('alphabet-screen').classList.remove('active');
    const sadnessScreen = document.getElementById('sadness-screen');
    sadnessScreen.classList.add('active');
    
    // Gerar novo alfabeto para a próxima pergunta
    generateSadnessAlphabet();
}

function generateSadnessAlphabet() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const container = document.getElementById('sadness-alphabet-container');
    container.innerHTML = '';
    
    // Criar um wrapper para organizar as letras em linhas
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.gap = '10px';
    wrapper.style.justifyContent = 'center';
    wrapper.style.maxWidth = '600px';
    wrapper.style.margin = '0 auto';
    
    // Adicionar as letras em grupos de 12 para formar linhas
    alphabet.forEach((letter, index) => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter';
        letterDiv.textContent = letter;
        letterDiv.onclick = () => selectSadnessLetter(letter);
        wrapper.appendChild(letterDiv);
    });
    
    container.appendChild(wrapper);
}

function selectSadnessLetter(letter) {
    const answerBox = document.getElementById('sadness-answer-box');
    const letterDiv = document.createElement('div');
    letterDiv.className = 'letter selected-letter';
    letterDiv.textContent = letter;
    letterDiv.onclick = () => letterDiv.remove();
    answerBox.appendChild(letterDiv);
    
    // Criar uma nova letra no alfabeto
    const container = document.getElementById('sadness-alphabet-container');
    const newLetterDiv = document.createElement('div');
    newLetterDiv.className = 'letter';
    newLetterDiv.textContent = letter;
    newLetterDiv.onclick = () => selectSadnessLetter(letter);
    container.appendChild(newLetterDiv);
}

function checkSadnessAnswer() {
    const word = getWord('sadness-answer-box');
    
    if (word.trim().length === 0) {
        alert('Por favor, forme uma palavra antes de continuar!');
        return;
    }
    
    updateScore(100); // Pontuação por formar palavra de tristeza
    // Salvar a resposta
    localStorage.setItem('tristeza', word);
    
    // Navegar para a próxima tela
    document.getElementById('sadness-screen').classList.remove('active');
    document.getElementById('drag-words-screen').classList.add('active');
    
    // Configurar o drag and drop
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const wordOptions = document.querySelectorAll('.word-option');
    const dropZone = document.getElementById('word-drop-zone');
    
    wordOptions.forEach(word => {
        word.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', word.textContent);
            word.classList.add('dragging');
        });
        
        word.addEventListener('dragend', () => {
            word.classList.remove('dragging');
        });
    });
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const word = e.dataTransfer.getData('text/plain');
        dropZone.innerHTML = word;
        dropZone.style.color = 'white';
        dropZone.style.background = '#4ECDC4';
        dropZone.style.fontSize = '1.5rem';
        
        // Mostrar o campo para escrever o significado
        document.getElementById('meaning-container').style.display = 'block';
    });
}

function checkWordMeaning() {
    const selectedWord = document.getElementById('word-drop-zone').textContent;
    const meaning = document.getElementById('word-meaning').value.trim();
    
    if (selectedWord === 'Arraste uma palavra para cá') {
        alert('Por favor, escolha uma palavra primeiro!');
        return;
    }
    
    if (!meaning) {
        alert('Por favor, escreva o significado da palavra.');
        return;
    }
    
    updateScore(600); // Pontuação inicial para significado
    const errors = countErrors(meaning); // Função para contar erros ortográficos
    updateScore(-10 * errors); // Dedução por erros
    
    // Salvar as respostas
    localStorage.setItem('palavraEscolhida', selectedWord);
    localStorage.setItem('significado', meaning);
    
    // Navegar para a tela da tabuada
    document.getElementById('drag-words-screen').classList.remove('active');
    document.getElementById('math-screen').classList.add('active');
    
    // Gerar as tabuadas
    generateMultiplicationTables();
}

function checkMathAnswers() {
    const inputs = document.querySelectorAll('.math-input');
    let correctAnswers = 0;
    let feedback = '';
    
    inputs.forEach(input => {
        const correctAnswer = parseInt(input.dataset.answer);
        const userAnswer = parseInt(input.value);
        const problemText = input.closest('.math-problem').querySelector('p').textContent;
        
        if (!isNaN(userAnswer)) {
            if (userAnswer === correctAnswer) {
                correctAnswers++;
                input.style.borderColor = '#4ECDC4'; // Verde para respostas corretas
                input.style.backgroundColor = '#E8F8F7';
            } else {
                input.style.borderColor = '#FF6B6B'; // Vermelho para respostas erradas
                input.style.backgroundColor = '#FFF0F0';
                feedback += `\n- A resposta correta para "${problemText}" é ${correctAnswer}`;
            }
        } else {
            input.style.borderColor = '#FFB347'; // Laranja para respostas em branco
            input.style.backgroundColor = '#FFF8F0';
            feedback += `\n- Você não respondeu: "${problemText}"`;
        }
    });

    // Atualizar pontuação (100 pontos por resposta correta)
    updateScore(correctAnswers * 100);

    // Mostrar feedback
    if (correctAnswers === inputs.length) {
        // Todas as respostas corretas
        document.getElementById('motivation-message').style.display = 'block';
        setTimeout(() => {
            document.getElementById('math-screen').classList.remove('active');
            document.getElementById('memory-game-screen').classList.add('active');
            initializeMemoryGame();
        }, 2000);
    } else {
        // Algumas respostas erradas
        let message = `Você acertou ${correctAnswers} de ${inputs.length} problemas!`;
        if (correctAnswers > 0) {
            message += `\n\nPontuação: +${correctAnswers * 100} pontos`;
        }
        if (feedback) {
            message += '\n\nCorreções:' + feedback;
        }
        message += '\n\nVocê pode tentar novamente ou seguir para o próximo desafio.';
        
        const continuar = confirm(message + '\n\nDeseja continuar para o próximo desafio?');
        if (continuar) {
            document.getElementById('math-screen').classList.remove('active');
            document.getElementById('memory-game-screen').classList.add('active');
            initializeMemoryGame();
        }
    }
}

const emotions = [
    { emoji: '😊', name: 'ALEGRIA' },
    { emoji: '😢', name: 'TRISTEZA' },
    { emoji: '😠', name: 'RAIVA' },
    { emoji: '😨', name: 'MEDO' },
    { emoji: '😍', name: 'AMOR' },
    { emoji: '🤗', name: 'CARINHO' },
    { emoji: '🤔', name: 'DÚVIDA' },
    { emoji: '😌', name: 'CALMA' }
];

function initializeMemoryGame() {
    const container = document.getElementById('memory-game-container');
    container.innerHTML = '';
    
    // Duplicar as emoções para criar pares
    const cardPairs = [...emotions, ...emotions]
        .sort(() => Math.random() - 0.5);
    
    cardPairs.forEach((emotion, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.emotion = emotion.name;
        
        card.innerHTML = `
            <div class="front-face">
                ${emotion.emoji}<br>${emotion.name}
            </div>
            <div class="back-face">
                ?
            </div>
        `;
        
        card.addEventListener('click', flipCard);
        container.appendChild(card);
    });
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    
    this.classList.add('flip');
    
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.emotion === secondCard.dataset.emotion;
    
    if (isMatch) {
        updateScore(50); // Pontuação por par encontrado
        disableCards();
        matchedPairs++;
        
        if (matchedPairs === emotions.length) {
            updateScore(200); // Bônus por completar o jogo
            setTimeout(() => {
                document.getElementById('memory-message').style.display = 'block';
                document.querySelector('#memory-game-screen .start-btn').style.display = 'block';
            }, 500);
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function goToDiary() {
    document.getElementById('memory-game-screen').classList.remove('active');
    document.getElementById('diary-screen').classList.add('active');
}

async function finishGame() {
    // Salvar o texto do diário e pontuação
    const diarioText = document.getElementById('diary-text').value;
    
    // Criar objeto com todos os dados do jogo
    const gameData = {
        'form-name': 'game-progress',
        currentUser: localStorage.getItem('currentUser'),
        playerName: localStorage.getItem('playerName'),
        felicidade: localStorage.getItem('felicidade'),
        tristeza: localStorage.getItem('tristeza'),
        palavraEscolhida: localStorage.getItem('palavraEscolhida'),
        significado: localStorage.getItem('significado'),
        diario: diarioText,
        pontuacao: currentScore,
        dataSubmissao: new Date().toISOString()
    };

    try {
        // Enviar dados para o Netlify Forms
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(gameData).toString()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Enviar também para a função do Netlify (backup)
        await fetch('/.netlify/functions/save-game-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData)
        });

        // Atualizar a pontuação final e mostrar tela final
        document.querySelector('.final-score').textContent = currentScore;
        document.getElementById('diary-screen').classList.remove('active');
        document.getElementById('final-screen').classList.add('active');

    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Ocorreu um erro ao salvar seus dados. Tentando método alternativo...');
        
        try {
            // Tentar método alternativo de envio
            const formElement = document.createElement('form');
            formElement.setAttribute('method', 'POST');
            formElement.setAttribute('name', 'game-progress');
            formElement.setAttribute('data-netlify', 'true');

            // Adicionar campos hidden com os dados
            Object.entries(gameData).forEach(([key, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value;
                formElement.appendChild(input);
            });

            // Adicionar ao documento e enviar
            document.body.appendChild(formElement);
            formElement.submit();
            document.body.removeChild(formElement);

            // Continuar para a tela final
            document.getElementById('diary-screen').classList.remove('active');
            document.getElementById('final-screen').classList.add('active');
            document.querySelector('.final-score').textContent = currentScore;

        } catch (secondError) {
            console.error('Erro no método alternativo:', secondError);
            if (confirm('Erro ao salvar os dados. Deseja tentar novamente?')) {
                await finishGame();
            } else {
                // Permitir continuar mesmo sem salvar
                document.getElementById('diary-screen').classList.remove('active');
                document.getElementById('final-screen').classList.add('active');
                document.querySelector('.final-score').textContent = currentScore;
            }
        }
    }
}

// Definir os usuários válidos
const validUsers = [
    { login: 'alexandre@123', password: '170285' },
    { login: 'flavia@123', password: '010185' },
    { login: 'roberta@123', password: '250689'},
    { login: 'tolentino', password: '170285'},
    { login: 'senhateste', password: '12345678'},
];

function checkLogin() {
    const login = document.getElementById('login-input').value;
    const password = document.getElementById('password-input').value;
    const errorElement = document.getElementById('login-error');
    
    // Verificar se os campos estão preenchidos
    if (!login || !password) {
        errorElement.textContent = 'Por favor, preencha todos os campos.';
        return;
    }
    
    // Procurar usuário válido
    const user = validUsers.find(u => u.login === login && u.password === password);
    
    if (user) {
        // Login bem sucedido
        localStorage.setItem('currentUser', user.login); // Guardar usuário logado
        errorElement.textContent = '';
        startGame();
    } else {
        // Login falhou
        errorElement.textContent = 'Login ou senha incorretos. Tente novamente.';
        document.getElementById('password-input').value = ''; // Limpar senha
    }
}

// Adicionar eventos para melhor experiência do usuário
document.addEventListener('DOMContentLoaded', function() {
    const loginInput = document.getElementById('login-input');
    const passwordInput = document.getElementById('password-input');
    const errorElement = document.getElementById('login-error');
    
    // Limpar mensagem de erro quando usuário começa a digitar
    loginInput.addEventListener('input', () => {
        errorElement.textContent = '';
    });
    
    passwordInput.addEventListener('input', () => {
        errorElement.textContent = '';
    });
    
    // Permitir login com Enter em qualquer campo
    loginInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkLogin();
        }
    });
    
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkLogin();
        }
    });
});

// Atualizar a função shareResults para incluir o usuário logado
function shareResults() {
    const currentUser = localStorage.getItem('currentUser') || 'Usuário';
    const playerName = localStorage.getItem('playerName') || 'Jogador';
    const felicidade = localStorage.getItem('felicidade') || '';
    const tristeza = localStorage.getItem('tristeza') || '';
    const palavraEscolhida = localStorage.getItem('palavraEscolhida') || '';
    const significado = localStorage.getItem('significado') || '';
    const diario = localStorage.getItem('diario') || '';
    const pontuacao = currentScore;

    const emailBody = `
Resultados do Jogo Pequenos Grandes Passos - Pilas do Bem

Jogador: ${playerName}
Pontuação Final: ${pontuacao}

RESPOSTAS DO JOGADOR:

1. Palavra que representa felicidade:
${felicidade}

2. Palavra que representa tristeza:
${tristeza}

3. Palavra escolhida:
${palavraEscolhida}

4. Significado da palavra:
${significado}

5. Diário do Vencedor:
${diario}
`;

    window.location.href = `mailto:tolentinoalexandre534@gmail.com?subject=Resultados do Jogo Pilas do Bem - ${playerName}&body=${encodeURIComponent(emailBody)}`;
}

function restartGame() {
    // Voltar para a tela inicial
    document.querySelector('.screen.active').classList.remove('active');
    document.getElementById('initial-screen').classList.add('active');
}

// Configuração do Netlify Forms
document.addEventListener('DOMContentLoaded', function() {
    const form = document.createElement('form');
    form.setAttribute('name', 'game-progress');
    form.setAttribute('method', 'POST');
    form.setAttribute('data-netlify', 'true');
    form.style.display = 'none';
    
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'form-name');
    hiddenInput.value = 'game-progress';
    
    form.appendChild(hiddenInput);
    document.body.appendChild(form);
});

// Função auxiliar para contar erros (exemplo simples)
function countErrors(text) {
    // Aqui você pode implementar uma verificação mais robusta
    // Este é apenas um exemplo básico
    const words = text.split(' ');
    let errors = 0;
    
    // Verificação básica de palavras
    words.forEach(word => {
        if (word.length > 2 && !isWordValid(word)) {
            errors++;
        }
    });
    
    return errors;
}

// Função auxiliar para verificar palavra (exemplo)
function isWordValid(word) {
    // Aqui você pode implementar uma verificação mais robusta
    // usando um dicionário ou API de correção ortográfica
    return true; // Por enquanto, todas as palavras são consideradas válidas
}

function checkPassword() {
    const password = document.getElementById('password-input').value;
    const errorElement = document.getElementById('password-error');
    
    if (password === 'flavia') {
        startGame();
    } else {
        errorElement.textContent = 'Senha incorreta. Tente novamente.';
        document.getElementById('password-input').value = '';
    }
}

// Adicionar evento para limpar mensagem de erro quando o usuário começar a digitar
document.getElementById('password-input').addEventListener('input', function() {
    document.getElementById('password-error').textContent = '';
});

// Adicionar evento para permitir pressionar Enter para verificar a senha
document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

function showPresentation() {
    document.getElementById('initial-screen').classList.remove('active');
    document.getElementById('presentation-screen').classList.add('active');
}

function hidePresentation() {
    document.getElementById('presentation-screen').classList.remove('active');
    document.getElementById('initial-screen').classList.add('active');
}

// Adicione este código junto com os outros event listeners
document.getElementById('diary-text').addEventListener('input', function(e) {
    localStorage.setItem('diario', e.target.value);
}); 