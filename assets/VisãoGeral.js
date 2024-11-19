// Recupera os dados do localStorage para esporte, participantes e formato

const esporte = localStorage.getItem("esporte");

const participantes = localStorage.getItem("participantes");

const formato = localStorage.getItem("formato");

// Exibe os dados na página
document.getElementById("detalhesEsporte").textContent = esporte; // Mostra o esporte selecionado
document.getElementById("detalhesParticipantes").textContent = participantes; // Mostra o número de participantes
document.getElementById("detalhesFormato").textContent =
  formato.charAt(0).toUpperCase() + formato.slice(1); // Formata e mostra o formato selecionado

// Variável para armazenar os nomes das equipes
let equipes = JSON.parse(localStorage.getItem("equipes")) || []; // Obtém as equipes do localStorage ou inicializa como um array vazio

// Função para reiniciar as equipes ao adicionar novos participantes
function reiniciarEquipes() {
  const novoParticipantes = parseInt(localStorage.getItem("participantes"), 10); // Obtém o número de participantes do localStorage
  equipes = []; // Limpa a lista de equipes
  for (let i = 1; i <= novoParticipantes; i++) {
    // Adiciona as equipes de 1 até o novo número de participantes
    equipes.push(`Equipe ${i}`);
  }
  localStorage.setItem("equipes", JSON.stringify(equipes)); // Armazena a nova lista de equipes no localStorage
}
// Criar a tabela de equipes no card
function criarTabelaEquipes() {
  const equipesTabela = document.getElementById("equipesTabela"); // Obtém a tabela de equipes
  equipesTabela.innerHTML = ""; // Limpa a tabela

  for (let i = 0; i < equipes.length; i++) {
    // Para cada equipe
    const row = document.createElement("tr"); // Cria uma nova linha na tabela
    const teamNameCell = document.createElement("td"); // Cria uma célula para o nome da equipe
    teamNameCell.textContent = equipes[i]; // Preenche a célula com o nome da equipe
    row.appendChild(teamNameCell); // Adiciona a célula à linha
    equipesTabela.appendChild(row); // Adiciona a linha à tabela
  }

  // Atualiza o número de participantes na visão geral
  document.getElementById("detalhesParticipantes").textContent = equipes.length; // Atualiza o número de participantes exibido
}

// Verifica se o número de participantes mudou e reinicia as equipes se necessário
if (localStorage.getItem("participantes") !== participantes) {
  reiniciarEquipes(); // Se o número de participantes foi alterado, reinicia as equipes
}

// Abrir o modal ao clicar no ícone de edição
const modal = document.getElementById("editModal");
document.getElementById("editTeamsBtn").addEventListener("click", function () {
  modal.style.display = "flex"; // Mostra o modal de edição
  criarListaEquipesModal(); // Cria a lista de equipes no modal
});

// Fechar o modal
document.getElementById("closeModal").addEventListener("click", function () {
  modal.style.display = "none"; // Esconde o modal
});



// Função para criar a lista de equipes no modal e permitir edição

function criarListaEquipesModal() {
  const modalTeamsList = document.getElementById("modalTeamsList"); // Obtém a lista de equipes do modal
  modalTeamsList.innerHTML = ""; // Limpa o conteúdo do modal

  for (let i = 0; i < equipes.length; i++) {
    // Para cada equipe

    const teamRow = document.createElement("div"); // Cria uma nova linha no modal
    teamRow.classList.add("team-row"); // Adiciona uma classe para estilo

    const teamNameInput = document.createElement("input"); // Cria um campo de entrada para o nome da equipe
    teamNameInput.type = "text"; // Define o tipo como texto
    teamNameInput.classList.add("edit-input"); // Adiciona uma classe para estilo
    teamNameInput.value = equipes[i]; // Preenche com o nome atual da equipe
    teamNameInput.id = `modalEquipe${i}`; // Atribui um ID único à entrada

    const deleteIcon = document.createElement("i"); // Cria um ícone para deletar a equipe
    deleteIcon.classList.add("fas", "fa-trash", "delete-icon"); // Adiciona classes para estilo

    // Função para deletar a equipe
    deleteIcon.addEventListener("click", function () {
      equipes.splice(i, 1); // Remove a equipe da lista
      criarListaEquipesModal(); // Atualiza a lista no modal
      criarTabelaEquipes(); // Atualiza a tabela na visão geral
    });

    const iconContainer = document.createElement("div"); // Cria um contêiner para a entrada e ícone
    iconContainer.classList.add("icon-buttons"); // Adiciona uma classe para estilo
    iconContainer.appendChild(teamNameInput); // Adiciona o campo de entrada ao contêiner
    iconContainer.appendChild(deleteIcon); // Adiciona o ícone de deletar ao contêiner

    teamRow.appendChild(iconContainer); // Adiciona o contêiner à linha
    modalTeamsList.appendChild(teamRow); // Adiciona a linha à lista no modal
  }
}
// Salvar as alterações do modal
document.getElementById("saveChanges").addEventListener("click", function () {
  const modalTeamsList = document
    .getElementById("modalTeamsList")
    .getElementsByClassName("edit-input"); // Obtém todos os campos de entrada
  equipes = Array.from(modalTeamsList).map((input) => input.value); // Atualiza os nomes das equipes
  localStorage.setItem("equipes", JSON.stringify(equipes)); // Armazena no localStorage
  criarTabelaEquipes(); // Atualiza a tabela de equipes na visão geral
  modal.style.display = "none"; // Fecha o modal
});

// Adicionar nova equipe
document.getElementById("addTeamBtn").addEventListener("click", function () {
  const newTeamName = document.getElementById("newTeamName").value; // Obtém o nome da nova equipe
  if (newTeamName) {
    equipes.push(newTeamName); // Adiciona nova equipe à lista
    document.getElementById("newTeamName").value = ""; // Limpa o campo de entrada
    criarListaEquipesModal(); // Atualiza a lista no modal
    criarTabelaEquipes(); // Atualiza a tabela na visão geral
  } else {
    alert("Por favor, insira um nome para a nova equipe."); // Exibe alerta se o campo estiver vazio
  }
});

// Criar a tabela de equipes ao carregar a página

criarTabelaEquipes(); // Chama a função para criar a tabela de equipes

// MODAL DE REGISTRO !!!!

function abrirModal() {
  document.getElementById("modalQRCode").style.display = "flex"; // Mostrar modal
}

function fecharModal() {
  document.getElementById("modalQRCode").style.display = "none"; // Fechar modal
}

// Fechar modal ao clicar fora dele
window.onclick = function (event) {
  var modal = document.getElementById("modalQRCode");
  if (event.target == modal) {
    fecharModal();
  }
};
