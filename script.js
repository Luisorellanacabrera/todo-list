// =============================================
// LISTA DE TAREAS - JavaScript
// Bootcamp Full Stack - Luis Orellana
// Usa localStorage para guardar las tareas
// =============================================

// --- Variables globales ---
let tareas = []; // Arreglo que guarda todas las tareas
let filtroActual = 'all'; // Filtro activo: 'all', 'pending', 'done'

// --- Elementos del DOM ---
const taskInput   = document.getElementById('task-input');
const addBtn      = document.getElementById('add-btn');
const taskList    = document.getElementById('task-list');
const emptyState  = document.getElementById('empty-state');
const counterText = document.getElementById('counter-text');
const clearBtn    = document.getElementById('clear-btn');

// =============================================
// 1. CARGAR TAREAS al iniciar la página
// =============================================
function cargarTareasGuardadas() {
    const guardadas = localStorage.getItem('mis-tareas');
    if (guardadas) {
        tareas = JSON.parse(guardadas);
    }
    renderizarTareas();
}

// =============================================
// 2. GUARDAR TAREAS en localStorage
// =============================================
function guardarEnLocalStorage() {
    localStorage.setItem('mis-tareas', JSON.stringify(tareas));
}

// =============================================
// 3. AGREGAR una nueva tarea
// =============================================
function agregarTarea() {
    const texto = taskInput.value.trim();

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
        id: Date.now(),
        texto: texto,
        completada: false,
        fecha: new Date().toLocaleDateString('es-CL')
    };

    tareas.push(nuevaTarea);
    taskInput.value = '';
    taskInput.focus();

    guardarEnLocalStorage();
    renderizarTareas();
}

// =============================================
// 4. MARCAR como completada / pendiente
// =============================================
function toggleTarea(id) {
    tareas = tareas.map(tarea => {
        if (tarea.id === id) {
            return { ...tarea, completada: !tarea.completada };
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
// 7. FILTRAR tareas
// =============================================
function filtrarTareas(filtro) {
    filtroActual = filtro;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('filter-' + filtro).classList.add('active');

    renderizarTareas();
}

// =============================================
// 8. RENDERIZAR las tareas en pantalla
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
    emptyState.style.display = tareasAMostrar.length === 0 ? 'block' : 'none';

    // Mostrar u ocultar el botón de limpiar completadas
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

        // Checkbox
        const checkbox = document.createElement('div');
        checkbox.classList.add('task-checkbox');
        checkbox.textContent = tarea.completada ? '✓' : '';
        checkbox.addEventListener('click', () => toggleTarea(tarea.id));

        // Texto
        const span = document.createElement('span');
        span.classList.add('task-text');
        span.textContent = tarea.texto; // .textContent es seguro, no interpreta HTML

        // Botón eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('delete-btn');
        btnEliminar.title = 'Eliminar tarea';
        btnEliminar.textContent = '✕';
        btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(btnEliminar);

        taskList.appendChild(li);
    });
}

// =============================================
// 9. EVENTOS: botón agregar + tecla Enter
// =============================================
addBtn.addEventListener('click', agregarTarea);

taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        agregarTarea();
    }
});

clearBtn.addEventListener('click', limpiarCompletadas);

// Filtros
document.getElementById('filter-all').addEventListener('click', () => filtrarTareas('all'));
document.getElementById('filter-pending').addEventListener('click', () => filtrarTareas('pending'));
document.getElementById('filter-done').addEventListener('click', () => filtrarTareas('done'));

// =============================================
// INICIO: cargar tareas guardadas
// =============================================
cargarTareasGuardadas();
