function mostrarSeccion(id) {
  const secciones = document.querySelectorAll("main section");

  secciones.forEach(sec => {
    sec.classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");
}

window.onload = () => {
  mostrarSeccion("inicio");
};

document.querySelectorAll("[data-target]").forEach(boton => {
  boton.addEventListener("click", (e) => {
    e.preventDefault();

    const destino = boton.getAttribute("data-target");
    if (destino) {
      mostrarSeccion(destino);
    }
  });
});

const slots = document.querySelectorAll(".slot");

slots.forEach(slot => {
  if (!slot.classList.contains("disabled")) {
    slot.addEventListener("click", () => {
      slots.forEach(s => s.classList.remove("selected"));
      slot.classList.add("selected");
    });
  }
});

document.querySelector("#confirmacion .primary").addEventListener("click", () => {
  alert("Turno confirmado");
  mostrarSeccion("historial");
});