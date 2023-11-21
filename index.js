const btnAddTask = document.getElementById('btn-add-task');
const btnAtivas = document.getElementById('tasks-abertas');
const btnConcluidas = document.getElementById('tasks-concluidas');
const grupoTasks = document.getElementById('task-grupo');
const btnPesquisa = document.getElementById('tasks-pesquisa');

// Configuração inicial da página
document.addEventListener('DOMContentLoaded', () => {
    // Defina as cores iniciais para o botão "Ativas"
    btnAtivas.style.backgroundColor = '#141b41';
    btnAtivas.style.color = '#98b9f2';

    // Atualiza a lista de tarefas com base no estado inicial
    atualizarListaTarefas();
});


btnPesquisa.addEventListener('click', () => {
    pesquisarPorId()
    btnAtivas.style.backgroundColor='#98b9f2';
    btnAtivas.style.color='#141b41';
    btnConcluidas.style.backgroundColor='#98b9f2';
    btnConcluidas.style.color='#141b41';
    btnPesquisa.style.backgroundColor='#141b41';
    btnPesquisa.style.color='#98b9f2';
    btnPesquisa.style.content='url(./assets/img/lupa-icone-hover.png)'
});

let contadorID = 0;
let edicaoID = null;
let bancoDados = [];
let exibirConcluidas = false;

btnAddTask.addEventListener('click', () => {
    const titulo = obterTituloValido();

    if (titulo !== null) {
        const descricao = obterDescricaoValida();

        if (descricao !== null) {
            const idTask = {
                id: contadorID,
                titulo: titulo,
                descricao: descricao,
                ativa: true,
            };

            bancoDados.push(idTask);

            const article = criarElementoTarefa(idTask);
            grupoTasks.appendChild(article);

            contadorID++;

            console.log(bancoDados);
        }
    }
});

//Evento ao clicar no botão que desmontra as tasks ativas no momento.
btnAtivas.addEventListener('click', () => {
    exibirConcluidas = false;
    btnPesquisa.style.backgroundColor='#98b9f2';
    btnPesquisa.style.color='#141b41';
    btnConcluidas.style.backgroundColor='#98b9f2';
    btnConcluidas.style.color='#141b41';
    btnAtivas.style.backgroundColor='#141b41';
    btnAtivas.style.color='#98b9f2';
    atualizarListaTarefas();
});

//Evento ao clicar no botão que desmontra as tasks concluidas no momento.
btnConcluidas.addEventListener('click', () => {
    exibirConcluidas = true;
    btnConcluidas.style.backgroundColor='#141b41';
    btnConcluidas.style.color='#98b9f2';
    btnPesquisa.style.backgroundColor='#98b9f2';
    btnPesquisa.style.color='#141b41';
    btnAtivas.style.backgroundColor='#98b9f2';
    btnAtivas.style.color='#141b41';
    atualizarListaTarefas();
});


//Função que garante a captura de um titulo adequado no prompt do usuário.
function obterTituloValido(obrigatorio = true) {
    let tituloValido = false;
    let titulo = '';

    while (!tituloValido) {
        try {
            titulo = prompt("Criador de tasks ativado. Por favor insira um título para sua nova tarefa:");

            if (titulo === null) {
                // O usuário clicou em Cancelar, então sai do loop
                throw new Error('Operação cancelada pelo usuário.');
            }

            if (obrigatorio && (titulo.trim() === '' || titulo.length < 4 || !isNaN(Number(titulo)))) {
                throw new Error('O título não pode ser vazio, conter apenas números ou ter menos de 4 caracteres.');
            }

            tituloValido = true;
        } catch (error) {
            // Se o usuário clicou em Cancelar, sai do loop lançando o erro novamente
            if (error.message === 'Operação cancelada pelo usuário.') {
                throw error;
            } else {
                // Se ocorreu outro tipo de erro, mostra um alerta e continua no loop
                alert(error.message);
            }
        }
    }   

    return titulo.trim();  // Retorna o título sem espaços extras
}


//Função que garante a captura de uma descrição adequada no prompt do usuário.

function obterDescricaoValida() {
    let descricaoValida = false;
    let descricao = '';

    while (!descricaoValida) {
        try {
            descricao = prompt("Agora uma descrição para sua nova tarefa:");

            if (descricao === null) {
                // O usuário clicou em Cancelar, então sai do loop
                throw new Error('Operação cancelada pelo usuário.');
            }

            if (descricao.trim() === '' || descricao.length < 20 || !isNaN(Number(descricao))) {
                throw new Error('A descrição não pode ser vazia ou ter menos de 20 caracteres.');
            }

            descricaoValida = true;
        } catch (error) {
            // Se o usuário clicou em Cancelar, lança o erro novamente
            if (error.message === 'Operação cancelada pelo usuário.') {
                alert(error.message);
                throw error;
            } else {
                // Se ocorreu outro tipo de erro, mostra um alerta e continua no loop
                alert(error.message);
            }
        }
    }

    return descricao;
}


