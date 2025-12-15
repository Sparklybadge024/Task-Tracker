import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskStatus } from '../../constants.js';

// Async Thunk for initial load
export const loadTasks = createAsyncThunk('tasks/loadTasks', async () => {
  // Simulate async delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = localStorage.getItem('redux-task-master-v1');
  return data ? JSON.parse(data) : [];
});

const initialState = {
  items: [],
  history: {
    past: [],
    future: [],
  },
  status: 'idle',
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      // Push current state to past for undo
      state.history.past.push([...state.items]);
      state.history.future = []; // Clear future on new action
      
      state.items.unshift(action.payload);
    },
    updateTask: (state, action) => {
      state.history.past.push([...state.items]);
      state.history.future = [];

      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTask: (state, action) => {
      state.history.past.push([...state.items]);
      state.history.future = [];

      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    toggleTaskStatus: (state, action) => {
      state.history.past.push([...state.items]);
      state.history.future = [];

      const task = state.items.find((t) => t.id === action.payload);
      if (task) {
        task.status =
          task.status === TaskStatus.COMPLETED
            ? TaskStatus.TODO
            : TaskStatus.COMPLETED;
      }
    },
    reorderTasks: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const result = Array.from(state.items);
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      
      // We don't track reordering in history to avoid spamming undo stack
      state.items = result; 
    },
    importTasks: (state, action) => {
        state.history.past.push([...state.items]);
        state.items = action.payload;
    },
    undo: (state) => {
      if (state.history.past.length === 0) return;
      
      const previous = state.history.past.pop();
      if (previous) {
        state.history.future.push([...state.items]);
        state.items = previous;
      }
    },
    redo: (state) => {
      if (state.history.future.length === 0) return;

      const next = state.history.future.pop();
      if (next) {
        state.history.past.push([...state.items]);
        state.items = next;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load tasks';
      });
  },
});

export const { addTask, updateTask, deleteTask, toggleTaskStatus, reorderTasks, undo, redo, importTasks } = tasksSlice.actions;
export default tasksSlice.reducer;