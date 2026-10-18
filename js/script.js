// Elementos de la página que el script necesita leer o modificar
const frutasContainer = document.querySelector("#frutas-container"); // donde se muestran las tarjetas
const inputBusqueda = document.querySelector("#input-busqueda");     // caja de texto del buscador

// Dirección de la API de One Piece que entrega la lista de frutas
const apiURL = "https://api.api-onepiece.com/v2/fruits/en";

// Lista completa de frutas obtenida de la API. Se guarda para poder filtrar sin volver a consultar la API en cada búsqueda.
let todasLasFrutas = [];

// Pide a la API de One Piece la lista de frutas y la devuelve como datos de JavaScript.
// Es async porque la respuesta tarda en llegar desde internet.
async function getFrutas() {
    const res = await fetch(apiURL);
    //Si la respuesta no fue exitosa, (El ! significa “no”), lanza un error con el mensaje "Error al consultar la API".
    if (!res.ok) {
        throw new Error("Error al consultar la API");
    }
    return await res.json();
}

// Dibuja en pantalla una tarjeta por cada fruta de la lista recibida.
// Se usa tanto para la lista completa como para los resultados filtrados.
function mostrarFrutas(listaFrutas) {
    // Si no hay resultados, muestra un aviso y termina.
    if (listaFrutas.length === 0) {
        frutasContainer.innerHTML = `<p class="text-center text-muted">No se encontraron frutas.</p>`;
        return;
    }
    // Arma el HTML de una tarjeta Bootstrap por cada fruta
    let template = "";
    for (const fruta of listaFrutas) {
        template += `
            <div class="col-md-3">
                <article class="card p-3 h-100 text-center">
                    <img src="${fruta.filename}" alt="Imagen de la fruta ${fruta.name}" width="80" height="80" class="mx-auto object-fit-contain">
                    <div class="card-body p-2">
                        <h5 class="card-title fs-6">${fruta.name}</h5>
                        <p class="card-text small text-muted">${fruta.description || ""}</p>
                        <span class="badge bg-secondary">${fruta.type}</span>
                    </div>
                </article>
            </div>`;
    }
    // Inserta todas las tarjetas en el contenedor de la página
    frutasContainer.innerHTML = template;
}

// Se ejecuta al abrir la página: pide las frutas a la API, descarta las que
// no tienen imagen, las guarda en todasLasFrutas y las muestra en pantalla.
async function inicializar() {
    // Aviso mientras llegan los datos
    frutasContainer.innerHTML = `<p class="text-center">Cargando...</p>`;
    // Se intenta cargar y mostrar las frutas; si algo falla, se salta al catch
    try {
        const frutas = await getFrutas();
        // Solo se conservan las frutas que tienen imagen
        todasLasFrutas = frutas.filter(fruta => fruta.filename);
        mostrarFrutas(todasLasFrutas);
    }
    // Si falla la carga, se avisa al usuario y el detalle técnico queda en la consola.
    catch (error) {
        frutasContainer.innerHTML = `<p class="text-center text-danger">No se pudieron cargar las frutas. Intenta nuevamente.</p>`;
        console.error(error);
    }
}

// Filtra todasLasFrutas por nombre según el texto del buscador
// y vuelve a mostrar solo las que coinciden.
function filtrarFrutas() {
    // Texto buscado en minúsculas y sin espacios sobrantes
    const texto = inputBusqueda.value.toLowerCase().trim();
    // Las frutas cuyo nombre contiene el texto
    const filtradas = todasLasFrutas.filter(fruta => fruta.name.toLowerCase().includes(texto));
    // Se vuelven a dibujar solo las filtradas
    mostrarFrutas(filtradas);
}

// Filtra las frutas en vivo, cada vez que cambia el texto del buscador
inputBusqueda.addEventListener("input", filtrarFrutas);
// Inicia la aplicación: carga y muestra las frutas al abrir la página
inicializar();