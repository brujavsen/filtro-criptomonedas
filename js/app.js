const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', ()=> {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptoSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

async function consultarCriptomonedas() {

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;
        criptoSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    //Validar
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    //Consultar la API con los resultados
    consultarAPI();
}

function mostrarAlerta(msg) {
    const existeError = document.querySelector('.error');

    if(!existeError) {
        const alerta = document.createElement('P');
        alerta.classList.add('error');
        alerta.textContent = msg;
        formulario.appendChild(alerta);
        setTimeout(()=> {
            alerta.remove();
        }, 3000);
    }
}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    
    try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    } catch (error) {
        console.log(error);
    }
}

function mostrarCotizacionHTML(cotizacion) {
    
    limpiarHTML(resultado);

    const { PRICE,  HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const infoDiv = document.createElement('DIV');
    infoDiv.innerHTML = `
        <p class="precio">El Precio es: <span>${PRICE}</span></p>
        <p>Precio más alto del día: <span>${HIGHDAY}</span></p>
        <p>Precio más bajo del día: <span>${LOWDAY}</span></p>
        <p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>
        <p>Última Actualización: <span>${LASTUPDATE}</span></p>
    `;
    

    resultado.appendChild(infoDiv);
}

function limpiarHTML(selector) {
    while(selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML(resultado);

    const spinner = document.createElement('div');
    spinner.classList.add('sk-cube-grid');

    spinner.innerHTML = `
        <div class="sk-cube sk-cube1"></div>
        <div class="sk-cube sk-cube2"></div>
        <div class="sk-cube sk-cube3"></div>
        <div class="sk-cube sk-cube4"></div>
        <div class="sk-cube sk-cube5"></div>
        <div class="sk-cube sk-cube6"></div>
        <div class="sk-cube sk-cube7"></div>
        <div class="sk-cube sk-cube8"></div>
        <div class="sk-cube sk-cube9"></div>
    `;

    resultado.appendChild(spinner);
}

// Mouse blur effect
const blob = document.querySelector("#blob");

document.body.onpointermove = e => {
    const { clientX, clientY } = e;

    blob.style.left = `${clientX}px`;
    blob.style.top = `${clientY}px`;

}