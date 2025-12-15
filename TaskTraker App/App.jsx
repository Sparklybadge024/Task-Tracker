import React, { useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadTasks, undo, redo, importTasks } from './features/tasks/tasksSlice.js';
import { openTaskModal, openShareModal, setSearchQuery, setStatusFilter, setPriorityFilter, toggleSidebar, setSidebarOpen } from './features/ui/uiSlice.js';
import { TaskList } from './components/TaskList.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import { ShareModal } from './components/ShareModal.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { TaskPriority, TaskStatus } from './constants.js';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Plus, 
  Search, 
  Menu, 
  RotateCcw, 
  RotateCw, 
  Download, 
  Upload,
  Filter,
  Share2
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isOpen = useSelector(state => state.ui.sidebarOpen);

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <CheckSquare size={20} />, label: 'My Tasks', path: '/tasks' },
  ];
  
  const fileInputRef = useRef(null);

  const handleExport = () => {
     const tasks = localStorage.getItem('redux-task-master-v1');
     if (!tasks) return;
     const blob = new Blob([tasks], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
     a.click();
  };

  const handleImport = (e) => {
      const file = e.target.files?.[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const data = JSON.parse(event.target?.result);
              if(Array.isArray(data)) {
                  dispatch(importTasks(data));
              }
          } catch(err) {
              alert("Invalid JSON file");
          }
      };
      reader.readAsText(file);
  };

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-20 w-64 h-full bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col`}>
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">R</span>
            TaskMaster
        </h1>
        <button className="md:hidden text-slate-400" onClick={() => dispatch(toggleSidebar())}>
            <Menu size={20}/>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="grid grid-cols-2 gap-2 mb-4">
             <button onClick={handleExport} className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs gap-1">
                <Download size={18} /> Export
            </button>
             <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs gap-1">
                <Upload size={18} /> Import
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
        </div>
      </div>
    </div>
  );
};

const Header = () => {
    const dispatch = useDispatch();
    const { history } = useSelector(state => state.tasks);
    const { filters } = useSelector(state => state.ui);

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button onClick={() => dispatch(toggleSidebar())} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <Menu size={20} />
                </button>
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={filters.searchQuery}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-64 text-sm transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button 
                    onClick={() => dispatch(openShareModal())}
                    className="flex items-center gap-2 bg-slate-50 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors font-medium border border-slate-200 mr-2"
                >
                    <Share2 size={18} />
                    <span className="hidden sm:inline">Share</span>
                </button>

                <div className="flex items-center mr-4 bg-slate-50 rounded-lg p-1 border border-slate-200">
                    <button 
                        onClick={() => dispatch(undo())}
                        disabled={history.past.length === 0}
                        className="p-2 text-slate-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-500 rounded-md transition-colors"
                        title="Undo"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button 
                        onClick={() => dispatch(redo())}
                        disabled={history.future.length === 0}
                        className="p-2 text-slate-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-500 rounded-md transition-colors"
                        title="Redo"
                    >
                        <RotateCw size={18} />
                    </button>
                </div>
                <button 
                    onClick={() => dispatch(openTaskModal(null))}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                    <Plus size={18} />
                    <span className="hidden sm:inline">New Task</span>
                </button>
            </div>
        </header>
    )
}

const FilterBar = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector(state => state.ui);

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="flex-1 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Filter size={18} />
                    <span>Filters:</span>
                </div>
                 <select 
                    value={filters.statusFilter}
                    onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto p-2.5 outline-none"
                >
                    <option value="ALL">All Status</option>
                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <select 
                    value={filters.priorityFilter}
                    onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto p-2.5 outline-none"
                >
                    <option value="ALL">All Priorities</option>
                     {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            {/* Mobile Search */}
            <div className="sm:hidden relative w-full">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={filters.searchQuery}
                        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none w-full text-sm"
                    />
            </div>
        </div>
    )
}

const TasksView = () => (
    <div className="max-w-5xl mx-auto w-full animate-fade-in">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">My Tasks</h2>
            <p className="text-slate-500">Manage and organize your daily agenda</p>
        </div>
        <FilterBar />
        <TaskList />
    </div>
);

const DashboardView = () => (
    <div className="max-w-6xl mx-auto w-full">
         <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-500">Track your productivity metrics</p>
        </div>
        <Dashboard />
    </div>
)

const MainLayout = () => {
     const dispatch = useDispatch();
     // Check screen size for sidebar
     useEffect(() => {
         const handleResize = () => {
             if (window.innerWidth < 768) {
                 dispatch(setSidebarOpen(false));
             } else {
                 dispatch(setSidebarOpen(true));
             }
         }
         window.addEventListener('resize', handleResize);
         handleResize();
         return () => window.removeEventListener('resize', handleResize);
     }, [dispatch]);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                 <Header />
                 <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<DashboardView />} />
                        <Route path="/tasks" element={<TasksView />} />
                    </Routes>
                 </main>
                 <TaskForm />
                 <ShareModal />
            </div>
        </div>
    );
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

export default App;