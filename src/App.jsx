import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // -------------------- State --------------------
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  // -------------------- LocalStorage --------------------
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // -------------------- Functions --------------------
  const addTask = () => {
    if (!inputValue) return;

    const newTask = {
      text: inputValue,
      category,
      priority,
      dueDate,
      timestamp: new Date().toLocaleString(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
    setCategory("General");
    setPriority("Medium");
    setDueDate("");
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // -------------------- Export / Print --------------------
  const printTasks = () => {
    let printContent = "<h1>Smart Study Planner Tasks</h1><ul>";
    tasks.forEach((task) => {
      printContent += `<li>
        <strong>${task.text}</strong><br/>
        Category: ${task.category}<br/>
        Priority: ${task.priority}<br/>
        Due: ${task.dueDate || "None"}<br/>
        Completed: ${task.completed ? "Yes" : "No"}<br/>
      </li>`;
    });
    printContent += "</ul>";

    const newWindow = window.open("", "_blank");
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  // -------------------- Render --------------------
  return (
    <div className={darkMode ? "container dark" : "container"}>
      <div className="card">
        <h1>Smart Study Planner</h1>

        {/* Dark Mode Toggle */}
        <button className="dark-toggle" onClick={toggleDarkMode}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Controls */}
        <div className="controls">
          <input
            type="text"
            placeholder="Add a new task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>General</option>
            <option>Study</option>
            <option>Work</option>
            <option>Personal</option>
          </select>

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button onClick={addTask}>Add Task</button>
        </div>

        {/* Export / Print */}
        <button className="export-btn" onClick={printTasks}>
          📄 Export / Print Tasks
        </button>

        {/* Task List */}
        <ul className="task-list">
          {tasks.map((task, index) => {
            // Overdue calculation
            let overdue = false;
            if (task.dueDate) {
              const today = new Date().setHours(0, 0, 0, 0);
              const due = new Date(task.dueDate).setHours(0, 0, 0, 0);
              overdue = !task.completed && due < today;
            }

            return (
              <li
                key={index}
                className={`task ${task.completed ? "completed" : ""} ${task.priority.toLowerCase()} ${overdue ? "overdue" : ""}`}
              >
                <div onClick={() => toggleComplete(index)}>
                  <strong>{task.text}</strong>
                  <p>Category: {task.category}</p>
                  <p>Priority: {task.priority}</p>
                  <p>Due: {task.dueDate || "None"}</p>
                  <small>{task.timestamp}</small>
                </div>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;