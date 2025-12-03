// Configuração
const API_URL = "https://script.google.com/macros/s/AKfycbwdvdB-oU8fK2r__4iV0996Am2kXWWQUsQO8dckyNccgbv7ekdfuOOlxtfkZte3I8fA/exec";
let logs = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    testConnection();
    updateLogDisplay();
    // Seleciona o recurso "produtos" por padrão
    document.getElementById('manualRecurso').value = 'produtos';
});

// Testar conexão com a API
async function testConnection() {
    addLog('🔍 Testando conexão com a API LANORT...', 'info');
    
    try {
        const startTime = Date.now();
        const url = `${API_URL}?recurso=status`;
        const response = await fetch(url);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (response.ok) {
            const data = await response.json();
            
            document.getElementById('statusDot').className = 'status-indicator status-online';
            document.getElementById('statusText').innerHTML = 
                `✅ API LANORT CONECTADA (${responseTime}ms) | Sucesso: ${data.sucesso}`;
            
            addLog(`✅ Conexão estabelecida em ${responseTime}ms`, 'success');
            
            if (data.abas) {
                const abas = Object.entries(data.abas)
                    .filter(([key, value]) => value)
                    .map(([key]) => key)
                    .join(', ');
                addLog(`📁 Abas disponíveis: ${abas}`, 'info');
            }
            
        } else {
            document.getElementById('statusDot').className = 'status-indicator status-offline';
            document.getElementById('statusText').textContent = '❌ ERRO NA CONEXÃO';
            addLog(`❌ Erro HTTP: ${response.status} ${response.statusText}`, 'error');
        }
        
    } catch (error) {
        document.getElementById('statusDot').className = 'status-indicator status-offline';
        document.getElementById('statusText').innerHTML = `❌ FALHA: ${error.message}`;
        addLog(`❌ Erro de conexão: ${error.message}`, 'error');
    }
}

// Funções de log
function addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('pt-BR', { 
        hour12: false,
        fractionalSecondDigits: 3 
    });
    
    const logEntry = {
        timestamp: timestamp,
        type: type,
        message: message
    };
    
    logs.unshift(logEntry);
    updateLogDisplay();
    
    if (logs.length > 100) {
        logs = logs.slice(0, 100);
    }
}

function updateLogDisplay() {
    const logContainer = document.getElementById('logContainer');
    const logCount = document.getElementById('logCount');
    const lastUpdate = document.getElementById('lastUpdate');
    
    logContainer.innerHTML = '';
    logCount.textContent = logs.length;
    lastUpdate.textContent = new Date().toLocaleTimeString('pt-BR');
    
    logs.forEach(log => {
        const logElement = document.createElement('div');
        logElement.className = 'log-entry';
        logElement.innerHTML = `
            <span class="log-time">[${log.timestamp}]</span>
            <span class="log-type-${log.type}">${getLogIcon(log.type)} ${log.message}</span>
        `;
        logContainer.appendChild(logElement);
    });
}

function getLogIcon(type) {
    const icons = {
        'info': 'ℹ️',
        'success': '✅',
        'error': '❌',
        'warning': '⚠️'
    };
    return icons[type] || '📝';
}

