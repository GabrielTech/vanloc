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
        return '<img class="' + classe + '" src="' + passageiro.foto + '" alt="Foto de perfil">';
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

    const reservas = JSON.parse(localStorage.getItem("vanloc_reservas") || "[]")
        .filter(function(item) { return item.email === passageiro.email; });

    document.getElementById("dpStatReservas").textContent = reservas.length;
    document.getElementById("dpListaReservas").innerHTML = reservas.length
        ? reservas.map(dpRenderReserva).join("")
        : '<div class="dp-empty">Você ainda não possui reservas. <br><br><a href="index.html#viagens" class="dp-btn" style="display:inline-block;text-decoration:none">Encontrar uma viagem</a></div>';

    document.getElementById("dpProximasViagens").innerHTML = reservas.length
        ? reservas.slice(0, 3).map(dpRenderReserva).join("")
        : 'Você ainda não possui reservas registradas. <br><br><a href="index.html#viagens" class="dp-btn" style="display:inline-block;text-decoration:none">Encontrar viagem</a>';
}

function dpRenderReserva(reserva) {
    return '<div class="dp-trip">' +
        '<div><span class="dp-chip">Reserva</span>' +
        '<h3>' + dpEscape(reserva.origem || "Origem") + ' → ' + dpEscape(reserva.destino || "Destino") + '</h3>' +
        '<p>📅 ' + dpEscape(reserva.data || "Data não informada") + ' &nbsp; ⏰ ' + dpEscape(reserva.horario || "Horário não informado") + '</p>' +
        '</div><div><strong>' + dpEscape(reserva.motoristaNome || "VANLOC") + '</strong></div></div>';
}

function dpAtualizarFotoPreview(passageiro) {
    const box = document.getElementById("dpFotoPreview");
    if (passageiro.foto) {
        box.innerHTML = '<img src="' + passageiro.foto + '" alt="Foto de perfil">';
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
