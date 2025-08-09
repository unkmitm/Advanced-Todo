import { createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { FILTERS, TIME_FILTERS, SORT_ORDERS } from "../constants/filters";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage("tasks", []); // Initialize tasks from local storage
  const [newTask, setNewTask] = useState(""); // New task input
  const [editingTask, setEditingTask] = useState(null); // Currently editing task
  const [editText, setEditText] = useState(""); // Text for editing task
  const [filter, setFilter] = useState(FILTERS.ALL); // Filter
  const [timeFilter, setTimeFilter] = useState(TIME_FILTERS.ALL); // Time filter
  const [sortOrder, setSortOrder] = useState(SORT_ORDERS.NEWEST); // Sort order
  const [priority, setPriority] = useState("medium"); // Task priority
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [removedTasks, setRemovedTasks] = useLocalStorage("removedTasks", 0); // Removed tasks count

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() !== "") {
      setTasks([
        ...tasks,
        {
          text: newTask,
          completed: false,
          createdAt: new Date().toISOString(), // Task creation date
          priority: priority,
        },
      ]);
      setNewTask("");
    }
  };

  // Toggle task completion status
  const toggleCompleted = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.createdAt === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Delete a task
  const handleDeleteTodo = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.createdAt === taskId ? { ...task, removed: true } : task
      )
    );

    setRemovedTasks((prevCount) => prevCount + 1);
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task.createdAt);
    setEditText(task.text);
  };

  // Handle editing a task
  const handleEdit = (taskId) => {
    if (editText.trim() !== "") {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.createdAt === taskId ? { ...task, text: editText } : task
        )
      );
      setEditingTask(null);
      setEditText("");
    }
  };

  // Handle priority change
  const handlePriorityChange = (taskId, newPriority) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.createdAt === taskId ? { ...task, priority: newPriority } : task
      )
    );
  };

  const filterByTime = (tasks) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      switch (timeFilter) {
        case TIME_FILTERS.TODAY:
          return taskDate >= today;
        case TIME_FILTERS.WEEK:
          return taskDate >= thisWeek;
        case TIME_FILTERS.MONTH:
          return taskDate >= thisMonth;
        default:
          return true;
      }
    });
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = tasks
      .filter((task) => !task.removed) // Filter out removed tasks
      .filter((task) => {
        if (filter === FILTERS.COMPLETED) return task.completed;
        if (filter === FILTERS.ACTIVE) return !task.completed;
        return true;
      })
      .filter((task) => {
        return task.text.toLowerCase().includes(searchQuery.toLowerCase());
      });

    filteredTasks = filterByTime(filteredTasks);

    return filteredTasks.sort((a, b) => {
      if (sortOrder === SORT_ORDERS.PRIORITY) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortOrder === SORT_ORDERS.NEWEST) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  };

  // Get removed tasks count
  const getRemovedTasks = () => {
    return removedTasks;
  };

  const value = {
    tasks,
    setTasks,
    newTask,
    setNewTask,
    editingTask,
    setEditingTask,
    editText,
    setEditText,
    filter,
    setFilter,
    timeFilter,
    setTimeFilter,
    sortOrder,
    setSortOrder,
    priority,
    setPriority,
    searchQuery,
    setSearchQuery,
    handleAddTask,
    toggleCompleted,
    handleDeleteTodo,
    startEditing,
    handleEdit,
    handlePriorityChange,
    getRemovedTasks,
    filteredAndSortedTasks: getFilteredAndSortedTasks(),
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
