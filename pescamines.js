let files = 0;
let columnes = 0;
function iniciarPartida() {
    files = parseInt(prompt("Insereix files"));
    columnes = parseInt(prompt("Insereix columnes"));
    files = Math.min(Math.max(files, 10), 30);
    columnes = Math.min(Math.max(columnes, 10), 30);
    files = isNaN(files) ? 10 : Math.min(Math.max(parseInt(files), 10), 30);
    columnes = isNaN(columnes) ? 10 : Math.min(Math.max(parseInt(columnes), 10), 30);

    creaTaulell();
    setMines();
}
function creaTaulell() {
    let div = document.getElementById('taulell');
    let taula = "";
    taula = "<table>";
    for (let fila = 0; fila < files; fila++) {
        taula += "<tr>";
        for (let columna = 0; columna < columnes; columna++) {
            taula += `<td style="height: 20px; width: 20px; background-image: url('img/fons20px.jpg');" data-mina="false" onclick="obreCasella(${fila}, ${columna})" id="${fila}-${columna}"></td>`;
        }
        taula += "</tr>";
    }
    taula += "</table>";
    div.innerHTML = taula;
}
function obreCasella(fila, columna) {
    if (esMina(fila, columna)) {
        console.log('funciona2');
        acabarPartida();
    }
}
function esMina(fila, columna) {
    let casella = document.getElementById(`${fila}-${columna}`);
    let mina = casella.getAttribute("data-mina");
    if (mina == "true") {
        console.log('funciona1');
        return true;
    }
    return false;
}
function setMines() {
    let mines = (Math.round((files * columnes) * 0.17));
    for (let i = 0; i < mines; i++) {
        let fila = Math.floor(Math.random() * files);
        let columna = Math.floor(Math.random() * columnes);
        let casella = document.getElementById(`${fila}-${columna}`);
        if (casella.dataset.mina === "false") {
            casella.dataset.mina = "true";
        } else {
            i--;
        }
    }
}
function acabarPartida() {
    for (let fila = 0; fila < files; fila++) {
        for (let columna = 0; columna < columnes; columna++) {
            let casella = document.getElementById(`${fila}-${columna}`);
            casella.disabled = true;
            if (casella.dataset.mina === "true") {
                casella.style.backgroundImage = "url('img/mina20px.jpg')";
            }
        }
    }
}