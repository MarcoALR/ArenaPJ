       // Seleciona elementos do DOM para manipulação
       const modalAutenticacao = document.getElementById("modalAutenticacao"); // Modal de autenticação
       const fecharModal = document.querySelector(".fecharModal"); // Botão para fechar modal
       const abaLogin = document.getElementById("abaLogin"); // Aba de login
       const abaRegistro = document.getElementById("abaRegistro"); // Aba de registro
       const formLogin = document.getElementById("formLogin"); // Formulário de login
       const formRegistro = document.getElementById("formRegistro"); // Formulário de registro
       // Abre o modal ao clicar no botão "CRIAR CONTA"
       document.querySelector(".conta-menu button").onclick = function () {
           modalAutenticacao.style.display = "block"; // Exibe o modal de autenticação
           mostrarLogin(); // Mostra o formulário de login por padrão
       };
       // Fecha o modal ao clicar no "X"
       fecharModal.onclick = function () {
           modalAutenticacao.style.display = "none"; // Oculta o modal
       };
       // Alterna para o formulário de login
       abaLogin.onclick = function () {
           mostrarLogin(); // Chama a função para exibir o formulário de login
       };
       // Alterna para o formulário de registro
       abaRegistro.onclick = function () {
           mostrarRegistro(); // Chama a função para exibir o formulário de registro
       };
       // Função para exibir o formulário de login
       function mostrarLogin() {
           formLogin.classList.add("ativa"); // Adiciona classe "ativa" ao formulário de login
           formRegistro.classList.remove("ativa"); // Remove classe "ativa" do formulário de registro
           abaLogin.style.backgroundColor = "#e0e0e0"; // Muda a cor de fundo da aba de login
           abaRegistro.style.backgroundColor = "#fff"; // Restaura a cor de fundo da aba de registro
       }
       // Função para exibir o formulário de registro
       function mostrarRegistro() {
           formRegistro.classList.add("ativa"); // Adiciona classe "ativa" ao formulário de registro
           formLogin.classList.remove("ativa"); // Remove classe "ativa" do formulário de login
           abaRegistro.style.backgroundColor = "#e0e0e0"; // Muda a cor de fundo da aba de registro
           abaLogin.style.backgroundColor = "#fff"; // Restaura a cor de fundo da aba de login
       }
       // Fecha o modal ao clicar fora dele
       window.onclick = function (event) {
           if (event.target == modalAutenticacao) {
               modalAutenticacao.style.display = "none"; // Oculta o modal se o clique for fora dele
           }
       };

       // Função para atualizar o número de participantes com base no formato selecionado
       function atualizarParticipantes() {
           const participantesSelect = document.getElementById("participantes");
           participantesSelect.innerHTML = ""; // Limpa as opções atuais
           const formato = document.querySelector('input[name="formato"]:checked').value; // Obtém o formato selecionado
           let minParticipantes = 2; // Define valores mínimos
           let maxParticipantes = 32; // Define valores máximos
           // Define valores mínimos de participantes de acordo com o formato selecionado
           switch (formato) {
               case "mata-mata":
                   minParticipantes = 2; // Para formato mata-mata, mínimo de 2 participantes
                   break;
               case "duplo-mata-mata":
                   minParticipantes = 4; // Para duplo mata-mata, mínimo de 4 participantes
                   break;
               case "liga":
                   minParticipantes = 2; // Para liga, mínimo de 2 participantes
                   break;
               case "fases":
                   minParticipantes = 4; // Para fases múltiplas, mínimo de 4 participantes
                   break;
           }
           // Preenche as opções de participantes
           for (let i = minParticipantes; i <= maxParticipantes; i++) {
               const option = document.createElement("option"); // Cria uma nova opção
               option.value = i; // Define o valor da opção
               option.textContent = i; // Define o texto exibido da opção
               participantesSelect.appendChild(option); // Adiciona a opção ao select
           }
       }
       // Atualizar o número de participantes ao carregar a página
       document.addEventListener("DOMContentLoaded", function () {
           atualizarParticipantes(); // Chama a função para preencher as opções de participantes quando a página carrega
       });
       // Atualizar o número de participantes ao mudar o formato
       document.querySelectorAll('input[name="formato"]').forEach(function (input) {
           input.addEventListener("change", function () {
               atualizarParticipantes(); // Chama a função para atualizar as opções de participantes quando o formato é alterado
           });
       });
       // Ao clicar no botão para iniciar o campeonato
       document.getElementById("iniciarCampeonato").addEventListener("click", function () {
           const esporte = document.getElementById("esporte").value; // Obtém o esporte selecionado
           const participantes = document.getElementById("participantes").value; // Obtém o número de participantes
           const formato = document.querySelector('input[name="formato"]:checked').value; // Obtém o formato selecionado
           // Armazena os dados no localStorage
           localStorage.setItem("esporte", esporte);
           localStorage.setItem("participantes", participantes);
           localStorage.setItem("formato", formato);
           const equipes = []; // Cria um array para as equipes
           for (let i = 1; i <= participantes; i++) {
               equipes.push(`Equipe ${i}`); // Adiciona as equipes ao array
           }
           localStorage.setItem("equipes", JSON.stringify(equipes)); // Salva as equipes no localStorage
           // Redireciona para outra página
           window.location.href = "/assets/.src/VisãoGeral.html"; // Muda a página atual para "VisãoGeral.html"
       });