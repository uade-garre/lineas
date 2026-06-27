// Script del ramal: toma los datos del formulario y muestra una respuesta de horarios.
const form = document.getElementById("consulta-form");
const mensaje = document.getElementById("mensaje");

// Nombres legibles de las estaciones usadas en los mensajes al usuario.
const estaciones = {
    constitucion: "Plaza Constitución",
    temperley: "Temperley",
    bosques: "Bosques",
    gutierrez: "Juan María Gutiérrez"
};

// Datos resumidos de horarios por tipo de dia y por tramo consultado.
const horarios = {
    habiles: {
        nombre: "lunes a viernes",
        "constitucion-bosques": "Plaza Constitución → Bosques: primer tren 04:19, último 22:35. Frecuencia aproximada: 12 a 30 minutos.",
        "bosques-constitucion": "Bosques → Plaza Constitución: primer tren 04:25, último 22:34. Frecuencia aproximada: 12 a 30 minutos.",
        "bosques-gutierrez": "Bosques → Gutiérrez: primer tren 05:06, último 20:08. Frecuencia aproximada: 60 minutos.",
        "gutierrez-bosques": "Gutiérrez → Bosques: primer tren 06:38, último 20:38. Frecuencia aproximada: 60 minutos."
    },
    sabado: {
        nombre: "sábados",
        "constitucion-bosques": "Plaza Constitución → Bosques: servicio durante el día con frecuencia variable. Revisá la tabla completa para horarios intermedios.",
        "bosques-constitucion": "Bosques → Plaza Constitución: servicio durante el día con frecuencia variable. Revisá la tabla completa para horarios intermedios.",
        "bosques-gutierrez": "Bosques → Gutiérrez: primer tren 07:07, último 21:13. Frecuencia aproximada: 60 minutos.",
        "gutierrez-bosques": "Gutiérrez → Bosques: primer tren 07:37, último 21:42. Frecuencia aproximada: 60 minutos."
    },
    domingo: {
        nombre: "domingos y feriados",
        "constitucion-bosques": "Plaza Constitución → Bosques: primer tren 05:00, último 21:38. Frecuencia aproximada: 26 a 60 minutos.",
        "bosques-constitucion": "Bosques → Plaza Constitución: primer tren 05:45, último 21:06. Frecuencia aproximada: 26 a 60 minutos.",
        "bosques-gutierrez": "Bosques → Gutiérrez: primer tren 06:30, último 22:34. Frecuencia aproximada: 60 minutos.",
        "gutierrez-bosques": "Gutiérrez → Bosques: primer tren 07:00, último 21:54. Frecuencia aproximada: 60 minutos."
    }
};

// Devuelve el mensaje correcto segun origen, destino y dia elegido.
function resolverConsulta(origen, destino, dia) {
    const datosDia = horarios[dia];
    const rutaDirecta = `${origen}-${destino}`;

    if (origen === destino) {
        return {
            texto: "Elegí estaciones diferentes para consultar un viaje."
        };
    }

    if (datosDia[rutaDirecta]) {
        return {
            texto: datosDia[rutaDirecta]
        };
    }

    if (origen === "constitucion" && destino === "gutierrez") {
        return {
            texto: `${datosDia["constitucion-bosques"]} En Bosques se continúa hacia Gutiérrez: ${datosDia["bosques-gutierrez"]}`,
            enlace: "Ver tabla completa"
        };
    }

    if (origen === "gutierrez" && destino === "constitucion") {
        return {
            texto: `${datosDia["gutierrez-bosques"]} En Bosques se combina hacia Constitución: ${datosDia["bosques-constitucion"]}`,
            enlace: "Ver tabla completa"
        };
    }

    if (origen === "temperley" && (destino === "bosques" || destino === "gutierrez")) {
        return {
            texto: `${estaciones[origen]} → ${estaciones[destino]} funciona por el ramal vía Temperley. Para ${datosDia.nombre}, usá como referencia la frecuencia del tramo Constitución - Bosques y, si seguís a Gutiérrez, la combinación desde Bosques.`,
            enlace: "Ver horarios"
        };
    }

    if ((origen === "bosques" || origen === "gutierrez") && destino === "temperley") {
        return {
            texto: `${estaciones[origen]} → Temperley requiere viajar por el ramal hacia Constitución. Para ${datosDia.nombre}, tomá como referencia la frecuencia Bosques - Constitución.`,
            enlace: "Ver horarios"
        };
    }

    return {
        texto: `${estaciones[origen]} → ${estaciones[destino]}: recorrido disponible dentro del corredor. Consultá la sección Horarios para ver el cuadro resumido.`,
        enlace: "Ver horarios"
    };
}

// Escribe el resultado en pantalla y agrega un enlace cuando corresponde.
function mostrarResultado(resultado) {
    mensaje.textContent = resultado.texto;

    if (!resultado.enlace) {
        return;
    }

    const enlace = document.createElement("a");
    enlace.href = "horarios.html";
    enlace.className = "mensaje-link";
    enlace.textContent = resultado.enlace;

    mensaje.appendChild(enlace);
}

// Escucha el envio del formulario sin recargar la pagina.
if (form && mensaje) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const datos = new FormData(form);
        const origen = datos.get("origen");
        const destino = datos.get("destino");
        const dia = datos.get("dia");

        mostrarResultado(resolverConsulta(origen, destino, dia));
    });
}
