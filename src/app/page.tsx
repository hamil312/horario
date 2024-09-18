"use client";
import { useState, useEffect } from "react";

export default function Home() {
  interface Task {
    title: string;
    description: string;
    day: string;
    time: string;
  } //Definir una interfaz para identificar y tipar las tareas
  const [isTaskOpen, setTaskOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    day: "Lunes",
    time: "00:00",
  }); //Estas constantes controlan y registran el estado actual de un objeto o componente, almacenando sus valores y definiendo una función que cambiará dicho estado

  // useEffect es un hook de react que permite sincronizar un componente con un sistema externo, en este caso, localStorage para almacenar la información de las tareas
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));//Usa el método setTasks para añadir las tareas almacenadas en el localStorage
    }
  }, []);

  const saveTasksToLocalStorage = (updatedTasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));//Guarda en una llave "tasks" el conjunto hecho cadena de las tareas actualizadas
  };

  

  const openModal = () => {
    setNewTask({ title: "", description: "", day: "Lunes", time: "00:00" });
    setIsModalOpen(true);
  };//La función que se encarga de establecer los datos por defecto que se mostrarán en el pop up al abrirse, también cambia el estado del modal a abierto

  const closeModal = () => setIsModalOpen(false);//Esta función informa al sistema que el modal se ha cerrado

  const openTask = (task: Task, index: number) => {
    setNewTask(task); // Cargar los datos de la tarea seleccionada para su edición
    setEditingTaskIndex(index); // Guardar el índice de la tarea seleccionada
    setTaskOpen(true);
  };//Esta función abre la tarea seleccionada para su edición

  const closeTask = () => {
    setTaskOpen(false);
    setEditingTaskIndex(null);
  };//Informa al sistema que el pop up de edición de tareas se ha cerrado, además también descarta el indice de la tarea a editar, estableciendolo como null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));//...prev hace referencia a que se debe tomar la información del estado anterior, mientras que [name]: value, hace referencia a la llave [name] cuyo valor debe ser cambiado a value
  };//Recibe un parametro e, siendo este un objeto de evento de javascript, que contiene información del evento que desencadenó la acción, al ejecutarse obtiene el nombre y el valor de la variable e, y utiliza setNewTask usando como parámetro la tarea en su estado previo con determinados valores

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();//e es un objeto de evento de formulario de react
    const updatedTasks = [...tasks, newTask];//Establece updatedTasks a un conjunto de las tareas anteriores y la tarea nueva
    setTasks(updatedTasks);//Usa setTasks para establecer el estado de las tareas al mismo de updatedTasks
    saveTasksToLocalStorage(updatedTasks); // Guardar tareas en localStorage
    setNewTask({ title: "", description: "", day: "Lunes", time: "00:00" });//Tras guardar las tareas restablece los valores a los valores por defecto par la proxima vez que se creen tareas
    closeModal();
  };
  
  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTaskIndex !== null) {
      const updatedTasks = [...tasks];//Crea una constante en la que se guardará el conjunto de tareas almacenadas originalmente
      updatedTasks[editingTaskIndex] = newTask;//Se añade al conjunto la tarea nueva
      setTasks(updatedTasks);//Usa la función para cambiar el estado de la variable global, dandole el valor de nuestro conjunto de tareas
      saveTasksToLocalStorage(updatedTasks);
      closeTask();
    }//if se asegura de que el indice de la tarea a editar no sea nulo
  };
  
  const handleDeleteTask = () => {
    const updatedTasks = tasks.filter((_, index) => index !== editingTaskIndex); // Eliminar tarea
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks); // Guardar tareas actualizadas en localStorage
    closeTask();
  };

  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];//Un arreglo con los días de la semana
  const hoursOfDay = Array.from(Array(24).keys()).map((hour) => `${hour.toString().padStart(2, "0")}:00`);//Un arreglo que genera automáticamente opciones de  00:00 a 23:00 dandoles dicho formato a través de la función map

  return (
    <div>
      <header className="bg-blue-500 fixed top-0 w-full h-16 z-10">
        <h1 className="text-center">Planificador</h1>
      </header>
      <main className="grid grid-cols-8 items-start flex-grow pt-16 pb-16 overflow-y-auto grid-rows-auto">
        <section className="grid bg-blue-400 h-full grid-rows-auto">
          <section className="bg-fixed top-0 w-full">Hora</section>
          {hoursOfDay.map((hour) => (
            <section key={hour}>{hour}</section>
          ))}{/*Crea una seccion o fila por cada hora en el conjunto de hoursOfDay con la etiqueta de la hora a la que corresponde y asignandole una llave para ubicarle*/}
        </section>

        {daysOfWeek.map((day) => (
          <section key={day} className={`bg-white h-full`}>
            <h2 className="font-bold text-center text-black">{day}</h2>{/*En la parte superior se crea una fila donde cada columna tiene el nombre del día y se le asigna una llave*/}
            {hoursOfDay.map((hour) => (
              <section key={`${day}-${hour}`} className="relative border border-gray-200 h-16">{/*Se crea una sección de hora por cada día y se le asigna una llave para ubicarla*/}
                {tasks
                  .filter((task) => task.day === day && task.time === hour)
                  .map((task, index) => (
                    <button
                      key={index}
                      className="absolute bg-blue-500 text-white rounded px-2 py-1 w-full h-full"
                      onClick={() => openTask(task, index)} // Abrir el popup con la tarea seleccionada
                    >
                      {task.title}
                    </button>//Se crea un botón con el nombre de la tarea si el día y la hora corresponden al día y la hora asignados a la casilla que se esta creando, y se le asigna un indice como llave
                  ))}
              </section>
            ))}
          </section>
        ))}
      </main>

      <footer className="bg-blue-500 fixed bottom-0 w-full z-10">
        <button className="bg-white text-blue-500 px-4 py-2 rounded-full p-5" onClick={openModal}>
          Añadir Actividad
        </button>{/*Un botón que al presionarse activa el pop up para añadir una actividad*/}
      </footer>

      {/* Modal para añadir nueva tarea, es el diseño del modal o del pop up que se va a abrir*/}
      {isModalOpen && (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <section className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-black">Añadir nueva tarea</h2>
            <form onSubmit={handleSaveTask}>{/*Llamado a la función para guardar la tarea*/}
              <section className="mb-4">
                <label className="block font-bold mb-2 text-black">Título</label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-3 py-2 border rounded-lg text-gray-500"
                  placeholder="Título de la tarea"
                  value={newTask.title}
                  onChange={handleInputChange}
                />{/*Llamado a la función para manejar cambios en la tarea la tarea también define el valor que tendrá por defecto la entrada*/}
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2 text-black">Descripción</label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border rounded-lg text-gray-500"
                  placeholder="Descripción de la tarea"
                  value={newTask.description}
                  onChange={handleInputChange}
                ></textarea>
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2 text-black">Día</label>
                <select
                  name="day"
                  className="w-full px-3 py-2 border rounded-lg text-gray-500"
                  value={newTask.day}
                  onChange={handleInputChange}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day} className="text-black">
                      {day}
                    </option>
                  ))}
                </select>{/*Se crean las opciones del menú desplegable a través del conjunto de días, mapeando una opción por cada día, y asignandole una llave y un valor*/}
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2 text-black">Hora</label>
                <select
                  name="time"
                  className="w-full px-3 py-2 border rounded-lg text-gray-500"
                  value={newTask.time}
                  onChange={handleInputChange}
                >
                  {hoursOfDay.map((hour) => (
                    <option key={hour} value={hour} className="text-black">
                      {hour}
                    </option>
                  ))}
                </select>{/*Se crean las opciones del menú desplegable a través del conjunto de horas, mapeando una opción por cada hora, y asignandole una llave y un valor*/}
              </section>
              <section className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              </section>
            </form>
          </section>
        </section>
      )}

      {/* Modal para editar tarea */}
      {isTaskOpen && (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <section className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-black">Editar tarea</h2>
            <form onSubmit={handleEditTask}>
              <section className="mb-4">
                <label className="block font-bold mb-2 text-black">Título</label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-3 py-2 border rounded-lg text-gray-500"
                  placeholder="Título de la tarea"
                  value={newTask.title}
                  onChange={handleInputChange}
                />
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2 text-black">Descripción</label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border rounded-lg text-gray-500"
                  placeholder="Descripción de la tarea"
                  value={newTask.description}
                  onChange={handleInputChange}
                ></textarea>
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2 text-black">Día</label>
                <select
                  name="day"
                  className="w-full px-3 py-2 border rounded-lg text-gray-500"
                  value={newTask.day}
                  onChange={handleInputChange}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day} className="text-black">
                      {day}
                    </option>
                  ))}
                </select>
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2 text-black">Hora</label>
                <select
                  name="time"
                  className="w-full px-3 py-2 border rounded-lg text-gray-500"
                  value={newTask.time}
                  onChange={handleInputChange}
                >
                  {hoursOfDay.map((hour) => (
                    <option key={hour} value={hour} className="text-black">
                      {hour}
                    </option>
                  ))}
                </select>
              </section>
              <section className="flex justify-between">
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleDeleteTask} // Botón para eliminar tarea
                >
                  Eliminar
                </button>
                <div className="flex">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                    onClick={closeTask}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Guardar
                  </button>
                </div>
              </section>
            </form>
          </section>
        </section>
      )}
    </div>
  );
}