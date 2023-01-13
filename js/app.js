// Variaveis declaradas
const modal = document.getElementById('modal')
const buttonOpenModal = document.getElementById('buttonAdd')
const buttonCloseModal = document.getElementById('buttonClose')
const mNumero = document.getElementById('mNumero')
const mDescricao = document.getElementById('mDescricao')
const mData = document.getElementById('mData')
const mStatus = document.getElementById('mStatus')
const edit = document.getElementById('buttonSalvar')
const formulario = document.getElementById('formularioAdd')
const editarTarefa = document.querySelector('.buttonForm')
const buttonSalvar = document.getElementById('buttonSalvar')
const TituloCard = document.querySelector('.TituloCard')
const editar = document.getElementById('editar')
let percorrerTarefa = null
let tarefaAtual = []
let conteudo = document.getElementById('conteudo')

// Função abri modal
function abriModal () {
    modal.style.display = 'block'
}

// Função fecha modal 
function closeModal () {
    modal.style.display ='none'
}

// função pra quando abri o modal vim sem valor algum
buttonOpenModal.onclick = () => {
    document.getElementById("mNumero").value = ''
    document.getElementById("mDescricao").value = ''
    document.getElementById("mData").value = ''
    document.getElementById("mStatus").value = ''
    TituloCard.textContent = "Adicionar tarefa" 
    abriModal()
} 

// função para alterar o titulo da janela do modal
function editarTitulo () {
    TituloCard.textContent = "Editar tarefa"
}

// Evento de click quando tiver um click fora da janela do modal
window.addEventListener('click', (event) =>{
    if(event.target === modal){
        closeModal()
    }
})

// função serve para renderizar os campos na tela
const getTarefas = async () =>{
    let bancoDeDados = await fetch ('https://api-projeto-production.up.railway.app/tarefas')
    let tarefas = await bancoDeDados.json() 
    const content = document.getElementById("conteudo")
    tarefas.forEach((tarefas) => {
        let classeCor = ''
            if (tarefas.mStatus === 'Concluido'){
                classeCor = 'colorConcluido'
            }
            if (tarefas.mStatus === 'Em Andamento'){
                classeCor = 'colorEmAndamento'
            }
            if (tarefas.mStatus === 'Pausado'){
                classeCor = 'colorPausado'
            }
        const dataTarefa = alterarData(tarefas.mData)
        
    content.innerHTML = content.innerHTML + `
    <tr>
    <td scope="row" class="corTexto1 col-1">${tarefas.mNumero}</td>
    <td class="corTexto1 col-4">${tarefas.mDescricao}</td>
    <td class="corTexto1">${dataTarefa}</td>
    <td class="${classeCor}">${tarefas.mStatus}</td>
    <td class="d-flex">
        <button class="buttonForm" id="editar" onclick='editTarefa(${tarefas.id})'><img class="icon" src="./img/pincel.png"></img></button>
        <button class="buttonForm" onclick='confirmacao(${tarefas.id})'><img class="icon" src="./img/lixeira.png"></img></button>
    </td>
    </tr>`
    })
}

// função que adicionar tarefas a API
let adicionarTarefas = async (tarefa) =>{
    await fetch("https://api-projeto-production.up.railway.app/tarefas",{
        method:"POST",
        headers:{
            'Accept':'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(tarefa)
    });
}


// função feita para ser verificao o formulario se esta todo completo
function verificarFormulario(){
    if(mNumero.value !== "" && mDescricao.value !== "" && mData.value != "" && mStatus.value !==""){
        buttonSalvar.disabled = false
        buttonSalvar.classList.add('buttonSalvarAtivado')
    }
}

// função de busca uma tarefa unica na api
const getTarefaUnica = async(id) =>{
    let bancoDeDados = await fetch(`https://api-projeto-production.up.railway.app/tarefas/${id}`)
    let tarefas = await bancoDeDados.json() 
    return tarefas
} 

//função para fazer o metodo PUT
let obterTarefa = async (id, tarefa) =>{
    console.log('PUT')
    await fetch(`https://api-projeto-production.up.railway.app/tarefas/${id}`,{
        method:"PUT",
        headers:{
            'Accept':'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(tarefa)
    });
}

// função que serve para pegar os valores do inputs e transformando em objeto
if(formulario) {
    formulario.addEventListener('submit',(event) => {
        event.preventDefault()

        const mNumero    = formulario.elements['mNumero'].value
        const mDescricao = formulario.elements['mDescricao'].value
        const mData      = formulario.elements['mData'].value
        const mStatus    = formulario.elements['mStatus'].value

        const tarefa = {
            mNumero,
            mDescricao, 
            mData, 
            mStatus
        } 
        saveTarefa(tarefa)
    }) 
}

// função para editar as tarefas ja cadastrada no banco de dados.
const editTarefa = async(id) => {
    percorrerTarefa = await getTarefaUnica(id)
    document.getElementById('mNumero').value = percorrerTarefa.mNumero
    document.getElementById('mDescricao').value = percorrerTarefa.mDescricao
    document.getElementById('mData').value = percorrerTarefa.mData
    document.getElementById('mStatus').value = percorrerTarefa.mStatus
    editarTitulo()
    abriModal()
}

//função para alterar a data para o formato do brasil
function alterarData(data){
    let dataTarefa = new Date(data.split('-').join('/'));
    return dataTarefa.toLocaleDateString('pt-BR');
}

//função para deletar a tarefa cadastrada no banco de dados
const deletarTarefa = async (id) =>{
    await fetch(`https://api-projeto-production.up.railway.app/tarefas/${id}`,{
        method:"DELETE",
    })
    window.location.reload();
    getTarefas()
}

// função para fazer a confirmação da tarefa deletada
function confirmacao(id) {
    if (confirm("Deseja remover essa Tarefa?"))deletarTarefa(id)
}

// função para salvar as tarefas no banco de dados
const saveTarefa = async (tarefa) => {
    if (percorrerTarefa === null){
        await adicionarTarefas(tarefa)
    } else{
        await obterTarefa(percorrerTarefa.id, tarefa)
        percorrerTarefa = null

    }
    window.location.reload();
    getTarefas()
}


