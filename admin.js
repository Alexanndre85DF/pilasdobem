// Configuração de administradores
const adminUsers = [
    { login: 'administrador', password: '123456' }
];

let responses = []; // Variável global para armazenar as respostas

// Configuração inicial
const NETLIFY_SITE_ID = 'seu-site-id-aqui'; // Substitua pelo ID do seu site

// Função de login administrativo
function adminLogin() {
    const login = document.getElementById('admin-login').value;
    const password = document.getElementById('admin-password').value;
    const errorElement = document.getElementById('admin-login-error');

    const admin = adminUsers.find(a => a.login === login && a.password === password);

    if (admin) {
        localStorage.setItem('adminUser', admin.login);
        showDashboard();
        loadResponses();
    } else {
        errorElement.textContent = 'Login ou senha incorretos';
    }
}

// Função para carregar os dados do formulário
async function loadFormSubmissions() {
    try {
        const response = await fetch('/.netlify/functions/get-submissions', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar dados');
        }
        
        const data = await response.json();
        displayData(data);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar os dados. Por favor, tente novamente.');
    }
}

// Função para exibir os dados na tabela
function displayData(submissions) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';
    
    submissions.forEach(submission => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(submission.created_at).toLocaleDateString()}</td>
            <td>${submission.data.currentUser}</td>
            <td>${submission.data.playerName}</td>
            <td>${submission.data.pontuacao}</td>
            <td>
                <button onclick="viewDetails('${submission.id}')">Ver Detalhes</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Função para filtrar os dados
function filterData() {
    const dateFilter = document.getElementById('dateFilter').value;
    const userFilter = document.getElementById('userFilter').value;
    // Implementar lógica de filtro aqui
}

// Carregar dados quando a página for carregada
document.addEventListener('DOMContentLoaded', loadFormSubmissions);

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

function updateUserFilter(data) {
    const userFilter = document.getElementById('user-filter');
    const users = [...new Set(data.map(r => r.data.currentUser))];
    
    userFilter.innerHTML = '<option value="">Todos os usuários</option>';
    users.forEach(user => {
        userFilter.innerHTML += `<option value="${user}">${user}</option>`;
    });
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
function viewDetails(submissionId) {
    const submission = responses.find(r => r.id === submissionId);
    if (!submission) {
        alert('Detalhes não encontrados');
        return;
    }

    const detailsContent = document.getElementById('details-content');
    detailsContent.innerHTML = `
        <h3>Detalhes da Submissão</h3>
        <div class="response-details">
            <div class="detail-group">
                <h4>Informações Gerais</h4>
                <p><strong>Data:</strong> ${new Date(submission.created_at).toLocaleString()}</p>
                <p><strong>Usuário:</strong> ${submission.data.currentUser || 'N/A'}</p>
                <p><strong>Nome do Jogador:</strong> ${submission.data.playerName || 'N/A'}</p>
                <p><strong>Pontuação Final:</strong> ${submission.data.pontuacao || '0'}</p>
            </div>
            
            <div class="detail-group">
                <h4>Respostas do Jogo</h4>
                <p><strong>Palavra de Felicidade:</strong> ${submission.data.felicidade || 'N/A'}</p>
                <p><strong>Palavra de Tristeza:</strong> ${submission.data.tristeza || 'N/A'}</p>
                <p><strong>Palavra Escolhida:</strong> ${submission.data.palavraEscolhida || 'N/A'}</p>
                <p><strong>Significado da Palavra:</strong> ${submission.data.significado || 'N/A'}</p>
            </div>
            
            <div class="detail-group">
                <h4>Diário do Vencedor</h4>
                <div class="diary-content">
                    ${submission.data.diario || 'Sem conteúdo'}
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.admin-screen').forEach(screen => 
        screen.classList.remove('active'));
    document.getElementById('response-details').classList.add('active');
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