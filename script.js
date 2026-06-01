// =============================================
// LISTA DE TAREAS - JavaScript
// Bootcamp Full Stack - Luis Orellana
// Usa localStorage para guardar las tareas
// =============================================

// --- Variables globales ---
let tareas = []; // Arreglo que guarda todas las tareas
let filtroActual = 'all'; // Filtro activo: 'all', 'pending', 'done'

// --- Elementos del DOM ---
const taskInput    = document.getElementById('task-input');
const taskList     = document.getElementById('task-list');
const emptyState   = document.getElementById('empty-state');
const counterText  = document.getElementById('counter-text');
const clearBtn     = document.getElementById('clear-btn');

// =============================================
// 1. CARGAR TAREAS al iniciar la página
// =============================================
function cargarTareasGuardadas() {
    // Intentamos leer del localStorage
    const guardadas = localStorage.getItem('mis-tareas');
    if (guardadas) {
        tareas = JSON.parse(guardadas); // Convertimos el texto JSON a un arreglo
    }
    renderizarTareas(); // Mostramos las tareas
}

// =============================================
// 2. GUARDAR TAREAS en localStorage
// =============================================
function guardarEnLocalStorage() {
    // Convertimos el arreglo a texto JSON y lo guardamos
    localStorage.setItem('mis-tareas', JSON.stringify(tareas));
}

// =============================================
// 3. AGREGAR una nueva tarea
// =============================================
function agregarTarea() {
    const texto = taskInput.value.trim(); // Eliminamos espacios al inicio y al final

    // Validamos que no esté vacío
    if (texto === '') {
        taskInput.focus();
        taskInput.style.borderColor = '#ef4444';
        setTimeout(() => {
            taskInput.style.borderColor = '';
        }, 800);
        return;
    }

    // Creamos el objeto de la nueva tarea
    const nuevaTarea = {
        id: Date.now(),         // ID único basado en el tiempo
        texto: texto,
        completada: false,
        fecha: new Date().toLocaleDateString('es-CL')
    };

    tareas.push(nuevaTarea);    // La agregamos al arreglo
    taskInput.value = '';       // Limpiamos el input
    taskInput.focus();

    guardarEnLocalStorage();    // Guardamos en localStorage
    renderizarTareas();         // Actualizamos la pantalla
}

// =============================================
// 4. MARCAR como completada / pendiente
// =============================================
function toggleTarea(id) {
    // Buscamos la tarea por su id y cambiamos su estado
    tareas = tareas.map(tarea => {
        if (tarea.id === id) {
            return { ...tarea, completada: !tarea.completada }; // Invertimos el estado
        }
        return tarea;
    });

    guardarEnLocalStorage();
    renderizarTareas();
}

// =============================================
// 5. ELIMINAR una tarea
// =============================================
function eliminarTarea(id) {
    // Filtramos el arreglo: dejamos todo excepto la tarea con ese id
    tareas = tareas.filter(tarea => tarea.id !== id);

    guardarEnLocalStorage();
    renderizarTareas();
}

// =============================================
// 6. LIMPIAR todas las completadas
// =============================================
function limpiarCompletadas() {
    tareas = tareas.filter(tarea => !tarea.completada);
    guardarEnLocalStorage();
    renderizarTareas();
}

// =============================================
// 7. FILTRAR tareas (todas / pendientes / completadas)
// =============================================
function filtrarTareas(filtro) {
    filtroActual = filtro;

    // Actualizar estilos de los botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('filter-' + filtro).classList.add('active');

    renderizarTareas();
}

// =============================================
// 8. RENDERIZAR (mostrar) las tareas en pantalla
// =============================================
function renderizarTareas() {
    // Filtrar según el filtro activo
    let tareasAMostrar = tareas;
    if (filtroActual === 'pending') {
        tareasAMostrar = tareas.filter(t => !t.completada);
    } else if (filtroActual === 'done') {
        tareasAMostrar = tareas.filter(t => t.completada);
    }

    // Limpiar la lista actual
    taskList.innerHTML = '';

    // Mostrar u ocultar el estado vacío
    if (tareasAMostrar.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    // Mostrar u ocultar botón de limpiar completadas
    const hayCompletadas = tareas.some(t => t.completada);
    clearBtn.style.display = hayCompletadas ? 'inline-block' : 'none';

    // Actualizar contador
    const pendientes = tareas.filter(t => !t.completada).length;
    counterText.textContent = pendientes === 1
        ? '1 tarea pendiente'
        : `${pendientes} tareas pendientes`;

    // Crear cada ítem de tarea en el DOM
    tareasAMostrar.forEach(tarea => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        if (tarea.completada) li.classList.add('completada');

        li.innerHTML = `
            <div class="task-checkbox" onclick="toggleTarea(${tarea.id})">
                ${tarea.completada ? '✓' : ''}
            </div>
            <span class="task-text">${escaparHTML(tarea.texto)}</span>
            <button class="delete-btn" onclick="eliminarTarea(${tarea.id})" title="Eliminar tarea">✕</button>
        `;

        taskList.appendChild(li);
    });
}

// =============================================
// 9. FUNCIÓN AUXILIAR: Escapar HTML
//    Evita que el texto del usuario se interprete como HTML
// =============================================
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// =============================================
// 10. PERMITIR agregar tarea con la tecla Enter
// =============================================
taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        agregarTarea();
    }
});

// =============================================
// INICIO: Cargar tareas guardadas al abrir la página
// =============================================
cargarTareasGuardadas();
