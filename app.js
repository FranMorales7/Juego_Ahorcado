/**Variables necesarias */
let PalabrasURL=[];
let puntos = 0;
const aciertoAud = new Audio("./audio/efecto_acierto.mp3");
const falloAud = new Audio("./audio/efecto_error.mp3");
const ganadorAud = new Audio("./audio/efecto_ganador.mp3");
const perdedorAud = new Audio("./audio/efecto_perdedor.mp3");

/**REFERENCIAS AL HTML */
let intentosRestantes = document.getElementById('intentos');
let palabrasIncorrectas = document.getElementById('letrasPulsadas');
let mensaje = document.getElementById('mensaje');
let enviar = document.getElementById('enviarLetra');
let enviarNivel = document.getElementById('enviarNivel');
let divJuego = document.getElementById('juego');
let nivelUser = document.querySelector('#nivel');//obtenemos el nivel elegido por el usuario
let divNivel = document.querySelector('#cuestionario');
let divPuntuacion = document.querySelector('#puntuacion');

/**************************************************************************************************************** */
// Función para recibir los datos de la url
fetch('http://localhost:3000/palabras')
    //Se pasan los datos a formato json
    .then(resp => resp.json())
    //Los datos se manipulan segun la funcion descrita mas abajo
    .then(palabras => {
        //Se agregan las palabras a un array
        obtenerPalabras(palabras); 
        //obtenemos una palabra al azar del array
        let index=Math.floor(Math.random()*PalabrasURL.length);
        let palabraAdivinar = PalabrasURL[index];
        console.log('Palabra oculta: ',palabraAdivinar);
        //se crea la partida con la palabra aleatoria anterior
        juego = new Ahorcado(palabraAdivinar, 10);
    })
    //En caso de fallo, se mostrara un mensaje indicando el error 
    .catch(error => console.error('Error:', error));

// Función para obtener las palabras de la url
function obtenerPalabras(palabras){
    //se recorre cada palabra y se agrega al array PalabrasURL
    for(let palabra of palabras){
        PalabrasURL.push(palabra.palabra);
    };
};


