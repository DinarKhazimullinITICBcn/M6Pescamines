let files = 0;
let columnes = 0;
let casellesFaltants = 0;
function iniciarPartida() {
    files = parseInt(prompt("Insereix files"));
    columnes = parseInt(prompt("Insereix columnes"));
    files = Math.min(Math.max(files, 10), 30);
    columnes = Math.min(Math.max(columnes, 10), 30);
    files = isNaN(files) ? 10 : Math.min(Math.max(parseInt(files), 10), 30);
    columnes = isNaN(columnes) ? 10 : Math.min(Math.max(parseInt(columnes), 10), 30);

    creaTaulell();
    setMines();
    calculaAdjacents();
    console.log(casellesFaltants);
}
function creaTaulell() {
    let div = document.getElementById('taulell');
    let taula = "";
    taula = "<table>";
    for (let fila = 0; fila < files; fila++) {
        taula += "<tr>";
        for (let columna = 0; columna < columnes; columna++) {
            taula += `<td style="height: 20px; width: 20px; background-image: url('img/fons20px.jpg');" data-mina="false" onclick="obreCasella(${fila}, ${columna})" id="${fila}-${columna}" data-num-mines=0 data-obert="false"></td>`;
        }
        taula += "</tr>";
    }
    taula += "</table>";
    div.innerHTML = taula;
}
function obreCasella(fila, columna) {
    console.log(casellesFaltants);
    let casella = document.getElementById(`${fila}-${columna}`);
    if (esMina(fila, columna)) {
        acabarPartida();
        setTimeout(function() {
            alert('Has mort');
        }, 1000);
    } else {
        let adjacent = Number(casella.dataset.numMines);
        obreCaselles(fila, columna, adjacent);
        if (casellesFaltants === 0) {
            acabarPartida();
            setTimeout(function() {
                alert('Has ganat');
            }, 1000);
        }
    }
}
function esMina(fila, columna) {
    let casella = document.getElementById(`${fila}-${columna}`);
    let mina = casella.getAttribute("data-mina");
    if (mina == "true") {
        return true;
    }
    return false;
}
function setMines() {
    let mines = (Math.round((files * columnes) * 0.17));
    casellesFaltants = Math.round(files * columnes) - mines;
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
            casella.onclick = null;
            if (casella.dataset.mina === "true") {
                casella.style.backgroundImage = "url('img/mina20px.jpg')";
            }
        }
    }
}
function calculaAdjacents() {
    const posicioMina = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1] ,          [0, 1],
        [1, -1] , [1, 0],  [1, 1]
    ];
    for (let fila = 0; fila < files; fila++) {
        for (let columna = 0; columna < columnes; columna++) {
             let casella = document.getElementById(`${fila}-${columna}`);
            if (casella.dataset.mina !== "true") {
                let mines = 0;
                for (let i = 0; i < posicioMina.length; i++) {
                    let filaAdjacent = fila + posicioMina[i][0];
                    let columnaAdjacent = columna + posicioMina[i][1];
                    if (filaAdjacent >= 0 && filaAdjacent < files && columnaAdjacent >= 0 && columnaAdjacent < columnes) {
                        let casellaAdjacent = document.getElementById(`${filaAdjacent}-${columnaAdjacent}`);
                        if (casellaAdjacent.dataset.mina === "true") {
                            mines++;
                        }
                    }
                }
                setMinesAdjacents(fila, columna, mines);
            }
        }
    }
}
function setMinesAdjacents(fila, columna, numAdjacent) {
    let casella = document.getElementById(`${fila}-${columna}`)
    casella.dataset.numMines = numAdjacent;
}

function obreCaselles(fila, columna, numAdjacent) {
    casellesFaltants--;
    let casella = document.getElementById(`${fila}-${columna}`);
    casella.style.backgroundImage = "";
    casella.textContent = casella.dataset.numMines;
    casella.dataset.numMines = numAdjacent.toString();
    casella.dataset.obert = "true";
    if (numAdjacent === 0) {
        obreCasellaAdjacent(fila, columna);
    }
}

function obreCasellaAdjacent(fila, columna) {
    const posicioMina = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1] ,          [0, 1],
        [1, -1] , [1, 0],  [1, 1]
    ];
    for (let i = 0; i < posicioMina.length; i++) {
        let filaAdjacent = fila + posicioMina[i][0];
        let columnaAdjacent = columna + posicioMina[i][1];
        if (filaAdjacent >= 0 && filaAdjacent < files && columnaAdjacent >= 0 && columnaAdjacent < columnes) {
            let casellaAdjacent = document.getElementById(`${filaAdjacent}-${columnaAdjacent}`);
            if (casellaAdjacent.dataset.mina !== "true" && casellaAdjacent.dataset.obert !== "true") {
                casellaAdjacent.style.backgroundImage = "";
                casellaAdjacent.textContent = casellaAdjacent.dataset.numMines;
                casellaAdjacent.dataset.obert = "true";
                casellesFaltants--;
                if (casellaAdjacent.dataset.numMines === "0") {
                    obreCasellaAdjacent(filaAdjacent, columnaAdjacent);
                }
            }
        }
    }
}