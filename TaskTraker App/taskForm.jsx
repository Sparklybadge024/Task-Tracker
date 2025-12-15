import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TaskStatus, TaskPriority } from '../constants.js';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CheckCircle, AlertTriangle, Clock, List } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
const PRIORITY_COLORS = {
  [TaskPriority.LOW]: '#10B981',
  [TaskPriority.MEDIUM]: '#3B82F6',
  [TaskPriority.HIGH]: '#F59E0B',
  [TaskPriority.URGENT]: '#EF4444',
};

export const Dashboard = () => {
  const { items: tasks } = useSelector((state) => state.tasks);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const inProgress = tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length;
    const todo = tasks.filter((t) => t.status === TaskStatus.TODO).length;

    const statusData = [
      { name: 'Completed', value: completed, color: '#10B981' },
      { name: 'In Progress', value: inProgress, color: '#3B82F6' },
      { name: 'To Do', value: todo, color: '#94A3B8' },
    ];

    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    const priorityData = Object.values(TaskPriority).map((p) => ({
      name: p,
      count: priorityCounts[p] || 0,
    }));

    return { total, completed, inProgress, todo, statusData, priorityData };
  }, [tasks]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 rounded-full bg-slate-100 text-slate-600 mr-4">
            <List size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Completed</p>
            <p className="text-2xl font-bold text-slate-800">{stats.completed}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">In Progress</p>
            <p className="text-2xl font-bold text-slate-800">{stats.inProgress}</p>
          </div>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pending</p>
            <p className="text-2xl font-bold text-slate-800">{stats.todo}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Status Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.priorityData}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stats.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};