// Alternar entre tabs
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[onclick="switchTab('${tabId}')"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// ========== FUNÇÕES PARA PRODUTOS ==========
function testProdutos(tipo) {
    switch(tipo) {
        case 'todos':
            document.getElementById('prodCodigo').value = '';
            document.getElementById('prodMarca').value = '';
            document.getElementById('prodDescricao').value = '';
            break;
            
        case 'buscar-codigo':
            document.getElementById('prodCodigo').value = '2927';
            document.getElementById('prodMarca').value = '';
            document.getElementById('prodDescricao').value = '';
            break;
            
        case 'buscar-marca':
            document.getElementById('prodCodigo').value = '';
            document.getElementById('prodMarca').value = 'CADIVEU';
            document.getElementById('prodDescricao').value = '';
            break;
            
        case 'buscar-descricao':
            document.getElementById('prodCodigo').value = '';
            document.getElementById('prodMarca').value = '';
            document.getElementById('prodDescricao').value = 'SHAMPOO';
            break;
            
        case 'paginacao':
            document.getElementById('prodPagina').value = '2';
            document.getElementById('prodLimite').value = '5';
            break;
    }
}

async function executarTesteProdutos() {
    const codigo = document.getElementById('prodCodigo').value;
    const marca = document.getElementById('prodMarca').value;
    const descricao = document.getElementById('prodDescricao').value;
    const pagina = document.getElementById('prodPagina').value;
    const limite = document.getElementById('prodLimite').value;
    
    const params = { recurso: 'produtos' };
    
    if (codigo) params.codigo = codigo;
    if (marca) params.marca = marca;
    if (descricao) params.descricao = descricao;
    if (pagina && pagina !== '1') params.pagina = pagina;
    if (limite && limite !== '20') params.limite = limite;
    
    addLog(`📦 Buscando produtos: ${JSON.stringify(params)}`, 'info');
    await callAPI('GET', params);
}

function limparFormProdutos() {
    document.getElementById('prodCodigo').value = '';
    document.getElementById('prodMarca').value = '';
    document.getElementById('prodDescricao').value = '';
    document.getElementById('prodPagina').value = '1';
    document.getElementById('prodLimite').value = '20';
}

// ========== FUNÇÕES PARA PEDIDOS ==========
function testPedidos(tipo) {
    switch(tipo) {
        case 'listar':
            document.getElementById('pedidoNumero').value = '';
            document.getElementById('pedidoEmail').value = '';
            document.getElementById('pedidoLimite').value = '10';
            break;
            
        case 'buscar-numero':
            document.getElementById('pedidoNumero').value = '0001';
            document.getElementById('pedidoEmail').value = '';
            break;
            
        case 'buscar-email':
            document.getElementById('pedidoNumero').value = '';
            document.getElementById('pedidoEmail').value = 'cliente@email.com';
            break;
            
        case 'ultimos':
            document.getElementById('pedidoNumero').value = '';
            document.getElementById('pedidoEmail').value = '';
            document.getElementById('pedidoLimite').value = '5';
            break;
            
        case 'add-individual':
            criarPedidoTeste();
            break;
            
        case 'add-lote':
            switchTab('tab-lote');
            break;
    }
}

async function executarTestePedidos() {
    const numeroPedido = document.getElementById('pedidoNumero').value;
    const email = document.getElementById('pedidoEmail').value;
    const limite = document.getElementById('pedidoLimite').value;
    
    const params = { recurso: 'pedidos' };
    
    if (numeroPedido) params.numeroPedido = numeroPedido;
    if (email) params.email = email;
    if (limite && limite !== '10') params.limite = limite;
    
    addLog(`🛒 Buscando pedidos: ${JSON.stringify(params)}`, 'info');
    await callAPI('GET', params);
}

function limparFormPedidos() {
    document.getElementById('pedidoNumero').value = '';
    document.getElementById('pedidoEmail').value = '';
    document.getElementById('pedidoLimite').value = '10';
}

async function criarPedidoTeste() {
    const pedidoData = {
        recurso: 'pedidos',
        email: 'teste@empresa.com',
        numeroPedido: 'TEST-' + Date.now(),
        codigo: '001',
        descricao: 'Produto Teste',
        quantidade: 2,
        valorUnitario: 10.50,
        valorTotal: 21.00,
        usuario: 'Testador API',
        prazo: '30 dias',
        observacoes: 'Pedido de teste via API'
    };
    
    addLog(`➕ Criando pedido de teste: ${pedidoData.numeroPedido}`, 'info');
    await callAPI('POST', pedidoData);
}

// ========== FUNÇÕES PARA PRAZOS ==========
function testPrazos(tipo) {
    switch(tipo) {
        case 'todos':
            document.getElementById('prazoTipo').value = '';
            document.getElementById('prazoDescricao').value = '';
            break;
            
        case 'por-tipo':
            document.getElementById('prazoTipo').value = 'AVISTA';
            document.getElementById('prazoDescricao').value = '';
            break;
            
        case 'por-descricao':
            document.getElementById('prazoTipo').value = '';
            document.getElementById('prazoDescricao').value = '30DIAS';
            break;
    }
}

async function executarTestePrazos() {
    const tipo = document.getElementById('prazoTipo').value;
    const descricao = document.getElementById('prazoDescricao').value;
    
    const params = { recurso: 'prazos' };
    
    if (tipo) params.tipo = tipo;
    if (descricao) params.descricao = descricao;
    
    addLog(`📅 Buscando prazos: ${JSON.stringify(params)}`, 'info');
    await callAPI('GET', params);
}

function limparFormPrazos() {
    document.getElementById('prazoTipo').value = '';
    document.getElementById('prazoDescricao').value = '';
}

// ========== FUNÇÕES PARA USUÁRIOS ==========
function testUsuarios(tipo) {
    switch(tipo) {
        case 'todos':
            document.getElementById('usuarioCodigo').value = '';
            document.getElementById('usuarioNome').value = '';
            break;
            
        case 'por-codigo':
            document.getElementById('usuarioCodigo').value = '123';
            document.getElementById('usuarioNome').value = '';
            break;
            
        case 'por-nome':
            document.getElementById('usuarioCodigo').value = '';
            document.getElementById('usuarioNome').value = 'JOÃO';
            break;
    }
}

async function executarTesteUsuarios() {
    const codigo = document.getElementById('usuarioCodigo').value;
    const nome = document.getElementById('usuarioNome').value;
    
    const params = { recurso: 'usuarios' };
    
    if (codigo) params.codigo = codigo;
    if (nome) params.nome = nome;
    
    addLog(`👥 Buscando usuários: ${JSON.stringify(params)}`, 'info');
    await callAPI('GET', params);
}

function limparFormUsuarios() {
    document.getElementById('usuarioCodigo').value = '';
    document.getElementById('usuarioNome').value = '';
}

// ========== FUNÇÕES PARA ADMIN ==========
function testAdmin(tipo) {
    const params = {};
    
    switch(tipo) {
        case 'estatisticas':
            params.recurso = 'estatisticas';
            break;
            
        case 'status':
            params.recurso = 'status';
            break;
            
        case 'teste-conexao':
            params.recurso = 'teste-conexao';
            break;
            
        case 'sistema-produtos':
            params.recurso = 'sistema-produtos';
            break;
            
        case 'sistema-usuarios':
            params.recurso = 'sistema-usuarios';
            break;
            
        case 'sistema-prazos':
            params.recurso = 'sistema-prazos';
            break;
    }
    
    addLog(`⚙️ Executando função admin: ${tipo}`, 'info');
    callAPI('GET', params);
}

async function executarTesteAdmin() {
    const params = { recurso: 'estatisticas' };
    addLog(`📊 Buscando estatísticas do sistema`, 'info');
    await callAPI('GET', params);
}

// ========== FUNÇÕES PARA MANUAL ==========
async function executarManual() {
    const recurso = document.getElementById('manualRecurso').value;
    const paramsText = document.getElementById('manualParams').value;
    const method = document.getElementById('manualMethod').value;
    
    try {
        let params = JSON.parse(paramsText);
        params.recurso = recurso;
        
        addLog(`🔧 Executando manual: ${method} ${recurso}`, 'info');
        addLog(`📤 Parâmetros: ${JSON.stringify(params)}`, 'info');
        
        await callAPI(method, params);
        
    } catch (error) {
        addLog(`❌ Erro ao parsear JSON: ${error.message}`, 'error');
        showResponse({ error: 'JSON inválido', details: error.message }, false);
    }
}

function limparManual() {
    document.getElementById('manualParams').value = '{\n  "codigo": "2927"\n}';
}

function preencherExemplo() {
    const recurso = document.getElementById('manualRecurso').value;
    let exemplo = '';
    
    switch(recurso) {
        case 'produtos':
            exemplo = '{\n  "codigo": "2927",\n  "marca": "CADIVEU",\n  "descricao": "SHAMPOO",\n  "pagina": 1,\n  "limite": 20\n}';
            break;
            
        case 'pedidos':
            exemplo = '{\n  "numeroPedido": "0001",\n  "email": "cliente@email.com",\n  "pagina": 1,\n  "limite": 10\n}';
            break;
            
        case 'buscar-pedido':
            exemplo = '{\n  "numero": "0001"\n}';
            break;
            
        case 'ultimos-pedidos':
            exemplo = '{\n  "limite": 10\n}';
            break;
            
        default:
            exemplo = '{}';
    }
    
    document.getElementById('manualParams').value = exemplo;
}

// ========== FUNÇÕES PARA LOTE ==========
function testLote(tipo) {
    let loteData = '';
    const timestamp = Date.now();
    
    switch(tipo) {
        case 'pedido-simples':
            loteData = `{
  "email": "cliente@empresa.com",
  "numeroPedido": "TEST-${timestamp}",
  "usuario": "Testador API",
  "prazo": "30 dias",
  "observacoes": "Pedido de teste via API",
  "itens": [
    {
      "codigo": "001",
      "descricao": "Produto Teste 1",
      "quantidade": 2,
      "valorUnitario": 10.50,
      "valorTotal": 21.00,
      "numeroItem": "1"
    },
    {
      "codigo": "002", 
      "descricao": "Produto Teste 2",
      "quantidade": 1,
      "valorUnitario": 25.00,
      "valorTotal": 25.00,
      "numeroItem": "2"
    }
  ]
}`;
            break;
            
        case 'pedido-grande':
            loteData = `{
  "email": "grande.pedido@empresa.com",
  "numeroPedido": "LOTE-GRANDE-${timestamp}",
  "usuario": "Cliente VIP",
  "prazo": "60 dias",
  "observacoes": "Pedido grande com múltiplos itens",
  "itens": [`;
            
            for (let i = 1; i <= 10; i++) {
                loteData += `
    {
      "codigo": "PROD-${i.toString().padStart(3, '0')}",
      "descricao": "Produto ${i} - Teste em Lote",
      "quantidade": ${i},
      "valorUnitario": ${(i * 5).toFixed(2)},
      "valorTotal": ${(i * i * 5).toFixed(2)},
      "numeroItem": "${i}"
    }`;
                if (i < 10) loteData += ',';
            }
            
            loteData += `
  ]
}`;
            break;
            
        case 'performance':
            loteData = `{
  "email": "performance@teste.com",
  "numeroPedido": "PERF-${timestamp}",
  "usuario": "Teste Performance",
  "prazo": "À vista",
  "observacoes": "Teste de performance com 50 itens",
  "itens": [`;
            
            for (let i = 1; i <= 50; i++) {
                loteData += `
    {
      "codigo": "PERF-${i.toString().padStart(3, '0')}",
      "descricao": "Item Performance ${i}",
      "quantidade": 1,
      "valorUnitario": ${(Math.random() * 100).toFixed(2)},
      "valorTotal": ${(Math.random() * 100).toFixed(2)},
      "numeroItem": "${i}"
    }`;
                if (i < 50) loteData += ',';
            }
            
            loteData += `
  ]
}`;
            break;
    }
    
    document.getElementById('loteTeste').value = loteData;
}

async function executarLote() {
    const loteText = document.getElementById('loteTeste').value;
    
    try {
        // Pré-processar o JSON para substituir qualquer expressão JavaScript
        const preprocessJson = (jsonString) => {
            let result = jsonString;
            
            // Substituir Date.now() pelo valor atual
            if (result.includes('Date.now()')) {
                const timestamp = Date.now();
                // Usar expressão regular para substituir todas as ocorrências
                result = result.replace(/Date\.now\(\)/g, timestamp);
            }
            
            return result;
        };
        
        const processedText = preprocessJson(loteText);
        const pedidoData = JSON.parse(processedText);
        pedidoData.recurso = 'pedidos-lote';
        
        addLog(`⚡ Executando pedido em lote: ${pedidoData.numeroPedido}`, 'info');
        addLog(`📦 Total de itens: ${pedidoData.itens ? pedidoData.itens.length : 0}`, 'info');
        
        // Primeiro tentar como POST
        try {
            const result = await callAPI('POST', pedidoData);
            
            // Se POST retornar erro, tentar como GET
            if (result && result.sucesso === false) {
                addLog('🔄 POST retornou erro, tentando como GET...', 'warning');
                await callAPI('GET', pedidoData);
            }
            
        } catch (error) {
            addLog(`❌ POST falhou com exceção: ${error.message}`, 'error');
            addLog('🔄 Tentando como GET...', 'warning');
            await callAPI('GET', pedidoData);
        }
        
    } catch (error) {
        addLog(`❌ Erro no JSON do lote: ${error.message}`, 'error');
        showResponse({ error: 'JSON do lote inválido', details: error.message }, false);
    }
}

function limparLote() {
    const timestamp = Date.now();
    document.getElementById('loteTeste').value = `{
  "email": "cliente@empresa.com",
  "numeroPedido": "TEST-${timestamp}",
  "usuario": "Testador API",
  "prazo": "30 dias",
  "observacoes": "Pedido de teste via API",
  "itens": [
    {
      "codigo": "001",
      "descricao": "Produto Teste 1",
      "quantidade": 2,
      "valorUnitario": 10.50,
      "valorTotal": 21.00,
      "numeroItem": "1"
    },
    {
      "codigo": "002",
      "descricao": "Produto Teste 2", 
      "quantidade": 1,
      "valorUnitario": 25.00,
      "valorTotal": 25.00,
      "numeroItem": "2"
    }
  ]
}`;
}

function gerarLoteTeste() {
    const timestamp = Date.now();
    const itens = [];
    const numItens = Math.floor(Math.random() * 10) + 1;
    
    for (let i = 1; i <= numItens; i++) {
        itens.push({
            codigo: `TEST-${i.toString().padStart(3, '0')}`,
            descricao: `Produto de Teste ${i}`,
            quantidade: Math.floor(Math.random() * 5) + 1,
            valorUnitario: (Math.random() * 100).toFixed(2),
            valorTotal: 0,
            numeroItem: i.toString()
        });
        
        // Calcular valor total
        itens[i-1].valorTotal = (itens[i-1].quantidade * parseFloat(itens[i-1].valorUnitario)).toFixed(2);
    }
    
    const loteData = {
        email: `teste${timestamp}@empresa.com`,
        numeroPedido: `AUTO-${timestamp}`,
        usuario: "Gerador Automático",
        prazo: "30 dias",
        observacoes: "Pedido gerado automaticamente para teste",
        itens: itens
    };
    
    document.getElementById('loteTeste').value = JSON.stringify(loteData, null, 2);
}

// ========== FUNÇÃO PRINCIPAL DE CHAMADA API ==========
async function callAPI(method, params, isBatch = false) {
    const startTime = Date.now();
    document.getElementById('responseTime').textContent = '⏳ Processando...';
    
    try {
        let url = API_URL;
        let options = { method: method };
        
        if (method === 'GET') {
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });
            url = `${API_URL}?${queryParams.toString()}`;
        } else if (method === 'POST') {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(params);
            
            // Para POST também criamos URL com query params como fallback
            const queryParams = new URLSearchParams();
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    queryParams.append(key, params[key]);
                }
            });
            url = `${API_URL}?${queryParams.toString()}`;
        }
        
        addLog(`🔗 ${method} ${url.substring(0, 100)}${url.length > 100 ? '...' : ''}`, 'info');
        
        const response = await fetch(url, options);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        document.getElementById('responseTime').textContent = `⏱️ ${responseTime}ms`;
        
        let responseText;
        try {
            responseText = await response.text();
            addLog(`📄 Resposta (${responseText.length} chars): ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`, 'info');
        } catch (textError) {
            addLog(`⚠️ Não foi possível ler resposta`, 'warning');
            responseText = '';
        }
        
        let data;
        try {
            data = JSON.parse(responseText);
            addLog(`✅ Resposta parseada: ${data.sucesso !== false ? 'Sucesso' : 'Erro'}`, data.sucesso !== false ? 'success' : 'error');
        } catch (parseError) {
            addLog(`❌ Resposta não é JSON: ${parseError.message}`, 'error');
            data = { 
                error: 'Resposta inválida',
                rawResponse: responseText.substring(0, 500)
            };
        }
        
        if (!isBatch) {
            showResponse(data, response.ok && data.sucesso !== false);
        }
        
        return data;
        
    } catch (error) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        document.getElementById('responseTime').textContent = `❌ ${responseTime}ms | ${error.message}`;
        addLog(`💥 Erro: ${error.message}`, 'error');
        
        // Tentar como GET se POST falhou (apenas para pedidos-lote)
        if (method === 'POST' && params.recurso === 'pedidos-lote' && !isBatch) {
            addLog('🔄 Tentando enviar dados como GET...', 'warning');
            
            // Tentar novamente como GET
            try {
                const getParams = { ...params };
                const queryParams = new URLSearchParams();
                Object.keys(getParams).forEach(key => {
                    if (getParams[key] !== undefined && getParams[key] !== null && getParams[key] !== '') {
                        // Para arrays/itens, precisamos serializar de forma especial
                        if (key === 'itens' && Array.isArray(getParams[key])) {
                            queryParams.append(key, JSON.stringify(getParams[key]));
                        } else {
                            queryParams.append(key, getParams[key]);
                        }
                    }
                });
                const getUrl = `${API_URL}?${queryParams.toString()}`;
                
                addLog(`🔗 GET fallback: ${getUrl.substring(0, 100)}...`, 'info');
                const getResponse = await fetch(getUrl);
                const getResponseText = await getResponse.text();
                
                let getData;
                try {
                    getData = JSON.parse(getResponseText);
                    addLog(`✅ GET funcionou!`, 'success');
                    showResponse(getData, getResponse.ok && getData.sucesso !== false);
                    return getData;
                } catch (e) {
                    showResponse({ 
                        error: 'Falha na comunicação',
                        message: error.message,
                        fallbackAttempt: 'GET também falhou',
                        getResponse: getResponseText.substring(0, 500)
                    }, false);
                }
            } catch (getError) {
                showResponse({ 
                    error: 'Falha na comunicação POST e GET',
                    message: error.message,
                    getError: getError.message
                }, false);
            }
        } else if (!isBatch) {
            showResponse({ 
                error: 'Falha na comunicação',
                message: error.message
            }, false);
        }
        
        return { sucesso: false, error: error.message };
    }
}

