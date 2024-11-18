
        // Função para embaralhar um array.Fisher-Yates consiste em realizar permutações num conjunto para que seus elementos assumam uma ordem aleatória.
        function embaralharEquipes(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1)); // Gera um índice aleatório
                // Troca os elementos de posição
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array; // Retorna o array embaralhado
        }


        // Obtém as equipes do localStorage ou inicializa como um array vazio se não houver dados
        let equipes = JSON.parse(localStorage.getItem("equipes")) || [];
        // Seleciona o elemento HTML onde o bracket do torneio será exibido
        let bracket = document.getElementById("bracket");
        // Inicializa um array para armazenar as partidas do torneio
        let partidas = [];
        // Armazena o índice da partida atual que está sendo editada
        let partidaAtualIndex;


        // Alteração na função gerarTorneio
        function gerarTorneio() {
            // Verifica se há pelo menos 2 equipes para iniciar o torneio
            if (equipes.length < 2) {
                alert("É necessário pelo menos 2 equipes para iniciar o torneio.");
                return;
            }
            // Embaralha as equipes antes de criar as rodadas
            const equipesEmbaralhadas = embaralharEquipes(equipes);
            // Limpa o bracket antes de criar a nova rodada
            bracket.innerHTML = '';
            // Cria a primeira rodada com as equipes embaralhadas
            criarRodada(equipesEmbaralhadas);
        }

        // Função para criar uma rodada de partidas
        function criarRodada(equipes) {
            // Cria um novo elemento div para a rodada
            let rodadaDiv = document.createElement("div");
            rodadaDiv.classList.add("rodada"); // Adiciona a classe d estilo 'rodada'
            partidas = []; // Limpa as partidas anteriores para começar a nova rodada
            // Loop para criar partidas a partir das equipes
            for (let i = 0; i < equipes.length; i += 2) {
                if (i + 1 < equipes.length) {
                    // Se houver duas equipes, cria uma partida
                    let partida = {
                        equipe1: equipes[i], // Primeira equipe
                        equipe2: equipes[i + 1], // Segunda equipe
                        // Obtém os pontos da partida do localStorage ou define como 0
                        pontos1: parseInt(localStorage.getItem(`pontos1-${Math.floor(i / 2)}`)) || 0,
                        pontos2: parseInt(localStorage.getItem(`pontos2-${Math.floor(i / 2)}`)) || 0,
                        vencedor: null // Inicialmente, não há vencedor
                    };
                    partidas.push(partida); // Adiciona a partida ao array de partidas
                    // Cria um novo elemento div para a exibição da partida
                    let partidaDiv = document.createElement("div");
                    partidaDiv.classList.add("partida"); // Adiciona a classe de estilo 'partida'
                    partidaDiv.innerHTML = `
                        <h3>Partida ${Math.floor(i / 2) + 1}</h3> <!-- Título da partida -->
                        <div class="equipes">
                            <div>${partida.equipe1} <strong id="pontos1-${Math.floor(i / 2)}">${partida.pontos1}</strong></div> <!-- Exibe a primeira equipe e seus pontos -->
                            <div>${partida.equipe2} <strong id="pontos2-${Math.floor(i / 2)}">${partida.pontos2}</strong></div> <!-- Exibe a segunda equipe e seus pontos -->
                        </div>
                        <div class="icones">
                            <i class="fas fa-edit" onclick="abrirModal(${Math.floor(i / 2)})"></i> <!-- Ícone para editar resultados, chama a função abrirModal -->
                        </div>
                    `;
                    rodadaDiv.appendChild(partidaDiv); // Adiciona a div da partida à rodada
                } else {
                    // Se houver uma equipe sem par, ela avança automaticamente
                    let equipeAvancada = equipes[i];
                    let partidaDiv = document.createElement("div");
                    partidaDiv.classList.add("partida"); // Adiciona a classe de estilo 'partida'
                    partidaDiv.innerHTML = `
                        <h3>Equipe Avançando</h3> <!-- Título para equipe que avança -->
                        <div class="equipes">
                            <div>${equipeAvancada} avança automaticamente</div> <!-- Indica que a equipe avança -->
                        </div>
                    `;
                    rodadaDiv.appendChild(partidaDiv); // Adiciona a div da partida à rodada
                    partidas.push({
                        equipe1: equipeAvancada, // A equipe que avança
                        equipe2: null, // Sem segunda equipe
                        pontos1: 0, // Pontos inicializados como 0
                        pontos2: 0,
                        vencedor: equipeAvancada // A equipe avança automaticamente, portanto é o vencedor
                    });
                }
            }
            // Adiciona a rodada ao bracket na interface
            bracket.appendChild(rodadaDiv);
        }
        // Função para abrir o modal de edição de resultados
        function abrirModal(indicePartida) {
            partidaAtualIndex = indicePartida; // Armazena o índice da partida atual
            let modal = document.getElementById("editModal");
            modal.style.display = "flex"; // Exibe o modal
            let winnerSelect = document.getElementById("winner");
            // Preenche o seletor de vencedores com as equipes da partida atual
            winnerSelect.innerHTML = `
                <option value="${partidas[indicePartida].equipe1}">${partidas[indicePartida].equipe1}</option>
                <option value="${partidas[indicePartida].equipe2 || ''}">${partidas[indicePartida].equipe2 || ''}</option>
            `;
            winnerSelect.disabled = false; // Habilita a seleção do vencedor
            // Preenche os campos de pontuação com os valores atuais da partida
            document.getElementById("team1Score").value = partidas[indicePartida].pontos1;
            document.getElementById("team2Score").value = partidas[indicePartida].pontos2;
            // Adiciona eventos para verificar a pontuação enquanto o usuário digita
            document.getElementById("team1Score").addEventListener("input", verificarPontuacao);
            document.getElementById("team2Score").addEventListener("input", verificarPontuacao);
            // Ação ao clicar em salvar resultado
            document.getElementById("saveResult").onclick = function () {
                salvarResultado(indicePartida); // Chama a função para salvar o resultado
            };
            // Ação ao clicar em fechar o modal
            document.getElementById("closeModal").onclick = function () {
                modal.style.display = "none"; // Oculta o modal
                // Remove os listeners adicionados
                document.getElementById("team1Score").removeEventListener("input", verificarPontuacao);
                document.getElementById("team2Score").removeEventListener("input", verificarPontuacao);
            };
        }
        // Função para verificar se a pontuação é válida
        function verificarPontuacao() {
            let pontos1 = parseInt(document.getElementById("team1Score").value, 10); // Obtém os pontos da equipe 1
            let pontos2 = parseInt(document.getElementById("team2Score").value, 10); // Obtém os pontos da equipe 2
            let winnerSelect = document.getElementById("winner");
            // Habilita ou desabilita a seleção do vencedor com base na pontuação
            winnerSelect.disabled = !(pontos1 === pontos2 && pontos1 >= 0 && pontos2 >= 0);
        }


     function salvarResultado(indicePartida) {
    let pontos1 = parseInt(document.getElementById("team1Score").value, 10); // Obtém os pontos da equipe 1
    let pontos2 = parseInt(document.getElementById("team2Score").value, 10); // Obtém os pontos da equipe 2
    let vencedor = document.getElementById("winner").value; // Obtém o vencedor selecionado

    // Atualiza os pontos da partida
    partidas[indicePartida].pontos1 = pontos1;
    partidas[indicePartida].pontos2 = pontos2;

    // Salva os pontos no localStorage
    localStorage.setItem(`pontos1-${indicePartida}`, pontos1);
    localStorage.setItem(`pontos2-${indicePartida}`, pontos2);

    // Atualiza o vencedor da partida com base nos pontos
    partidas[indicePartida].vencedor = (pontos1 === pontos2) ? vencedor : (pontos1 > pontos2 ? partidas[indicePartida].equipe1 : partidas[indicePartida].equipe2);

    // Atualiza os pontos exibidos na tela
    document.getElementById(`pontos1-${indicePartida}`).innerText = pontos1;
    document.getElementById(`pontos2-${indicePartida}`).innerText = pontos2;

    // Aplica a classe "salva" para mudar a borda para vermelha
    let partidaDiv = document.querySelector(`#bracket .partida:nth-child(${indicePartida + 1})`);
    partidaDiv.classList.add("salva");

    // Fecha o modal
    document.getElementById("editModal").style.display = "none";

    // Verifica se a rodada acabou
    if (verificarFimDaRodada()) {
        criarNovaRodada(); // Se a rodada terminou, cria uma nova rodada
    }
}

        // Função para verificar se todas as partidas da rodada têm vencedor
        function verificarFimDaRodada() {
            return partidas.every(partida => partida.vencedor !== null); // Retorna true se todas as partidas têm vencedor
        }

        // Função para criar uma nova rodada
        function criarNovaRodada() {
            let vencedores = partidas.map(partida => partida.vencedor); // Obtém os vencedores de todas as partidas
            
            if (vencedores.length === 1) {
                exibirVencedor(vencedores[0]); // Se há apenas um vencedor, exibe o vencedor do torneio
            } else {
                criarRodada(vencedores); // Caso contrário, cria uma nova rodada com os vencedores
            }
        }

