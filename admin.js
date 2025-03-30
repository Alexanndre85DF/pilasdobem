// Configuração de administradores
const adminUsers = [
    { login: 'administrador', password: '123456' }
];

let responses = []; // Variável global para armazenar as respostas

// Configuração inicial
const NETLIFY_SITE_ID = 'seu-site-id-aqui'; // Substitua pelo ID do seu site

// Token de acesso ao Netlify (deve ser configurado nas variáveis de ambiente)
const NETLIFY_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
const SITE_ID = process.env.SITE_ID; // ID do seu site no Netlify

// Função de login administrativo
function adminLogin() {
    const login = document.getElementById('admin-login').value;
    const password = document.getElementById('admin-password').value;
    const errorElement = document.getElementById('admin-login-error');

    const admin = adminUsers.find(a => a.login === login && a.password === password);

    if (admin) {
        localStorage.setItem('adminUser', admin.login);
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard').classList.add('active');
        loadFormSubmissions();
    } else {
        errorElement.textContent = 'Login ou senha incorretos';
    }
}

// Função para carregar os dados do formulário
async function loadFormSubmissions() {
    try {
        const response = await fetch('/.netlify/functions/get-submissions');
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        displayData(data);
        updateUserFilter(data);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar os dados. Por favor, recarregue a página.');
    }
}

// Função para exibir os dados na tabela
function displayData(submissions) {
    const tableBody = document.getElementById('data-table');
    tableBody.innerHTML = '';

    if (!submissions || submissions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Nenhum dado encontrado</td></tr>';
        return;
    }

    submissions.forEach(submission => {
        const row = document.createElement('tr');
        const date = new Date(submission.created_at).toLocaleDateString();
        
        row.innerHTML = `
            <td>${date}</td>
            <td>${submission.data.currentUser || 'N/A'}</td>
            <td>${submission.data.playerName || 'N/A'}</td>
            <td>${submission.data.pontuacao || '0'}</td>
            <td>
                <button onclick="viewDetails('${submission.id}')" class="view-btn">
                    Ver Detalhes
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function updateUserFilter(submissions) {
    const userFilter = document.getElementById('user-filter');
    const users = [...new Set(submissions.map(s => s.data.currentUser).filter(Boolean))];
    
    userFilter.innerHTML = '<option value="">Todos os usuários</option>';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        userFilter.appendChild(option);
    });
}

function filterData() {
    const dateFilter = document.getElementById('date-filter').value;
    const userFilter = document.getElementById('user-filter').value;
    
    loadFormSubmissions(dateFilter, userFilter);
}

// Função para carregar respostas do Netlify Forms
async function loadResponses() {
    try {
        // Buscar dados diretamente do Netlify Forms
        const response = await fetch(`https://api.netlify.com/api/v1/sites/c16091a9-1fe4-4b7a-9a72-d218686a8713/forms/game-progress/submissions`, {
            headers: {
                'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar respostas');
        }
        
        const data = await response.json();
        responses = data; // Armazenar respostas globalmente
        
        // Exibir as respostas
        displayResponses(data);
    } catch (error) {
        console.error('Erro ao carregar respostas:', error);
        document.getElementById('responses-body').innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #666;">
                    Nenhuma resposta encontrada ainda. ${error.message}
                </td>
            </tr>
        `;
    }
}

function applyFilters() {
    const dateFilter = document.getElementById('date-filter').value;
    const userFilter = document.getElementById('user-filter').value;
    
    let filteredResponses = [...responses];
    
    if (dateFilter) {
        filteredResponses = filteredResponses.filter(r => 
            r.data.dataSubmissao.startsWith(dateFilter));
    }
    
    if (userFilter) {
        filteredResponses = filteredResponses.filter(r => 
            r.data.currentUser === userFilter);
    }
    
    displayResponses(filteredResponses);
}

// Exibir respostas na tabela
function displayResponses(submissions) {
    const tbody = document.getElementById('responses-body');
    
    if (!submissions || submissions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #666;">
                    Nenhuma resposta encontrada ainda.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';
    submissions.forEach(submission => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(submission.created_at).toLocaleDateString()}</td>
            <td>${submission.data.currentUser || 'N/A'}</td>
            <td>${submission.data.playerName || 'N/A'}</td>
            <td>${submission.data.pontuacao || '0'}</td>
            <td>
                <button onclick="viewDetails('${submission.id}')" class="view-btn">
                    Ver Detalhes
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Visualizar detalhes de uma resposta
async function viewDetails(submissionId) {
    try {
        const response = await fetch(`/.netlify/functions/get-submission?id=${submissionId}`);
        const submission = await response.json();
        
        const modal = document.getElementById('details-modal');
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <h2>Detalhes da Submissão</h2>
            <p><strong>Data:</strong> ${new Date(submission.data.dataSubmissao).toLocaleString()}</p>
            <p><strong>Usuário:</strong> ${submission.data.currentUser}</p>
            <p><strong>Nome do Jogador:</strong> ${submission.data.playerName}</p>
            <p><strong>Pontuação:</strong> ${submission.data.pontuacao}</p>
            <h3>Respostas:</h3>
            <p><strong>Felicidade:</strong> ${submission.data.felicidade}</p>
            <p><strong>Tristeza:</strong> ${submission.data.tristeza}</p>
            <p><strong>Palavra Escolhida:</strong> ${submission.data.palavraEscolhida}</p>
            <p><strong>Significado:</strong> ${submission.data.significado}</p>
            <h3>Diário:</h3>
            <p>${submission.data.diario}</p>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        alert('Erro ao carregar os detalhes. Tente novamente.');
    }
}

// Funções de navegação
function showDashboard() {
    document.querySelectorAll('.admin-screen').forEach(screen => 
        screen.classList.remove('active'));
    document.getElementById('dashboard').classList.add('active');
}

function logout() {
    localStorage.removeItem('adminUser');
    location.reload();
}

// Fechar modal quando clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('details-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Verificar se já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('dashboard').classList.add('active');
        loadFormSubmissions();
    }
}); 