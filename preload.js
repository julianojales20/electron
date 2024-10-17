const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  verElectron: () => process.versions.electron,
});

//Manipulação do DOM
window.addEventListener("DOMContentLoaded", () => {
  const dataAtual = (document.getElementById("dataAtual").innerHTML =
    obterData());
});

function obterData() {
  const data = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return data.toLocaleDateString("pt-BR", options);
}
