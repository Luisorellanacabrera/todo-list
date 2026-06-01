// =============================================
// LISTA DE TAREAS - JavaScript
// Bootcamp Full Stack - Luis Orellana
// =============================================

// Esperamos que el HTML esté completamente cargado antes de ejecutar nada
document.addEventListener('DOMContentLoaded', function () {

    // --- Variables ---
    let tareas = [];
    let filtroActual = 'all';

    // --- Referencias al DOM ---
    const taskInput   = document.getElementById('task-input');
    const addBtn      = document.getElementById('add-btn');
    const taskList    = document.getElementById('task-list');
    const emptyState  = document.getElementById('empty-state');
    const counterText = document.getElementById('counter-text');
    const clearBtn    = document.getElementById('clear-btn');

    // --- GUARDAR en localStorage ---
    function guardarEnLocalStorage() {
        localStorage.setItem('mis-tareas', JSON.stringify(tareas));
    }

    // --- AGREGAR tarea ---
    function agregarTarea() {
        const texto = taskInput.value.trim();
        if (texto === '') {
            taskInput.style.borderColor = '#ef4444';
            setTimeout(function () { taskInput.style.borderColor = ''; }, 800);
            taskInput.focus();
            return;
        }

        const nuevaTarea = {
            id: Date.now(),
            texto: texto,
            completada: false
        };

        tareas.push(nuevaTarea);
        taskInput.value = '';
        taskInput.focus();
        guardarEnLocalStorage();
        renderizarTareas();
    }

    // --- TOGGLE completada ---
    function toggleTarea(id) {
        tareas = tareas.map(function (t) {
            if (t.id === id) {
                return { id: t.id, texto: t.texto, completada: !t.completada };
            }
            return t;
        });
        guardarEnLocalStorage();
        renderizarTareas();
    }

    // --- ELIMINAR tarea ---
    function eliminarTarea(id) {
        tareas = tareas.filter(function (t) { return t.id !== id; });
        guardarEnLocalStorage();
        renderizarTareas();
    }

    // --- LIMPIAR completadas ---
    function limpiarCompletadas() {
        tareas = tareas.filter(function (t) { return !t.completada; });
        guardarEnLocalStorage();
        renderizarTareas();
    }

    // --- FILTRAR ---
    function filtrarTareas(filtro) {
        filtroActual = filtro;
        document.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.classList.remove('active');
        });
        document.getElementById('filter-' + filtro).classList.add('active');
        renderizarTareas();
    }

    // --- RENDERIZAR ---
    function renderizarTareas() {
        var tareasAMostrar = tareas;
        if (filtroActual === 'pending') {
            tareasAMostrar = tareas.filter(function (t) { return !t.completada; });
        } else if (filtroActual === 'done') {
            tareasAMostrar = tareas.filter(function (t) { return t.completada; });
        }

        // Limpiar lista
        taskList.innerHTML = '';

        // Estado vacío
        emptyState.style.display = tareasAMostrar.length === 0 ? 'block' : 'none';

        // Botón limpiar
        var hayCompletadas = tareas.some(function (t) { return t.completada; });
        clearBtn.style.display = hayCompletadas ? 'inline-block' : 'none';

        // Contador
        var pendientes = tareas.filter(function (t) { return !t.completada; }).length;
        counterText.textContent = pendientes === 1 ? '1 tarea pendiente' : pendientes + ' tareas pendientes';

        // Crear ítems
        tareasAMostrar.forEach(function (tarea) {
            var li = document.createElement('li');
            li.className = 'task-item' + (tarea.completada ? ' completada' : '');

            // Checkbox
            var checkbox = document.createElement('div');
            checkbox.className = 'task-checkbox';
            checkbox.textContent = tarea.completada ? '✓' : '';
            (function (id) {
                checkbox.addEventListener('click', function () { toggleTarea(id); });
            })(tarea.id);

            // Texto
            var span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = tarea.texto;

            // Botón eliminar
            var btnEl = document.createElement('button');
            btnEl.className = 'delete-btn';
            btnEl.title = 'Eliminar tarea';
            btnEl.textContent = '✕';
            (function (id) {
                btnEl.addEventListener('click', function () { eliminarTarea(id); });
            })(tarea.id);

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(btnEl);
            taskList.appendChild(li);
        });
    }

    // --- EVENTOS ---
    addBtn.addEventListener('click', agregarTarea);

    taskInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') agregarTarea();
    });

    clearBtn.addEventListener('click', limpiarCompletadas);

    document.getElementById('filter-all').addEventListener('click', function () { filtrarTareas('all'); });
    document.getElementById('filter-pending').addEventListener('click', function () { filtrarTareas('pending'); });
    document.getElementById('filter-done').addEventListener('click', function () { filtrarTareas('done'); });

    // --- INICIO: cargar desde localStorage ---
    var guardadas = localStorage.getItem('mis-tareas');
    if (guardadas) {
        try {
            tareas = JSON.parse(guardadas);
        } catch (e) {
            tareas = [];
        }
    }
    renderizarTareas();

}); // fin DOMContentLoaded
