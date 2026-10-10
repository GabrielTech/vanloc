/* =====================================================
VANLOC - DASHBOARD DO PASSAGEIRO
Integração com localStorage do site principal.
===================================================== */

function dpEscape(texto) {
    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function dpPassageiroAtual() {
    const email = vlGetSessaoPassageiro();
    return email ? vlGetPassageiro(email) : null;
}

function dpMostrarAba(aba) {
    ["inicio", "perfil", "reservas", "favoritos", "notificacoes"].forEach(function(item) {
        const secao = document.getElementById("dpAba" + item.charAt(0).toUpperCase() + item.slice(1));
        if (secao) secao.classList.toggle("ativa", item === aba);
    });
    document.querySelectorAll(".dp-nav button").forEach(function(botao) {
        botao.classList.toggle("ativo", botao.dataset.aba === aba);
    });
    window.scrollTo({top: 0, behavior: "smooth"});
}

function dpInicial(texto) {
    return (texto || "U").trim().charAt(0).toUpperCase();
}

function dpRenderAvatar(passageiro, classe) {
    if (passageiro.foto) {
        return '<img class="' + classe + '" src="' + dpEscape(passageiro.foto) + '" alt="Foto de perfil">';
    }
    return '<div class="' + classe + ' dp-avatar">' + dpEscape(dpInicial(passageiro.nome)) + '</div>';
}

function dpCarregar() {
    const passageiro = dpPassageiroAtual();
    if (!passageiro) {
        window.location.href = "index.html";
        return;
    }

    const primeiroNome = (passageiro.nome || "Usuário").split(" ")[0];

    document.getElementById("dpSaudacao").textContent = "Olá, " + primeiroNome + "! 👋";
    document.getElementById("dpStatLocalidade").textContent = passageiro.cidade || "—";
    document.getElementById("dpUserMini").innerHTML =
        dpRenderAvatar(passageiro, "dp-avatar") +
        '<strong>' + dpEscape(primeiroNome) + '</strong>';

    document.getElementById("dpNome").value = passageiro.nome || "";
    document.getElementById("dpEmail").value = passageiro.email || "";
    document.getElementById("dpTelefone").value = passageiro.telefone || "";
    document.getElementById("dpCidade").value = passageiro.cidade || "";
    document.getElementById("dpEstado").value = passageiro.estado || "";
    document.getElementById("dpBio").value = passageiro.bio || "";

    dpAtualizarFotoPreview(passageiro);

    document.getElementById("dpResumoPerfil").innerHTML =
        '<div style="display:flex;align-items:center;gap:16px">' +
        dpRenderAvatar(passageiro, "dp-avatar") +
        '<div><strong style="font-size:18px">' + dpEscape(passageiro.nome) + '</strong>' +
        '<div style="color:#667085;margin-top:4px">' + dpEscape(passageiro.email) + '</div>' +
        '<div style="color:#667085;margin-top:3px">📍 ' + dpEscape(passageiro.cidade || "Localidade não informada") +
        (passageiro.estado ? ' - ' + dpEscape(passageiro.estado) : '') + '</div></div></div>';

    let reservas = [];
    try {
        const todasReservas = JSON.parse(localStorage.getItem("vanloc_reservas") || "[]");
        reservas = (Array.isArray(todasReservas) ? todasReservas : [])
            .filter(function(item) {
                return (item.email || "").toLowerCase() === (passageiro.email || "").toLowerCase();
            })
            .sort(function(a, b) {
                return new Date(b.criadaEm || 0) - new Date(a.criadaEm || 0);
            });
    } catch (erro) {
        reservas = [];
    }

    document.getElementById("dpStatReservas").textContent = reservas.length;
    document.getElementById("dpListaReservas").innerHTML = reservas.length
        ? reservas.map(dpRenderReserva).join("")
        : '<div class="dp-empty">Você ainda não possui reservas. <br><br><a href="index.html#viagens" class="dp-btn" style="display:inline-block;text-decoration:none">Encontrar uma viagem</a></div>';

    document.getElementById("dpProximasViagens").innerHTML = reservas.length
        ? reservas.slice(0, 3).map(dpRenderReserva).join("")
        : 'Você ainda não possui reservas registradas. <br><br><a href="index.html#viagens" class="dp-btn" style="display:inline-block;text-decoration:none">Encontrar viagem</a>';
}

function dpRenderReserva(reserva) {
    const status = reserva.status || "Solicitada";
    const statusLower = status.toLowerCase();
    const statusClass = statusLower.includes("confirm")
        ? "confirmada"
        : statusLower.includes("cancel")
            ? "cancelada"
            : "pendente";
    const statusLabel = statusLower.includes("solicit")
        ? "Reserva solicitada"
        : status;
    const quantidade = Math.max(1, Number.parseInt(reserva.quantidade, 10) || 1);
    const valor = Number(reserva.valor);
    const temValor = Number.isFinite(valor) && valor > 0;
    const moeda = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    const total = temValor ? moeda.format(valor * quantidade) : "A confirmar";
    const unitario = temValor ? moeda.format(valor) : "A confirmar";
    let realizadaEm = "Agora há pouco";

    if (reserva.criadaEm) {
        const dataCriacao = new Date(reserva.criadaEm);
        if (!Number.isNaN(dataCriacao.getTime())) {
            realizadaEm = dataCriacao.toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short"
            });
        }
    }

    const rota = reserva.origem || reserva.destino
        ? dpEscape(reserva.origem || "Origem") + " → " + dpEscape(reserva.destino || "Destino")
        : dpEscape(reserva.viagem || "Viagem reservada");

    return '<article class="dp-trip">' +
        '<div class="dp-trip-topline">' +
        '<span class="dp-chip dp-chip--' + statusClass + '">' + dpEscape(statusLabel) + '</span>' +
        '<span class="dp-trip-code">Código: ' + dpEscape(reserva.id || "—") + '</span>' +
        '</div>' +
        '<h3>' + rota + '</h3>' +
        '<div class="dp-trip-details">' +
        '<div><span>Data da viagem</span><strong>' + dpEscape(reserva.data || "Não informada") + '</strong></div>' +
        '<div><span>Horário de saída</span><strong>' + dpEscape(reserva.horario || "Não informado") + '</strong></div>' +
        '<div><span>Motorista</span><strong>' + dpEscape(reserva.motoristaNome || "VANLOC") + '</strong></div>' +
        '<div><span>Passageiros</span><strong>' + quantidade + (quantidade === 1 ? " pessoa" : " pessoas") + '</strong></div>' +
        '<div><span>Valor por pessoa</span><strong>' + unitario + '</strong></div>' +
        '<div><span>Total estimado</span><strong>' + total + '</strong></div>' +
        '</div>' +
        '<p class="dp-trip-created">Solicitada em ' + dpEscape(realizadaEm) + ' · Salva neste dispositivo. Confirme a disponibilidade diretamente com o motorista.</p>' +
        '</article>';
}

