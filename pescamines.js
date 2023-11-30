//Variables globals perque ajuden a poder accedir per diferents funcions
let files = 0;
let columnes = 0;
let casellesFaltants = 0;
let mines = 0;
let temps = 0;
let intervalId;
//Una vegada el usuari presioni el boto de Iniciar Partida, li preguntarem per el numero de files i columnes
//Aquest calcula que el interval sigui entre 10 o 30, i si es buit (NaN) sera sempre 10.
//Despres comencara un interval, aixo fa que el timer funcioni, i el padStart fa que sigui de 3 de llargada
//en cas de que el temps sigui 999, es para. Despres comencara la creacio de taller i crear les mines
// Tambe crea el contador de mines i l'assignar el numero de mines. Al final calcula els adjacents.
function iniciarPartida() {
    files = parseInt(prompt("Insereix files"));
    columnes = parseInt(prompt("Insereix columnes"));
    files = isNaN(files) ? 10 : Math.min(Math.max(parseInt(files), 10), 30);
    columnes = isNaN(columnes) ? 10 : Math.min(Math.max(parseInt(columnes), 10), 30);
    clearInterval(intervalId);
    temps = 0;
    var tempsString = String(temps).padStart(3, '0');
    document.getElementById('temps').textContent = tempsString;
    intervalId = setInterval(function() {
    temps++;
    var tempsString = String(temps).padStart(3, '0');
    document.getElementById('temps').textContent = tempsString;
    if (temps >= 999) {
        clearInterval(intervalId);
    }
    }, 1000);
    creaTaulell();
    setMines();
    let contadorMines = document.getElementById('mines');
    contadorMines.textContent = mines;
    calculaAdjacents();
}
//Aquesta funcio agafa el div amb el id taulell on li afegeig una taula amb el numero de files i columnes
//assignades per el usuari. Aquestes caselles tenen diferents informacions.
function creaTaulell() {
    let div = document.getElementById('taulell');
    let taula = "";
    taula = "<table id='buscamines'>";
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
//Quan l'usuari clica una de les caselles/table data, comprovara si es una mina, en cas de ser-ho, acabara 
//la partida i ens mostrara un alert, en cas de no, agafa el numero de mines adjacents i truca la
//funcio de obre caselles. Si el numero de caselles faltants es 0 acaba la partida i ens mostra un alert 
function obreCasella(fila, columna) {
    let casella = document.getElementById(`${fila}-${columna}`);
    if (esMina(fila, columna)) {
        acabarPartida();
        setTimeout(function() {
            alert('Has mort');
        }, 1000);
    } else {
        let adjacent = Number(casella.dataset.numMines);
        obreCaselles(fila, columna, adjacent);
        if (casellesFaltants < 0) {
            acabarPartida();
            setTimeout(function() {
                alert('Has ganat');
            }, 1000);
        }
    }
}
//Aquesta funcio mira si la informacio data-mina es true o false, i el retorna.
function esMina(fila, columna) {
    let casella = document.getElementById(`${fila}-${columna}`);
    let mina = casella.getAttribute("data-mina");
    if (mina == "true") {
        return true;
    }
    return false;
}
//Aquesta funcio calcula el 17% de mines de totes les caselles i ens diu les caselles faltants (una resta)
//Despres fa un for en el que calcula un numero aleatori i l'hi asigna una mina.
//En cas de que ja sigui una mina, restara una vegada la variable i del for per a que sigui sent un 17%
function setMines() {
    mines = (Math.round((files * columnes) * 0.17));
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
//En cas de que la partida acabi, anira per totes les caselles on agafara cada casella i fara
//que la seva funcio onclick sigui null/vuit per a que no es pugui seguir jugant
//ademes de mostrar totes les mines i en cas de que la casella sigui null mostrara la opacitat en 90%,
//ademes de pausar el interval
function acabarPartida() {
    for (let fila = 0; fila < files; fila++) {
        for (let columna = 0; columna < columnes; columna++) {
            let casella = document.getElementById(`${fila}-${columna}`);
            casella.onclick = null;
            if (casella.dataset.mina === "true") {
                casella.style.backgroundImage = "url('img/mina20px.jpg')";
            }
            if (!casella.onclick) {
                casella.style.opacity = '0.90';
            }
        }
    }
    clearInterval(intervalId);
}
//La funcio que calcula els adjacents agafar totes les posicions possibles que estan.
//Despres va per cada una de les caselles i mira si no hi ha una mina, en cas d'aixo,
//anira per cadascuna de les posicions de les mines possibles, i en cas de que sigui un rang real
//mirara si el dataset de la mina es true, en cas d'aixo suma mines. Una vegada acaba el for,
//posa les mines adjacents
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
//Aquesta funcio agafar un element amb la fila i columna determinada i fa que el data numMines es
//igual a la variable numAdjacent
function setMinesAdjacents(fila, columna, numAdjacent) {
    let casella = document.getElementById(`${fila}-${columna}`)
    casella.dataset.numMines = numAdjacent;
}
//Aquesta funcio fa que el numero de caselles baixi, agafa una casella amb la fila i columna
//determinada i posa la seva imatge buida, el contingut, en cas de que no sigui 0 sera el numero de mines
//o estara buida.
//Despres fa que el seu numero de mines sigui el numeroadjacent i fara que la seva propietat obert sigui true
//En cas de que el numero adjacent sigui 0, trucara una funcio recursiva, i en cas de que no ho sigui 
//trucara la funcio colorLletra.
function obreCaselles(fila, columna, numAdjacent) {
    casellesFaltants--;
    let casella = document.getElementById(`${fila}-${columna}`);
    casella.style.backgroundImage = "";
    casella.textContent = casella.dataset.numMines != 0 ? casella.dataset.numMines : '';
    casella.dataset.numMines = numAdjacent.toString();
    casella.dataset.obert = "true";
    if (numAdjacent === 0) {
        obreCasellaAdjacent(fila, columna);
    }
    colorLletra(fila, columna);
}
//Aquesta funcio te les posicions cercanes a la posicio de la mina original.
//Despres, fara un for en el que mirara les posicions que estiguin cercanes
//Comprovara que no sigui una mina i no sigui oberta
//i el que fara sera canviar la imatge, mira si no es un 0, posar el numero, i en cas de que ho sigui
//mostrara cap numero, i posara el dataset obert a true.
//Tambe disminuira el numero de caselles faltants per 1 i en cas de que sigui 0 el numero de mines,
//es trucara la mateixa funcio de manera recursiva. En cas de que no, trucara colorLletra.
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
                casellaAdjacent.textContent = casellaAdjacent.dataset.numMines != 0 ? casellaAdjacent.dataset.numMines : '';
                casellaAdjacent.dataset.obert = "true";
                casellesFaltants--;
                if (casellaAdjacent.dataset.numMines === "0") {
                    obreCasellaAdjacent(filaAdjacent, columnaAdjacent);
                }
                colorLletra(filaAdjacent, columnaAdjacent);
            }
        }
    }
}
//Aquest es un switch que fa que depenent del numero de la casella, sera un color o un alte,
//agafat del pescamines original de Windows XP
function colorLletra(fila, columna) {
    let casella = document.getElementById(`${fila}-${columna}`);
    switch (casella.textContent) {
        case '1':
            casella.style.color = 'blue';
            break;
        case '2':
            casella.style.color = 'green';
            break;
        case '3':
            casella.style.color = 'red';
            break;
        case '4':
            casella.style.color = 'purple';
            break;
        case '5':
            casella.style.color = 'yellow';
            break;
        case '6':
            casella.style.color = 'teal';
            break;
        case '7':
            casella.style.color = 'darkgrey';
            break;
        case '8':
            casella.style.color = 'lightgrey';
            break;
    }
}