// ========== FUNÇÕES DE TESTE COMPLETO ==========
async function testAllEndpoints() {
    addLog('🚀 Iniciando teste completo de todos os endpoints...', 'info');
    
    const tests = [
        { name: 'Status do Sistema', params: { recurso: 'status' } },
        { name: 'Estatísticas', params: { recurso: 'estatisticas' } },
        { name: 'Teste Conexão', params: { recurso: 'teste-conexao' } },
        { name: 'Listar Produtos', params: { recurso: 'produtos', limite: 5 } },
        { name: 'Listar Prazos', params: { recurso: 'prazos', limite: 5 } },
        { name: 'Listar Usuários', params: { recurso: 'usuarios', limite: 5 } },
        { name: 'Listar Pedidos', params: { recurso: 'pedidos', limite: 5 } },
        { name: 'Sistema Produtos', params: { recurso: 'sistema-produtos' } },
        { name: 'Sistema Usuários', params: { recurso: 'sistema-usuarios' } },
        { name: 'Sistema Prazos', params: { recurso: 'sistema-prazos' } }
    ];
    
    let sucessos = 0;
    let falhas = 0;
    
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        addLog(`📋 Teste ${i+1}/${tests.length}: ${test.name}`, 'info');
        
        const result = await callAPI('GET', test.params, true);
        
        if (result && result.sucesso !== false) {
            sucessos++;
            addLog(`✅ ${test.name}: OK`, 'success');
        } else {
            falhas++;
            addLog(`❌ ${test.name}: FALHA`, 'error');
        }
        
        // Pequena pausa entre testes
        if (i < tests.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
    
    addLog(`🎯 Teste completo: ${sucessos} sucessos, ${falhas} falhas`, sucessos === tests.length ? 'success' : 'warning');
}

// ========== FUNÇÕES DE UTILIDADE ==========
function showResponse(data, success) {
    const responseOutput = document.getElementById('responseOutput');
    const responseContainer = document.getElementById('responseContainer');
    
    const formattedJSON = syntaxHighlight(JSON.stringify(data, null, 2));
    
    responseOutput.innerHTML = formattedJSON;
    responseContainer.scrollTop = 0;
    
    if (!success) {
        responseContainer.style.borderColor = '#ff4444';
        responseContainer.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.3)';
    } else {
        responseContainer.style.borderColor = '#00ff00';
        responseContainer.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
    }
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
    function(match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function clearAllLogs() {
    if (confirm('Tem certeza que deseja limpar todos os logs?')) {
        logs = [];
        updateLogDisplay();
        addLog('🧹 Logs limpos manualmente', 'warning');
    }
}

function copyResponse() {
    const text = document.getElementById('responseOutput').textContent;
    navigator.clipboard.writeText(text).then(() => {
        addLog('📋 Resposta copiada para clipboard', 'success');
    });
}

function exportLogs() {
    const logText = logs.map(log => 
        `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-lanort-logs-${new Date().toISOString().slice(0,19)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addLog('💾 Logs exportados como arquivo TXT', 'success');
}

function limparResposta() {
    document.getElementById('responseOutput').textContent = 'Resposta limpa.';
    document.getElementById('responseTime').textContent = 'Aguardando execução...';
    document.getElementById('responseContainer').style.borderColor = '#444';
    document.getElementById('responseContainer').style.boxShadow = 'none';
}

function exibirDocumentacao() {
    const doc = `
# 📚 DOCUMENTAÇÃO DA API LANORT V4.0

## 📋 ENDPOINTS DISPONÍVEIS:

### 🔹 PRODUTOS (GET)
• /exec?recurso=produtos - Listar todos produtos
• /exec?recurso=produtos&codigo=2927 - Buscar por código
• /exec?recurso=produtos&marca=CADIVEU - Buscar por marca
• /exec?recurso=produtos&descricao=SHAMPOO - Buscar por descrição
• /exec?recurso=produtos&pagina=2&limite=10 - Com paginação

### 🔹 PEDIDOS
• GET /exec?recurso=pedidos - Listar pedidos
• GET /exec?recurso=pedidos&numeroPedido=0001 - Buscar pedido
• GET /exec?recurso=ultimos-pedidos&limite=10 - Últimos pedidos
• POST /exec?recurso=pedidos - Criar pedido individual
• POST /exec?recurso=pedidos-lote - Criar pedido em lote

### 🔹 PRAZOS (GET)
• /exec?recurso=prazos - Listar todos prazos
• /exec?recurso=prazos&tipo=AVISTA - Filtrar por tipo
• /exec?recurso=prazos&descricao=30DIAS - Filtrar por descrição

### 🔹 USUÁRIOS (GET)
• /exec?recurso=usuarios - Listar usuários
• /exec?recurso=usuarios&codigo=123 - Buscar por código
• /exec?recurso=usuarios&nome=JOÃO - Buscar por nome

### 🔹 ADMIN (GET)
• /exec?recurso=estatisticas - Estatísticas do sistema
• /exec?recurso=status - Status das abas
• /exec?recurso=teste-conexao - Testar conexão
• /exec?recurso=sistema-produtos - Produtos para sistema web
• /exec?recurso=sistema-usuarios - Usuários para sistema web
• /exec?recurso=sistema-prazos - Prazos para sistema web

## 📦 FORMATO DO LOTE DE PEDIDOS:

{
  "email": "cliente@email.com",
  "numeroPedido": "0005",
  "usuario": "João Silva",
  "prazo": "30 dias",
  "observacoes": "Pedido urgente",
  "itens": [
    {
      "codigo": "001",
      "descricao": "Produto 1",
      "quantidade": 2,
      "valorUnitario": 10.50,
      "valorTotal": 21.00,
      "numeroItem": "1"
    }
  ]
}

## 🎯 EXEMPLOS DE USO:

1. 🔍 Buscar produto específico:
   GET /exec?recurso=produtos&codigo=2927

2. 🛒 Criar pedido em lote:
   POST /exec?recurso=pedidos-lote
   Body: JSON com estrutura acima

3. 📊 Ver estatísticas:
   GET /exec?recurso=estatisticas

4. 👥 Buscar usuário:
   GET /exec?recurso=usuarios&nome=JOÃO
            `;
    
    alert(doc);
    addLog('📚 Documentação exibida', 'info');
}