// Função para exibir o vencedor do torneio
function exibirVencedor(vencedor) {
    // Criação da div de resultado
    const resultadoDiv = document.createElement("div");
    resultadoDiv.style.padding = "20px";
    resultadoDiv.style.textAlign = "center";
    resultadoDiv.style.backgroundColor = "#f8f9fa";
    resultadoDiv.style.border = "2px solid #007bff";
    resultadoDiv.style.borderRadius = "10px";
    resultadoDiv.style.marginTop = "30px";
    resultadoDiv.style.fontFamily = "'Arial', sans-serif";
    resultadoDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";

    // Mensagem com o vencedor
    resultadoDiv.innerHTML = `
        <h2 style="color: #007bff;">Parabéns!</h2>
        <p style="font-size: 1.2rem; font-weight: bold; color: #333;">O vencedor do torneio é:</p>
        <h3 style="font-size: 1.5rem; color: #28a745;">${vencedor}</h3>
        <p>Gostaria de imprimir o resultado completo?</p>
        <button id="printButton" onclick="printPage()" style="
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
        ">Imprimir Resultado</button>
    `;

    // Adiciona a mensagem ao bracket
    bracket.appendChild(resultadoDiv);

    // Mostra o botão de impressão com transição suave
    setTimeout(() => {
        document.getElementById("printButton").style.display = "inline-block"; // Torna visível
    }, 500); // Espera 500ms antes de exibir o botão
}

// Função para imprimir a página
function printPage() {
    // Oculta o botão de impressão após ser clicado
    document.getElementById("printButton").style.display = "none";
    window.print(); // Aciona a impressão da página
}
        // Inicializar o torneio chamando a função de geração
        gerarTorneio();