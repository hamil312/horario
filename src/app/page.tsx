"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [isTaskOpen, setTaskOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    day: "Lunes",
    time: "00:00",
  });

  // Cargar tareas desde localStorage cuando la página se carga
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const saveTasksToLocalStorage = (updatedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  

  const openModal = () => {
    setNewTask({ title: "", description: "", day: "Lunes", time: "00:00" });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openTask = (task, index) => {
    setNewTask(task); // Cargar la tarea seleccionada para editar
    setEditingTaskIndex(index); // Guardar el índice de la tarea seleccionada
    setTaskOpen(true);
  };

  const closeTask = () => {
    setTaskOpen(false);
    setEditingTaskIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks); // Guardar tareas en localStorage
    setNewTask({ title: "", description: "", day: "Lunes", time: "00:00" });
    closeModal();
  };
  
  const handleEditTask = (e) => {
    e.preventDefault();
    const updatedTasks = [...tasks];
    updatedTasks[editingTaskIndex] = newTask; // Actualizar la tarea editada
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks); // Guardar tareas actualizadas en localStorage
    closeTask();
  };
  
  const handleDeleteTask = () => {
    const updatedTasks = tasks.filter((_, index) => index !== editingTaskIndex); // Eliminar tarea
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks); // Guardar tareas actualizadas en localStorage
    closeTask();
  };

  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const hoursOfDay = [...Array(24).keys()].map((hour) => `${hour.toString().padStart(2, "0")}:00`);

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
          ))}
        </section>

        {daysOfWeek.map((day) => (
          <section key={day} className={`bg-white h-full`}>
            <h2 className="font-bold text-center">{day}</h2>
            {hoursOfDay.map((hour) => (
              <section key={`${day}-${hour}`} className="relative border border-gray-200 h-16">
                {tasks
                  .filter((task) => task.day === day && task.time === hour)
                  .map((task, index) => (
                    <button
                      key={index}
                      className="absolute bg-blue-500 text-white rounded px-2 py-1 w-full h-full"
                      onClick={() => openTask(task, index)} // Abrir el popup con la tarea seleccionada
                    >
                      {task.title}
                    </button>
                  ))}
              </section>
            ))}
          </section>
        ))}
      </main>

      <footer className="bg-blue-500 fixed bottom-0 w-full z-10">
        <button className="bg-white text-blue-500 px-4 py-2 rounded-full p-5" onClick={openModal}>
          Añadir Actividad
        </button>
      </footer>

      {/* Modal para añadir nueva tarea */}
      {isModalOpen && (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <section className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Añadir nueva tarea</h2>
            <form onSubmit={handleSaveTask}>
              <section className="mb-4">
                <label className="block font-bold mb-2">Título</label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Título de la tarea"
                  value={newTask.title}
                  onChange={handleInputChange}
                />
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2">Descripción</label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Descripción de la tarea"
                  value={newTask.description}
                  onChange={handleInputChange}
                ></textarea>
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2">Día</label>
                <select
                  name="day"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newTask.day}
                  onChange={handleInputChange}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2">Hora</label>
                <select
                  name="time"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newTask.time}
                  onChange={handleInputChange}
                >
                  {hoursOfDay.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
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

      {/* Popup para editar tarea */}
      {isTaskOpen && (
        <section className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <section className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Editar tarea</h2>
            <form onSubmit={handleEditTask}>
              <section className="mb-4">
                <label className="block font-bold mb-2">Título</label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Título de la tarea"
                  value={newTask.title}
                  onChange={handleInputChange}
                />
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2">Descripción</label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Descripción de la tarea"
                  value={newTask.description}
                  onChange={handleInputChange}
                ></textarea>
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2">Día</label>
                <select
                  name="day"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newTask.day}
                  onChange={handleInputChange}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </section>
              <section className="mb-4">
                <label className="block font-bold mb-2">Hora</label>
                <select
                  name="time"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newTask.time}
                  onChange={handleInputChange}
                >
                  {hoursOfDay.map((hour) => (
                    <option key={hour} value={hour}>
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