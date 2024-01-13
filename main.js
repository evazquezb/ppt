'use strict';
//creo referencia a elementos del dom
const userButtons = document.querySelectorAll('#userSection>button');
const pcButtons = document.querySelectorAll('#pcSection>button');
const loader = document.querySelector('.loader');
//creo objetos necesarios para juego
const elementos = [{name:"piedra"},{name:"papel"},{name:"tijeras"}];
//le indico a la propiedad derecha de los objetos
//que elemento lo vence
elementos[0].derecha = elementos[1];
elementos[1].derecha = elementos[2];
elementos[2].derecha = elementos[0];
//referencias a los diferentes botones que voy a "encender" o "apagar"
//a la hora de animar o elegir opción
let userBeforeButton,pcBeforeButton;
///////////////
//FUNCIONES////
///////////////
//-para "encender boton"
const turnOffButton = button =>  {
    button.style.backgroundColor="#fff0";
    button.style.borderColor = "#0000";
};
//-para "apagar boton"
const turnOnButton  = button =>  {
    button.style.backgroundColor="#0f08";
    button.style.borderColor = "#000";
};
//-para devolver numero de opcion del boton contenido en
//su atributo data-option en el html
const getUserChoice = function(){
    //apagar boton encendido anteriormente
    turnOffButton(userBeforeButton??userButtons[0]);
    userBeforeButton = this;
    //encender el boton actual
    turnOnButton(this);
    //devolver su data-option
    return Number(this.dataset.option);
   } 

//-para obtener un numero random entre 0,1,2
const getPcChoice = ()=>parseInt(Math.random()*3);

//-para jugar y determinar quien gana
const play = function(){
    //obtenemos el elemento elegido por usuario y computadora
    //usando de indice el numero devuelto por las funciones
    //getuserchoice y getpcchoice
    const user = elementos[getUserChoice.call(this)];
    const pc = elementos[getPcChoice()];
    //hacemos visible un div transaparente que impide
    //elegir otro elemento
    loader.style.display="flex";
    //si no hay un boton previo encendido asignamos el primero
    pcBeforeButton = pcBeforeButton ?? pcButtons[0];
    //determinamos quien ganó en base a la propiedad derecha
    //del elemento elegido por usuario
    const msg = user===pc?"Empataste":pc===user.derecha?"Perdiste":"~Ganaste ~";
    //hacemos animacion antes de mostrar quien gano
    animar(elementos.indexOf(pc),msg);
}
//-para hacer animación y después mostrar quien ganó
const animar = function(pcChoice,msg){ 
    let i = parseInt(Math.random()*3), stop = 0;
    const interval = setInterval(()=>{
        stop++;
        turnOffButton(pcBeforeButton);
        i = i<2 ? i+1 : 0;
        pcBeforeButton = pcButtons[i];
        turnOnButton(pcButtons[i]);
        if(stop > 9) {
            clearInterval(interval);
            const btnPc = pcButtons[pcChoice];
            if(pcBeforeButton!==btnPc) 
                turnOffButton(pcBeforeButton) ;
            loader.innerHTML += `<br> <div class='winner'>${msg}</div>`;
            turnOnButton(pcButtons[pcChoice]);
            setTimeout(()=>{
                //desaparecemos el div transparente que impedia seleccionar otra opcion
                //para poder jugar otra vez.
                loader.style.display="none";
                loader.innerHTML="";
            },1500);
        }
    },100);
}
//agregar manejadores de eventos a botones -opciones de usuario
userButtons.forEach(button=>button.addEventListener('click',play.bind(button)));

