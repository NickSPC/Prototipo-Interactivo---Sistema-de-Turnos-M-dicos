const botones = document.querySelectorAll("[data-target]");

botones.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const target = btn.getAttribute("data-target");

        document.querySelectorAll(".card").forEach(sec => {
            sec.classList.add("hidden");
        });

        document.getElementById(target).classList.remove("hidden");

        if (target === "historial") cargarTurnos();
    });
});

// BLOQUEAR FECHAS PASADAS
const fechaInput = document.querySelector('input[type="date"]');
const hoy = new Date().toISOString().split("T")[0];
fechaInput.setAttribute("min", hoy);

const especialidades = {
    "Clínica": ["Dr. Pérez", "Dra. Gómez"],
    "Pediatría": ["Dr. López", "Dra. Ruiz"],
    "Odontología": ["Dr. Sánchez", "Dra. Fernández"],
    "Cardiología": ["Dr. Ramírez", "Dra. Torres"],
    "Dermatología": ["Dra. Silva", "Dr. Castro"],
    "Traumatología": ["Dr. Medina", "Dr. Rojas"],
    "Ginecología": ["Dra. Herrera", "Dra. Vega"]
};

const selectEsp = document.querySelector(".filters select:first-child");
const selectMed = document.querySelector(".filters select:nth-child(2)");

// cargar especialidades al inicio
Object.keys(especialidades).forEach(esp => {
    const option = document.createElement("option");
    option.textContent = esp;
    selectEsp.appendChild(option);
});

selectEsp.addEventListener("change", () => {
    const esp = selectEsp.value;

    selectMed.innerHTML = "<option>Médico</option>";

    if (especialidades[esp]) {
        especialidades[esp].forEach(med => {
            const option = document.createElement("option");
            option.textContent = med;
            selectMed.appendChild(option);
        });
    }
});

// SELECCIÓN DE HORARIO
let turnoSeleccionado = {};

document.querySelectorAll(".slot").forEach(slot => {
    slot.addEventListener("click", () => {
        if (slot.classList.contains("disabled")) return;

        document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
        slot.classList.add("selected");

        turnoSeleccionado.hora = slot.textContent;
    });
});


const btnReservar = document.querySelector('[data-target="confirmacion"]');

btnReservar.addEventListener("click", () => {
    const fecha = fechaInput.value;
    const especialidad = selectEsp.value;
    const medico = selectMed.value;

    if (!fecha || !turnoSeleccionado.hora || especialidad === "Especialidad" || medico === "Médico") {
        alert("Completá todos los datos");
        return;
    }

    turnoSeleccionado = {
        fecha,
        especialidad,
        medico,
        hora: turnoSeleccionado.hora
    };

    document.querySelector("#confirmacion p:nth-of-type(1)").innerHTML =
        `<strong>Médico:</strong> ${medico}`;

    document.querySelector("#confirmacion p:nth-of-type(2)").innerHTML =
        `<strong>Fecha:</strong> ${fecha} - ${turnoSeleccionado.hora}`;
});


// CONFIRMAR TURNO
document.querySelector("#confirmacion .primary").addEventListener("click", () => {
    let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

    turnos.push(turnoSeleccionado);

    localStorage.setItem("turnos", JSON.stringify(turnos));

    alert("Turno confirmado");

    document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
    turnoSeleccionado = {};
});


function cargarTurnos() {
    const lista = document.querySelector(".list");
    lista.innerHTML = "";

    const turnos = JSON.parse(localStorage.getItem("turnos")) || [];

    if (turnos.length === 0) {
        lista.innerHTML = "<li>No hay turnos registrados</li>";
        return;
    }

    turnos.forEach((t, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span>
                ${t.fecha} - ${t.especialidad} (${t.medico} - ${t.hora})
            </span>
            <button class="cancelar-btn" data-index="${index}">
                Eliminar
            </button>
        `;

        lista.appendChild(li);
    });

    activarBotonesEliminar();
}

function activarBotonesEliminar() {
    const botones = document.querySelectorAll(".cancelar-btn");

    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");

            let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

            const confirmar = confirm("¿Seguro que querés eliminar este turno?");
            if (!confirmar) return;

            turnos.splice(index, 1);

            localStorage.setItem("turnos", JSON.stringify(turnos));

            cargarTurnos(); // refresca la lista
        });
    });
}

const perfilForm = document.querySelector("#perfil form");

perfilForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = perfilForm.querySelector('input[type="text"]').value;
    const email = perfilForm.querySelector('input[type="email"]').value;

    // opcional: agregar teléfono si lo sumás al HTML
    const telefonoInput = perfilForm.querySelector('input[type="tel"]');
    const telefono = telefonoInput ? telefonoInput.value : "";

    const datos = { nombre, email, telefono };

    localStorage.setItem("perfil", JSON.stringify(datos));

    alert("Cambios guardados correctamente");
});


window.addEventListener("DOMContentLoaded", () => {
    const datos = JSON.parse(localStorage.getItem("perfil"));

    if (datos) {
        document.querySelector('#perfil input[type="text"]').value = datos.nombre || "";
        document.querySelector('#perfil input[type="email"]').value = datos.email || "";

        const telInput = document.querySelector('#perfil input[type="tel"]');
        if (telInput) telInput.value = datos.telefono || "";
    }
});
