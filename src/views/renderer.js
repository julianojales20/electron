/**
 * Processo de renderização
 */

console.log("Processo de renderização");
console.log(`Electron: ${api.verElectron()}`);

function openClild() {
  //console.log("teste do botão");
  api.open();
}

api.send("OI!");

api.on((event, message) => {
  console.log(`Processo de renderização recebeu uma mensagem ${message}`);
});

function info() {
  api.info();
}

function warning() {
  api.warning();
}

function select() {
  api.select();
}