//Função que cria os elementos componentes do article de cada tarefa no DOM.
function criarElementoTarefa(tarefa) {
    const article = document.createElement('article');
    article.classList.add('task-corpo');

    const cabecalho = document.createElement('section');
    cabecalho.classList.add('task-cabecalho');

    const idSection = document.createElement('section');
    idSection.classList.add('task-id');
    idSection.textContent = tarefa.id + ' ' + tarefa.titulo;

    const buttonsSection = document.createElement('section');
    buttonsSection.classList.add('task-buttons');

    const btnEdite = document.createElement('button');
    btnEdite.classList.add('btn-edite');
    btnEdite.textContent = 'E';
    btnEdite.addEventListener('click', () => editarTarefa(tarefa.id));

    let btnAprove;
    if (tarefa.ativa) {
        // Se a tarefa está ativa, cria o botão V
        btnAprove = document.createElement('button');
        btnAprove.classList.add('btn-aprove');
        btnAprove.textContent = 'V';
        btnAprove.addEventListener('click', () => moverParaConcluidas(tarefa.id));
    } else {
        // Se a tarefa está concluída, cria o botão D
        btnAprove = document.createElement('button');
        btnAprove.classList.add('btn-desfazer');
        btnAprove.textContent = 'D';
        btnAprove.addEventListener('click', () => desfazerConclusao(tarefa.id));
    }

    const btnExclua = document.createElement('button');
    btnExclua.id = `btn-exclua-${tarefa.id}`;
    btnExclua.classList.add('btn-exclua');
    btnExclua.textContent = 'X';
    btnExclua.addEventListener('click', () => excluirTarefa(tarefa.id));

    buttonsSection.appendChild(btnEdite);
    buttonsSection.appendChild(btnAprove);
    buttonsSection.appendChild(btnExclua);

    cabecalho.appendChild(idSection);
    cabecalho.appendChild(buttonsSection);

    const descricaoSection = document.createElement('section');
    descricaoSection.classList.add('task-descricao');
    descricaoSection.textContent = tarefa.descricao;

    article.appendChild(cabecalho);
    article.appendChild(descricaoSection);

    return article;
}

function desfazerConclusao(id) {
    const tarefa = bancoDados.find(t => t.id === id);

    if (tarefa) {
        tarefa.ativa = true;
        atualizarListaTarefas();
    }
}

function editarTarefa(id) {
    const tarefa = bancoDados.find(t => t.id === id);

    if (tarefa) {
        const novoTitulo = obterTituloValido(false);  // Passando false para indicar que o título não é obrigatório
        const novaDescricao = obterDescricaoValida();

        if (novoTitulo === null && novaDescricao === null) {
            alert('Operação cancelada.');
            return;
        }

        if (novoTitulo !== null) {
            tarefa.titulo = novoTitulo;
        }

        if (novaDescricao !== null) {
            tarefa.descricao = novaDescricao;
        }

        // Se a operação não foi cancelada, atualiza a lista
        atualizarListaTarefas();
    }
}

function excluirTarefa(id) {
    bancoDados = bancoDados.filter(tarefa => tarefa.id !== id);
    atualizarListaTarefas();
}

function moverParaConcluidas(id) {
    const tarefa = bancoDados.find(t => t.id === id);

    if (tarefa) {
        tarefa.ativa = false;
        atualizarListaTarefas();
    }
}

function atualizarListaTarefas() {
    grupoTasks.innerHTML = '';

    const tarefasFiltradas = exibirConcluidas
        ? bancoDados.filter(tarefa => !tarefa.ativa)
        : bancoDados.filter(tarefa => tarefa.ativa);

    tarefasFiltradas.forEach(tarefa => {
        const article = criarElementoTarefa(tarefa);
        grupoTasks.appendChild(article);
    });
}

function pesquisarPorId() {
    let idPesquisa;

    try {
        idPesquisa = prompt("Por favor, insira o ID da tarefa que deseja pesquisar:");

        if (idPesquisa === null) {
            // O usuário clicou em Cancelar, então sai da função
            throw new Error('Operação cancelada pelo usuário.');
        }

        idPesquisa = parseInt(idPesquisa);

        if (isNaN(idPesquisa)) {
            throw new Error('Por favor, insira um número válido.');
        }

        const tarefaEncontrada = bancoDados.find(t => t.id === idPesquisa && t.ativa);

        if (tarefaEncontrada) {
            // Limpa a lista e adiciona apenas a tarefa encontrada
            grupoTasks.innerHTML = '';
            const article = criarElementoTarefa(tarefaEncontrada);
            grupoTasks.appendChild(article);
        } else {
            alert('Tarefa não encontrada ou já concluída.');
        }
    } catch (error) {
        if (error.message !== 'Operação cancelada pelo usuário.') {
            alert(error.message);
        }
    }
}