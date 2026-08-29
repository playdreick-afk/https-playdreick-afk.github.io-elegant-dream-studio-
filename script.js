let reserva = {
nombre:"",
telefono:"",
servicio:"",
precio:"",
fecha:"",
hora:"",
duracion:30
};

/* CAMBIAR PASOS */

function mostrarPaso(numero){

document.querySelectorAll(".slide").forEach(slide=>{
slide.classList.remove("activa");
});

document
.getElementById("paso"+numero)
.classList.add("activa");

if(numero === 5){
cargarHorarios();
}

if(numero === 8){
mostrarReservas();
}

}

/* VALIDAR CLIENTE */

function validarCliente(){

const nombre =
document.getElementById("nombre");

const telefono =
document.getElementById("telefono");

const error =
document.getElementById("errorTelefono");

error.textContent = "";

nombre.classList.remove("errorInput");
telefono.classList.remove("errorInput");

if(nombre.value.trim().split(" ").length < 2){

nombre.classList.add("errorInput");

error.textContent =
"Ingrese nombre y apellido.";

return;

}

if(!/^[0-9]{8}$/.test(telefono.value)){

telefono.classList.add("errorInput");

error.textContent =
"Ingrese un número válido de 8 dígitos.";

return;

}

reserva.nombre =
nombre.value.trim();

reserva.telefono =
telefono.value.trim();

mostrarPaso(3);

}

/* SELECCIONAR SERVICIO */

function seleccionarServicio(
nombre,
precio,
duracion
){

reserva.servicio = nombre;
reserva.precio = precio;
reserva.duracion = duracion;

mostrarPaso(4);

}

/* HORARIOS */

function cargarHorarios(){

const horarios =
document.getElementById("horarios");

horarios.innerHTML = "";

const fecha =
document.getElementById("fecha").value;

const lista = [

"10:00 AM",
"10:30 AM",

"11:00 AM",
"11:30 AM",

"12:30 PM",

"1:00 PM",
"1:30 PM",

"2:00 PM",
"2:30 PM",

"3:00 PM",
"3:30 PM",

"4:00 PM",
"4:30 PM",

"5:00 PM",
"5:30 PM",

"6:00 PM",
"6:30 PM",

"7:00 PM",
"7:30 PM",

"8:00 PM",
"8:30 PM"

];

let reservas =
JSON.parse(
localStorage.getItem("reservas")
) || [];

let ocupados = [];

reservas.forEach(r=>{

if(r.fecha === fecha){

let inicio =
lista.indexOf(r.hora);

let bloques =
(r.duracion || 30) / 30;

for(let i=0;i<bloques;i++){

if(lista[inicio+i]){

ocupados.push(
lista[inicio+i]
);

}

}

}

});

lista.forEach(hora=>{

const div =
document.createElement("div");

div.className = "hora";

if(ocupados.includes(hora)){

div.classList.add("ocupada");

div.innerHTML =
hora + "<br>Ocupado";

horarios.appendChild(div);

return;

}

div.innerText = hora;

div.onclick = function(){

document
.querySelectorAll(".hora")
.forEach(h=>{

h.classList.remove(
"seleccionada"
);

});

div.classList.add(
"seleccionada"
);

if(fecha === ""){

alert(
"Selecciona una fecha primero."
);

mostrarPaso(4);

return;

}

reserva.fecha = fecha;
reserva.hora = hora;

mostrarResumen();

mostrarPaso(6);

};

horarios.appendChild(div);

});

}

/* RESUMEN */

function mostrarResumen(){

document.getElementById(
"resumen"
).innerHTML = `

<p><strong>Cliente:</strong>
${reserva.nombre}</p>

<p><strong>Teléfono:</strong>
${reserva.telefono}</p>

<p><strong>Servicio:</strong>
${reserva.servicio}</p>

<p><strong>Precio:</strong>
${reserva.precio}</p>

<p><strong>Fecha:</strong>
${reserva.fecha}</p>

<p><strong>Hora:</strong>
${reserva.hora}</p>

`;

}

/* CONFIRMAR CITA */

function confirmarReserva(){

let reservas =
JSON.parse(
localStorage.getItem("reservas")
) || [];

let existe =
reservas.find(r=>

r.fecha === reserva.fecha &&
r.hora === reserva.hora

);

if(existe){

alert(
"Este horario ya está ocupado."
);

mostrarPaso(5);

return;

}

reservas.push({
...reserva
});

localStorage.setItem(
"reservas",
JSON.stringify(reservas)
);

/* WHATSAPP */

const mensaje =

`Hola, tengo una nueva cita.%0A%0A` +

`Cliente: ${reserva.nombre}%0A` +

`Teléfono: ${reserva.telefono}%0A` +

`Servicio: ${reserva.servicio}%0A` +

`Fecha: ${reserva.fecha}%0A` +

`Hora: ${reserva.hora}`;

window.open(
`https://wa.me/50688833400?text=${mensaje}`,
"_blank"
);

mostrarPaso(7);

}

/* NUEVA RESERVA */

function nuevaReserva(){

reserva.servicio = "";
reserva.precio = "";
reserva.fecha = "";
reserva.hora = "";
reserva.duracion = 30;

mostrarPaso(3);

}

/* VER RESERVAS */

function verReservas(){

mostrarPaso(8);

}

/* MOSTRAR RESERVAS */

function mostrarReservas(){

const lista =
document.getElementById(
"listaReservas"
);

let reservas =
JSON.parse(
localStorage.getItem("reservas")
) || [];

if(reservas.length === 0){

lista.innerHTML =

`<div class="reserva">
No tienes citas reservadas.
</div>`;

return;

}

lista.innerHTML = "";

reservas.forEach(
(r,index)=>{

lista.innerHTML += `

<div class="reserva">

<p><strong>Cliente:</strong>
${r.nombre}</p>

<p><strong>Servicio:</strong>
${r.servicio}</p>

<p><strong>Fecha:</strong>
${r.fecha}</p>

<p><strong>Hora:</strong>
${r.hora}</p>

<button
class="cancelar"
onclick="cancelarReserva(${index})">

Cancelar cita

</button>

</div>

`;

});

}

/* CANCELAR */

function cancelarReserva(index){

let reservas =
JSON.parse(
localStorage.getItem("reservas")
) || [];

if(confirm(
"¿Desea cancelar esta cita?"
)){

reservas.splice(index,1);

localStorage.setItem(
"reservas",
JSON.stringify(reservas)
);

mostrarReservas();

}

}

/* AUTOCOMPLETAR */

window.onload = function(){

let reservas =
JSON.parse(
localStorage.getItem("reservas")
) || [];

if(reservas.length > 0){

document.getElementById(
"nombre"
).value =
reservas[0].nombre;

document.getElementById(
"telefono"
).value =
reservas[0].telefono;

}

};