/* =====================================================
MODAIS
===================================================== */


function abrirLogin() {

    document.getElementById("modalLogin").style.display = "block";

}


function fecharLogin() {

    document.getElementById("modalLogin").style.display = "none";

}


function abrirMotorista() {

    document.getElementById("modalMotorista").style.display = "block";

}


function fecharMotorista() {

    document.getElementById("modalMotorista").style.display = "none";

}


function fecharReserva() {

    document.getElementById("modalReserva").style.display = "none";

}


function fecharPlanos() {

    document.getElementById("modalPlanos").style.display = "none";

}



/* =====================================================
FECHAR MODAL CLICANDO FORA
===================================================== */


window.onclick = function(event) {

    const modais = document.querySelectorAll(".modal");

    modais.forEach(function(modal) {

        if (event.target === modal) {

            modal.style.display = "none";

        }

    });

};



/* =====================================================
NOTIFICAÇÃO
===================================================== */


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



/* =====================================================
LOGIN
===================================================== */


document
.getElementById("formLogin")
.addEventListener("submit", function(event) {

    event.preventDefault();


    fecharLogin();


    mostrarNotificacao(
        "Login realizado com sucesso!"
    );

});



/* =====================================================
CADASTRO DO PASSAGEIRO
===================================================== */


document
.getElementById("formCadastroPassageiro")
.addEventListener("submit", function(event) {

    event.preventDefault();


    const nome =
        document
        .getElementById("passageiroNome")
        .value;


    const senha =
        document
        .getElementById("passageiroSenha")
        .value;


    const confirmarSenha =
        document
        .getElementById("passageiroConfirmarSenha")
        .value;


    if (senha !== confirmarSenha) {

        mostrarNotificacao(
            "As senhas não coincidem!"
        );

        return;

    }


    const passageiro = {

        nome: nome,

        email:
            document
            .getElementById("passageiroEmail")
            .value,

        telefone:
            document
            .getElementById("passageiroTelefone")
            .value,

        cidade:
            document
            .getElementById("passageiroCidade")
            .value

    };


    console.log(
        "Passageiro cadastrado:",
        passageiro
    );


    mostrarNotificacao(
        "Cadastro realizado com sucesso! Bem-vindo à VANLOC, " +
        nome +
        "!"
    );


    this.reset();

});



/* =====================================================
RESERVA
===================================================== */


function reservar(viagem) {

    document
    .getElementById("modalReserva")
    .style.display = "block";


    document
    .getElementById("viagemSelecionada")
    .innerText =
        "Você está reservando: " + viagem;

}


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



/* =====================================================
ABRIR PLANOS
===================================================== */


function abrirPlanos(motorista, viagem) {


    document
    .getElementById("modalPlanos")
    .style.display = "block";


    document
    .getElementById("tituloPlanos")
    .innerText =
        "Planos de " + motorista;


    document
    .getElementById("subtituloPlanos")
    .innerText =
        "Confira os planos disponíveis para " +
        viagem + ".";


}



/* =====================================================
ASSINAR PLANO
===================================================== */


function assinarPlano(plano) {


    fecharPlanos();


    mostrarNotificacao(
        "Você selecionou o " +
        plano +
        ". Faça login para continuar."
    );


    setTimeout(function() {

        abrirLogin();

    }, 1000);

}



/* =====================================================
CADASTRO DO MOTORISTA
===================================================== */


document
.getElementById("formMotorista")
.addEventListener("submit", function(event) {

    event.preventDefault();


    const nome =
        document
        .getElementById("nomeMotorista")
        .value;


    const origem =
        document
        .getElementById("origem")
        .value;


    const destino =
        document
        .getElementById("destino")
        .value;


    const data =
        document
        .getElementById("dataViagem")
        .value;


    const horario =
        document
        .getElementById("horarioViagem")
        .value;


    const valor =
        document
        .getElementById("valorViagem")
        .value;


    /* =================================================
    DADOS DO PLANO
    ================================================= */


    const nomePlano =
        document
        .getElementById("nomePlanoMotorista")
        .value;


    const valorPlano =
        document
        .getElementById("valorPlanoMotorista")
        .value;


    const quantidadePlano =
        document
        .getElementById("quantidadePlanoMotorista")
        .value;


    const beneficioPlano =
        document
        .getElementById("beneficioPlanoMotorista")
        .value;



    /* =================================================
    VALIDAR VALOR MÍNIMO
    ================================================= */


    if (
        valorPlano !== "" &&
        Number(valorPlano) < 20
    ) {

        mostrarNotificacao(
            "O valor mínimo do plano é R$ 20,00 por viagem."
        );

        return;

    }



    /* =================================================
    FOTO DA VAN
    ================================================= */


    const fotoInput =
        document
        .getElementById("fotoVan");


    let fotoVan =
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80";


    if (
        fotoInput.files.length > 0
    ) {

        fotoVan =
            URL.createObjectURL(
                fotoInput.files[0]
            );

    }



    /* =================================================
    ADICIONAR VIAGEM
    ================================================= */


    adicionarViagem(

        nome,

        origem,

        destino,

        data,

        horario,

        valor,

        fotoVan,

        nomePlano,

        valorPlano,

        quantidadePlano,

        beneficioPlano

    );



    fecharMotorista();


    mostrarNotificacao(
        "Viagem cadastrada com sucesso!"
    );


    this.reset();

});



