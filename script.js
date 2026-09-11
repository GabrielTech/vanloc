

/* =========================
MODAL LOGIN
========================= */

function abrirLogin() {

    document.getElementById("modalLogin").style.display = "block";

}


function fecharLogin() {

    document.getElementById("modalLogin").style.display = "none";

}



/* =========================
CADASTRO USUÁRIO
========================= */

function abrirCadastroUsuario() {

    fecharLogin();

    document.getElementById("modalUsuario").style.display = "block";

}


function fecharUsuario() {

    document.getElementById("modalUsuario").style.display = "none";

}



/* =========================
CADASTRO MOTORISTA
========================= */

function abrirMotorista() {

    document.getElementById("modalMotorista").style.display = "block";

}


function fecharMotorista() {

    document.getElementById("modalMotorista").style.display = "none";

}



/* =========================
RESERVA
========================= */

function reservar(viagem) {

    document.getElementById("modalReserva").style.display = "block";

    document.getElementById("viagemSelecionada").innerText =
        "Você está reservando a viagem: " + viagem;

}


function fecharReserva() {

    document.getElementById("modalReserva").style.display = "none";

}



/* =========================
FECHAR MODAL AO CLICAR FORA
========================= */

window.onclick = function(event) {

    const modais = document.querySelectorAll(".modal");

    modais.forEach(function(modal) {

        if (event.target === modal) {

            modal.style.display = "none";

        }

    });

}



/* =========================
NOTIFICAÇÃO
========================= */

function mostrarNotificacao(mensagem) {

    const notificacao =
        document.getElementById("notificacao");

    const texto =
        document.getElementById("mensagemNotificacao");

    texto.innerText = mensagem;

    notificacao.style.display = "flex";


    setTimeout(function() {

        notificacao.style.display = "none";

    }, 4000);

}



/* =========================
LOGIN
========================= */

document
.getElementById("formLogin")
.addEventListener("submit", function(event) {

    event.preventDefault();

    fecharLogin();

    mostrarNotificacao(
        "Login realizado com sucesso!"
    );

});



/* =========================
CADASTRO USUÁRIO
========================= */

document
.getElementById("formUsuario")
.addEventListener("submit", function(event) {

    event.preventDefault();


    const nome =
        document.getElementById("nomeUsuario").value;


    fecharUsuario();


    mostrarNotificacao(
        "Conta de " + nome + " criada com sucesso!"
    );


    this.reset();

});



/* =========================
RESERVA
========================= */

document
.getElementById("formReserva")
.addEventListener("submit", function(event) {

    event.preventDefault();


    fecharReserva();


    mostrarNotificacao(
        "Sua reserva foi enviada com sucesso!"
    );


    this.reset();

});



/* =========================
CADASTRO MOTORISTA
========================= */

document
.getElementById("formMotorista")
.addEventListener("submit", function(event) {

    event.preventDefault();


    const nome =
        document.getElementById("nomeMotorista").value;

    const origem =
        document.getElementById("origem").value;

    const destino =
        document.getElementById("destino").value;

    const data =
        document.getElementById("dataViagem").value;

    const horario =
        document.getElementById("horarioViagem").value;

    const valor =
        document.getElementById("valorViagem").value;

    const fotoInput =
        document.getElementById("fotoVan");


    let fotoVan =
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80";


    if (fotoInput.files.length > 0) {

        fotoVan =
            URL.createObjectURL(
                fotoInput.files[0]
            );

    }


    adicionarViagem(

        nome,
        origem,
        destino,
        data,
        horario,
        valor,
        fotoVan

    );


    fecharMotorista();


    mostrarNotificacao(
        "Viagem cadastrada com sucesso!"
    );


    this.reset();

});



/* =========================
ADICIONAR NOVA VIAGEM
========================= */

function adicionarViagem(

    nome,
    origem,
    destino,
    data,
    horario,
    valor,
    foto

) {


    const lista =
        document.getElementById("listaViagens");


    const iniciais =
        nome
        .split(" ")
        .map(palavra => palavra.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();


    const novaViagem = `

        <div class="viagem-card">

            <div class="imagem-van">

                <img
                    src="${foto}"
                    alt="Van cadastrada"
                >

                <span class="disponivel">
                    Disponível
                </span>

            </div>


            <div class="viagem-info">


                <div class="motorista-info">

                    <div class="avatar">

                        ${iniciais}

                    </div>


                    <div>

                        <strong>
                            ${nome}
                        </strong>

                        <span>

                            Motorista cadastrado

                            <i class="fa-solid fa-circle-check"></i>

                        </span>

                    </div>

                </div>


                <h3>

                    ${origem}

                    <i class="fa-solid fa-arrow-right"></i>

                    ${destino}

                </h3>


                <div class="detalhes">

                    <span>

                        <i class="fa-solid fa-calendar"></i>

                        ${formatarData(data)}

                    </span>


                    <span>

                        <i class="fa-solid fa-clock"></i>

                        ${horario}

                    </span>

                </div>


                <div class="rodape-viagem">

                    <div>

                        <small>
                            A partir de
                        </small>

                        <strong>
                            R$ ${valor}
                        </strong>

                    </div>


                    <button
                        onclick="reservar('${origem} para ${destino}')"
                    >

                        Reservar

                    </button>

                </div>


            </div>

        </div>

    `;


    lista.insertAdjacentHTML(
        "afterbegin",
        novaViagem
    );



    document
    .getElementById("viagens")
    .scrollIntoView({

        behavior: "smooth"

    });

}



/* =========================
FORMATAR DATA
========================= */

function formatarData(data) {

    if (!data) {

        return "";

    }


    const partes =
        data.split("-");


    return partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0];

}



/* =========================
BUSCAR VIAGEM
========================= */

function buscarViagem() {


    const destino =
        document
        .getElementById("buscaDestino")
        .value
        .toLowerCase();


    const viagens =
        document.querySelectorAll(
            ".viagem-card"
        );


    let encontradas = 0;


    viagens.forEach(function(viagem) {


        const texto =
            viagem
            .innerText
            .toLowerCase();


        if (
            texto.includes(destino)
        ) {

            viagem.style.display = "block";

            encontradas++;

        }

        else {

            viagem.style.display = "none";

        }


    });


    if (encontradas === 0) {

        mostrarNotificacao(
            "Nenhuma viagem encontrada para este destino."
        );

    }

    else {

        mostrarNotificacao(
            encontradas +
            " viagem(ns) encontrada(s)!"
        );


        document
        .getElementById("viagens")
        .scrollIntoView({

            behavior: "smooth"

        });

    }

}



/* =========================
LIMPAR BUSCA
========================= */

document
.getElementById("buscaDestino")
.addEventListener("input", function() {

    if (this.value === "") {

        const viagens =
            document.querySelectorAll(
                ".viagem-card"
            );


        viagens.forEach(function(viagem) {

            viagem.style.display = "block";

        });

    }

});