function dpAtualizarFotoPreview(passageiro) {
    const box = document.getElementById("dpFotoPreview");
    if (passageiro.foto) {
        box.innerHTML = '<img src="' + dpEscape(passageiro.foto) + '" alt="Foto de perfil">';
    } else {
        box.textContent = dpInicial(passageiro.nome);
    }
}

function dpRemoverFoto() {
    const passageiro = dpPassageiroAtual();
    if (!passageiro) return;
    passageiro.foto = "";
    vlSalvarPassageiro(passageiro);
    dpCarregar();
}

document.addEventListener("DOMContentLoaded", function() {
    dpCarregar();

    if (window.location.hash === "#reservas") {
        dpMostrarAba("reservas");
    }

    const inputFoto = document.getElementById("dpFotoInput");
    if (inputFoto) {
        inputFoto.addEventListener("change", function() {
            const arquivo = this.files && this.files[0];
            if (!arquivo) return;
            if (!arquivo.type.startsWith("image/")) {
                alert("Escolha uma imagem válida.");
                this.value = "";
                return;
            }
            if (arquivo.size > 2 * 1024 * 1024) {
                alert("Escolha uma imagem de até 2 MB para este MVP.");
                this.value = "";
                return;
            }
            const leitor = new FileReader();
            leitor.onload = function(event) {
                const passageiro = dpPassageiroAtual();
                if (!passageiro) return;
                passageiro.foto = event.target.result;
                vlSalvarPassageiro(passageiro);
                dpCarregar();
            };
            leitor.readAsDataURL(arquivo);
        });
    }

    const form = document.getElementById("dpFormPerfil");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const passageiro = dpPassageiroAtual();
            if (!passageiro) return;
            passageiro.nome = document.getElementById("dpNome").value.trim();
            passageiro.telefone = document.getElementById("dpTelefone").value.trim();
            passageiro.cidade = document.getElementById("dpCidade").value.trim();
            passageiro.estado = document.getElementById("dpEstado").value.trim().toUpperCase();
            passageiro.bio = document.getElementById("dpBio").value.trim();
            vlSalvarPassageiro(passageiro);
            dpCarregar();
            alert("Perfil atualizado com sucesso!");
        });
    }
});

function dpSair() {
    vlEncerrarSessaoPassageiro();
    window.location.href = "index.html";
}