/* =====================================================
ADICIONAR VIAGEM
===================================================== */


function adicionarViagem(

    nome,
    origem,
    destino,
    data,
    horario,
    valor,
    foto,
    nomePlano,
    valorPlano,
    quantidadePlano,
    beneficioPlano

) {


    const lista =
        document
        .getElementById("listaViagens");


    const iniciais =
        nome
        .split(" ")
        .map(
            palavra =>
            palavra.charAt(0)
        )
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

                            <i
                                class="fa-solid fa-circle-check"
                            ></i>

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


                    <div class="preco">


                        <small>

                            Viagem avulsa

                        </small>


                        <strong>

                            R$ ${formatarMoeda(valor)}

                        </strong>


                        ${
                            valorPlano
                            ?
                            `
                            <small class="valor-minimo">

                                Plano a partir de
                                R$ ${formatarMoeda(valorPlano)}/viagem

                            </small>
                            `
                            :
                            ""
                        }


                    </div>



                    <div class="botoes-viagem">


                        ${
                            valorPlano
                            ?
                            `
                            <button
                                class="btn-planos"
                                onclick="abrirPlanoMotorista(
                                    '${escapeHtml(nome)}',
                                    '${escapeHtml(origem)}',
                                    '${escapeHtml(destino)}',
                                    '${escapeHtml(nomePlano)}',
                                    '${valorPlano}',
                                    '${quantidadePlano}',
                                    '${escapeHtml(beneficioPlano)}'
                                )"
                            >

                                <i class="fa-solid fa-tags"></i>

                                Consultar planos

                            </button>
                            `
                            :
                            ""
                        }



                        <button
                            class="btn-reservar"
                            onclick="reservar(
                                '${escapeHtml(origem)} para ${escapeHtml(destino)}'
                            )"
                        >

                            Reservar

                        </button>


                    </div>


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



/* =====================================================
PLANO CRIADO PELO MOTORISTA
===================================================== */


function abrirPlanoMotorista(

    motorista,
    origem,
    destino,
    nomePlano,
    valor,
    quantidade,
    beneficio

) {


    document
    .getElementById("modalPlanos")
    .style.display = "block";


    document
    .getElementById("tituloPlanos")
    .innerText =
        nomePlano;


    document
    .getElementById("subtituloPlanos")
    .innerText =
        motorista +
        " • " +
        origem +
        " para " +
        destino;


    const lista =
        document
        .getElementById("listaPlanos");


    lista.innerHTML = `

        <div class="plano-card plano-destaque">

            <div class="mais-escolhido">

                PLANO DO MOTORISTA

            </div>


            <div class="plano-titulo">

                <i class="fa-solid fa-tags"></i>

                <h3>

                    ${nomePlano}

                </h3>

            </div>


            <p class="descricao-plano">

                Plano criado pelo motorista
                ${motorista}.

            </p>


            <div class="preco-plano">

                <small>

                    Valor por viagem

                </small>


                <strong>

                    R$ ${formatarMoeda(valor)}

                </strong>


                <span>

                    por viagem

                </span>

            </div>


            <ul>

                <li>

                    <i class="fa-solid fa-check"></i>

                    ${quantidade || "Quantidade personalizada"}
                    viagens

                </li>


                <li>

                    <i class="fa-solid fa-check"></i>

                    ${beneficio || "Benefício definido pelo motorista"}

                </li>


                <li>

                    <i class="fa-solid fa-check"></i>

                    Reserva pela VANLOC

                </li>

            </ul>


            <button
                onclick="assinarPlano('${escapeHtml(nomePlano)}')"
            >

                Assinar plano

            </button>


        </div>

    `;


}



/* =====================================================
BUSCAR VIAGEM
===================================================== */


function buscarViagem() {


    const destino =
        document
        .getElementById("buscaDestino")
        .value
        .toLowerCase()
        .trim();


    const data =
        document
        .getElementById("buscaData")
        .value;


    const viagens =
        document
        .querySelectorAll(".viagem-card");


    let encontradas = 0;


    viagens.forEach(function(viagem) {


        const texto =
            viagem
            .innerText
            .toLowerCase();


        const destinoEncontrado =
            destino === "" ||
            texto.includes(destino);


        const dataCard =
            viagem.dataset.data;


        const dataEncontrada =
            data === "" ||
            dataCard === data;


        if (
            destinoEncontrado &&
            dataEncontrada
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
            "Nenhuma viagem encontrada."
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



/* =====================================================
LIMPAR BUSCA
===================================================== */


document
.getElementById("buscaDestino")
.addEventListener(
    "input",
    function() {

        if (this.value === "") {

            const viagens =
                document
                .querySelectorAll(
                    ".viagem-card"
                );


            viagens.forEach(
                function(viagem) {

                    viagem.style.display =
                        "block";

                }
            );

        }

    }
);



/* =====================================================
FORMATAR DATA
===================================================== */


function formatarData(data) {

    if (!data) {

        return "";

    }


    const partes =
        data.split("-");


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}



/* =====================================================
FORMATAR MOEDA
===================================================== */


function formatarMoeda(valor) {

    return Number(valor)
        .toFixed(2)
        .replace(".", ",");

}



/* =====================================================
PROTEGER HTML
===================================================== */


function escapeHtml(texto) {

    if (!texto) {

        return "";

    }


    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
