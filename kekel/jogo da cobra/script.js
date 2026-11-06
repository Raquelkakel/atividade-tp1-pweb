
// ELEMENTOS HTML
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const mensagem = document.getElementById("mensagem");
const botaoIniciar = document.getElementById("iniciar");

const dificuldade = document.getElementById("dificuldade");
const velocidade = document.getElementById("velocidade");

// CONFIGURAÇÕES
const tamanho = 20;
const quantidade = canvas.width / tamanho;

// VARIÁVEIS DO JOGO
let cobrinha;
let comida;
let direcao;
let proximaDirecao;
let pontuacao;
let intervalo;
let ativo = false;

// INICIAR O JOGO
function iniciarJogo() {

    clearInterval(intervalo);

    cobrinha = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direcao = { x: 1, y: 0 };
    proximaDirecao = { x: 1, y: 0 };

    pontuacao = 0;
    ativo = true;

    scoreElement.textContent = pontuacao;
    mensagem.textContent = "Boa sorte!";

    criarComida();
    desenhar();

    intervalo = setInterval(
        atualizarJogo,
        obterVelocidade()
    );
}

// CONTROLAR A VELOCIDADE
function obterVelocidade() {

    let tempo = Number(velocidade.value);

    if (dificuldade.value === "dificil") {
        tempo = tempo * 0.6;
    }

    return tempo;
}

// CRIAR COMIDA
function criarComida() {

    do {
        comida = {
            x: Math.floor(Math.random() * quantidade),
            y: Math.floor(Math.random() * quantidade)
        };

    } while (
        cobrinha.some(parte =>
            parte.x === comida.x &&
            parte.y === comida.y
        )
    );
}

// MOVIMENTAÇÃO PELAS SETAS
document.addEventListener("keydown", function(event) {

    const tecla = event.key;

    if (tecla === "ArrowUp" && direcao.y !== 1) {

        proximaDirecao = { x: 0, y: -1 };

    } else if (tecla === "ArrowDown" && direcao.y !== -1) {

        proximaDirecao = { x: 0, y: 1 };

    } else if (tecla === "ArrowLeft" && direcao.x !== 1) {

        proximaDirecao = { x: -1, y: 0 };

    } else if (tecla === "ArrowRight" && direcao.x !== -1) {

        proximaDirecao = { x: 1, y: 0 };
    }

});

// ATUALIZAR O JOGO
function atualizarJogo() {

    if (!ativo) return;

    direcao = proximaDirecao;

    // CALCULAR NOVA POSIÇÃO DA CABEÇA
    const cabeca = {
        x: cobrinha[0].x + direcao.x,
        y: cobrinha[0].y + direcao.y
    };

    // VERIFICAR COLISÃO COM AS PAREDES
    if (
        cabeca.x < 0 ||
        cabeca.y < 0 ||
        cabeca.x >= quantidade ||
        cabeca.y >= quantidade
    ) {
        finalizarJogo();
        return;
    }

    // VERIFICAR SE COMEU
    const comeu = (
        cabeca.x === comida.x &&
        cabeca.y === comida.y
    );

    // VERIFICAR COLISÃO COM O PRÓPRIO CORPO
    const corpoVerificado = comeu
        ? cobrinha
        : cobrinha.slice(0, -1);

    if (
        corpoVerificado.some(parte =>
            parte.x === cabeca.x &&
            parte.y === cabeca.y
        )
    ) {
        finalizarJogo();
        return;
    }

    // ADICIONAR NOVA CABEÇA
    cobrinha.unshift(cabeca);

    // AUMENTAR PONTUAÇÃO E TAMANHO
    if (comeu) {

        pontuacao += 10;

        scoreElement.textContent = pontuacao;

        criarComida();

    } else {

        cobrinha.pop();
    }

    desenhar();
}

// DESENHAR A COBRINHA E A COMIDA
function desenhar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // DESENHAR COMIDA
    ctx.fillStyle = "#ff4757";

    ctx.fillRect(
        comida.x * tamanho,
        comida.y * tamanho,
        tamanho,
        tamanho
    );

    // DESENHAR COBRINHA
    cobrinha.forEach((parte, indice) => {

        ctx.fillStyle = indice === 0
            ? "#55ef8b"
            : "#2ecc71";

        ctx.fillRect(
            parte.x * tamanho,
            parte.y * tamanho,
            tamanho - 1,
            tamanho - 1
        );

    });
}

// FINALIZAR O JOGO
function finalizarJogo() {

    ativo = false;

    clearInterval(intervalo);

    mensagem.textContent =
        "Fim de jogo! Pontuação: " + pontuacao;
}

// BOTÃO INICIAR E REINICIAR
botaoIniciar.addEventListener("click", iniciarJogo);

// ALTERAR VELOCIDADE
velocidade.addEventListener("change", function() {

    if (ativo) {

        clearInterval(intervalo);

        intervalo = setInterval(
            atualizarJogo,
            obterVelocidade()
        );
    }

});

// ALTERAR DIFICULDADE
dificuldade.addEventListener("change", function() {

    if (ativo) {

        clearInterval(intervalo);

        intervalo = setInterval(
            atualizarJogo,
            obterVelocidade()
        );
    }

});

// PREPARAR A TELA INICIAL
criarTelaInicial();

function criarTelaInicial() {

    cobrinha = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    comida = { x: 15, y: 10 };

    desenhar();

    mensagem.textContent = "Clique em iniciar para jogar!";
}
