import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './features/tasks/tasksSlice.js';
import uiReducer from './features/ui/uiSlice.js';

// Middleware to save tasks to localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith('tasks/')) {
    const tasks = store.getState().tasks.items;
    localStorage.setItem('redux-task-master-v1', JSON.stringify(tasks));
  }
  return result;
};

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});