/************************************************************************************************************************************************ */
/**FUNCIONES A EMPLEAR */
function dibujarAhorcado(intento) {
    const intentos = 10;
    const canvas = document.querySelector("#ahorcadoCanvas");
    const ctx = canvas.getContext('2d');

    // Establece colores constantes y estilos
    const estructuraColor = '#8B4513'; // color marrón para la estructura
    const cuerdaColor = '#000000'; // color negro para la cuerda y el cuerpo
    const cuerpoColor = '#000000';

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Base de la estructura
    if (intento <= intentos - 1) {
        ctx.fillStyle = estructuraColor;
        ctx.fillRect(10, 190, 180, 10); // base
    }

    // Poste vertical
    if (intento <= intentos - 2) {
        ctx.fillStyle = estructuraColor;
        ctx.fillRect(30, 30, 10, 160); // poste vertical
    }

    // Barra horizontal
    if (intento <= intentos - 3) {
        ctx.fillStyle = estructuraColor;
        ctx.fillRect(30, 30, 120, 10); // barra horizontal
    }

    // Cuerda
    if (intento <= intentos - 4) {
        ctx.fillStyle = cuerdaColor;
        ctx.fillRect(147, 40, 3, 30); // cuerda
    }

    // Cabeza
    if (intento <= intentos - 5) {
        ctx.beginPath();
        ctx.arc(147, 85, 17, 0, 2 * Math.PI); // cabeza
        ctx.fillStyle = '#F0D9B5'; // color piel para relleno de cabeza
        ctx.fill();
        ctx.strokeStyle = cuerdaColor;
        ctx.stroke();
    }

    // Cuerpo
    if (intento <= intentos - 6) {
        ctx.fillStyle = cuerpoColor;
        ctx.fillRect(145, 102, 3, 50); // cuerpo
    }

    // Brazo izquierdo
    if (intento <= intentos - 7) {
        ctx.beginPath();
        ctx.moveTo(147, 110); // inicio del brazo izquierdo
        ctx.lineTo(115, 140); // fin del brazo izquierdo
        ctx.strokeStyle = cuerpoColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Brazo derecho
    if (intento <= intentos - 8) {
        ctx.beginPath();
        ctx.moveTo(147, 110); // inicio del brazo derecho
        ctx.lineTo(180, 140); // fin del brazo derecho
        ctx.stroke();
    }

    // Pierna izquierda
    if (intento <= intentos - 9) {
        ctx.beginPath();
        ctx.moveTo(147, 150); // inicio de la pierna izquierda
        ctx.lineTo(120, 180); // fin de la pierna izquierda
        ctx.stroke();
    }

    // Pierna derecha
    if (intento <= intentos - 10) {
        ctx.beginPath();
        ctx.moveTo(147, 150); // inicio de la pierna derecha
        ctx.lineTo(175, 180); // fin de la pierna derecha
        ctx.stroke();
    }
}

/**CLASES */
class Ahorcado{
    constructor(palabra, intentos){
        this.palabra = palabra;//palabra a adivinar
        this.intentos = intentos;//cantidad de intentos disponibles
        this.letrasAdivinadas=[];//array con las letras que el usuario va adivinando
        this.letrasIncorrectas=[];//array con las letras incorrectas que el usuario va empleando
        this.estado="jugando";//se inicializa el estado a 'jugando'
    }

    /**METODOS DE LA CLASE */
       //Metodo que retorna la plabra actual con guiones y letras adivinadas
    obtenerPalabraMostrada(){
        let palabraMostrada = '';
        for(let letra of this.palabra){
            if(this.letrasAdivinadas.includes(letra)){
                palabraMostrada += letra; //muestra las palabras correctas
            }else{
                palabraMostrada += ' _ ';//Muestra guiones para letras no adivinadas
            }
        }
        return palabraMostrada.trim();//Muestra las palabras elimando los espacios
    };

    //Metodo para actualizar las palabras que se muestren
    actualizarPalabraMostrada(){
        document.getElementById('palabra').textContent = this.obtenerPalabraMostrada();
    }

    //Metodo para verificar si la palabra introducida es correcta o no

    verificarLetra(letra) {
        if (this.estado !== 'jugando' || this.letrasAdivinadas.includes(letra) || this.letrasIncorrectas.includes(letra)) {
            return; // No hacer nada si el juego ha terminado o la letra ya fue ingresada
        }

        //Si se escribe un número o simbolo saltara un mensaje de error
        if (!isNaN(letra)){alert('¡Sólo se aceptan letras!')};
        if(letra === ',' || letra ==='.' || letra ==='-' || letra === '<' || letra ==='ç' || letra ==='º'){alert('¡Sólo se aceptan letras!')};

        //Se quita el acento a la letra
        const letraSinAcento = this.quitarAcento(letra);

        //Se comprueba si la letra se incluye en la palabra oculta o no
        let acierto = false;
        for (let letraPalabra of this.palabra) {
            if (this.quitarAcento(letraPalabra) === letraSinAcento) {
                acierto = true;
                this.letrasAdivinadas.push(letraPalabra); // Añadir la letra original (con acento si corresponde)
            }
        }

        //En caso de que si...
        if (acierto) {
            aciertoAud.play();
            puntos += 10; // suma 10 puntos por letra correcta
            divPuntuacion.innerText = puntos; // actualiza la puntuación en el HTML
        } else {
            //En caso contrario...
            falloAud.play();
            this.letrasIncorrectas.push(letra);
            this.intentos--; // reduce los intentos
            puntos -= 5; // resta 5 puntos por letra incorrecta
            puntos = Math.max(0, puntos); // Evita puntaje negativo al perder
            divPuntuacion.innerText = puntos;
            dibujarAhorcado(this.intentos); // actualiza el dibujo
        }

        this.actualizarEstado();
    }

    actualizarEstado() {
        if (this.intentos === 0) {
            iniciar.style.display = 'block';
            this.estado = 'perdido';
            perdedorAud.play();
            mensaje.innerHTML = "¡Vaya pena! Has fallado. La palabra secreta era: <strong>" + this.palabra + "</strong>";
        } else if (this.obtenerPalabraMostrada().trim() === this.palabra) {
            iniciar.style.display = 'block';
            this.estado = 'ganado';
            ganadorAud.play();
            mensaje.innerText = "¡Enhorabuena! Has acertado la palabra secreta.";
        }

        intentosRestantes.textContent = this.intentos;
        palabrasIncorrectas.textContent = this.letrasIncorrectas.join(" - ");
    }

    quitarAcento(letra) {
        const acentos = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u' };
        return acentos[letra] || letra; // Si la letra tiene acento, devuelve sin acento; de lo contrario, retorna la letra original
    }
}

//crear partida o instanciar clase
let iniciar = document.getElementById('empezar');

function empezar() {
    //Se reinicia todos los valores a 0
    divNivel.style.display = 'none';
    divJuego.style.display = 'block';
    iniciar.style.display='none';//el boton de inicio desaparece
    divPuntuacion.innerText = 0;
    puntos = 0;
    palabrasIncorrectas.textContent = '';
    juego.letrasAdivinadas=[];//se resetean las letras adivinas e incorrectas
    juego.letrasIncorrectas=[];
    juego.intentos = intentos(nivelUser.value);
    juego.estado='jugando';//el estado pasa a jugando
    intentosRestantes.textContent = juego.intentos;//se resetean los intentos del html
    juego.actualizarPalabraMostrada();//se actualiza la palabra para mostrar los guiones
    mensaje.textContent='';//no habra mensaje aun
    dibujarAhorcado(juego.intentos);//se resetea el dibujo del ahorcado
};
/******************************************************************************************************* */
/**EVENTOS */
//Boton que procesa la letra ingresada
enviar.addEventListener('click', () =>{
    const letra = document.getElementById('letra').value.toLowerCase();//Obtener la palabra introducida en minuscula
    juego.verificarLetra(letra);
    juego.actualizarPalabraMostrada();
    juego.actualizarEstado();
    document.getElementById('letra').value='';
    document.getElementById('letra').focus();
});

//Boton que inicia la partida
iniciar.addEventListener('click', () =>{
    
    // Función para recibir los datos de la url
    fetch('http://localhost:3000/palabras')
    //Se pasan los datos a formato json
    .then(resp => resp.json())
    //Los datos se manipulan segun la funcion descrita mas abajo
    .then(palabras => {
        //Se agregan las palabras a un array
        obtenerPalabras(palabras); 
        //obtenemos una palabra al azar del array
        let index=Math.floor(Math.random()*PalabrasURL.length);
        let palabraAdivinar = PalabrasURL[index];
        console.log('Palabra: ',palabraAdivinar);
        //se crea la partida con la palabra aleatoria anterior
        juego = new Ahorcado(palabraAdivinar, 10);
    })
    //En caso de fallo, se mostrara un mensaje indicando el error 
    .catch(error => console.error('Error:', error));
    
    
    iniciar.style.display='none';//el boton de inicio desaparece
    divJuego.style.display = 'none';
    divNivel.style.display = 'block';
    });

//Cuando se haga click en el boton enviar...
enviarNivel.addEventListener("click", () =>{
    empezar();
});

//Preguntar la dificultad con la que jugar
function intentos(nivelUser){
    if(nivelUser === 'F'){
        return 10;
    } else if(nivelUser === 'I'){
        return 6;
    } else if(nivelUser === 'D'){
        return 3;
    } else {
        return;
    }
};