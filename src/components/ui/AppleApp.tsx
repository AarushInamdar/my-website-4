'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import AppWrapper from './AppWrapper';

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

export default function AppleApp() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Audit Store APIs', status: 'done' },
    { id: 't2', title: 'Geofence Logic', status: 'in-progress' },
    { id: 't3', title: 'SwiftUI Bridge', status: 'todo' },
  ]);

  const [kpiTriggered, setKpiTriggered] = useState(false);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newTasks = Array.from(tasks);
    const taskIndex = newTasks.findIndex(t => t.id === draggableId);
    if (taskIndex === -1) return;

    const [movedTask] = newTasks.splice(taskIndex, 1);
    const isStatusChange = movedTask.status !== destination.droppableId;
    movedTask.status = destination.droppableId as TaskStatus;

    // Group to maintain column order
    const cols: Record<TaskStatus, Task[]> = { todo: [], 'in-progress': [], done: [] };
    newTasks.forEach(t => cols[t.status].push(t));
    cols[destination.droppableId as TaskStatus].splice(destination.index, 0, movedTask);

    setTasks([...cols.todo, ...cols['in-progress'], ...cols.done]);

    if (isStatusChange) {
      setKpiTriggered(true);
      setTimeout(() => setKpiTriggered(false), 3000);
    }
  };

  const columns: { id: TaskStatus; label: string }[] = [
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Complete' },
  ];

  return (
    <AppWrapper
      title="Apple_Files // Retail Core"
      subtitle="Engineered for internal retail employee project assignment & KPI tracking."
      brandColor="#E2E8F0"
    >
      <div className="p-5 flex flex-col gap-6 h-full font-sans tracking-tight">
        
        {/* ─── Geofencing KPI Header ─── */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <div>
            <h3 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Live Telemetry</h3>
            <p className="text-white/40 text-[11px]">Real-time campus location parsing active</p>
          </div>
          <motion.div 
            className="px-4 py-2 rounded-xl text-sm font-bold shadow-lg"
            animate={{ 
              backgroundColor: kpiTriggered ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: kpiTriggered ? '#34C759' : '#ffffff80',
              boxShadow: kpiTriggered ? '0 0 20px rgba(52,199,89,0.4)' : 'none',
              scale: kpiTriggered ? 1.05 : 1
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {kpiTriggered ? '▲ +30% Check-in Efficiency' : 'Idle System State'}
          </motion.div>
        </div>

        {/* ─── Kanban Board ─── */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 grid grid-cols-3 gap-4">
            {columns.map(col => (
              <div key={col.id} className="flex flex-col gap-3">
                <div className="text-[11px] font-semibold text-white/50 uppercase tracking-widest flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.id === 'done' ? 'bg-[#34C759]' : col.id === 'in-progress' ? 'bg-[#0A84FF]' : 'bg-white/20'}`} />
                  {col.label}
                </div>
                
                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 bg-black/20 rounded-2xl p-2 border border-white/5 flex flex-col gap-2 min-h-[150px]"
                    >
                      {tasks.filter(t => t.status === col.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 rounded-xl border border-white/10 shadow-sm text-xs font-medium text-white/90 ${snapshot.isDragging ? 'bg-white/20 scale-105' : 'bg-white/[0.05] hover:bg-white/[0.1] transition-colors'}`}
                              style={{
                                ...provided.draggableProps.style,
                              }}
                            >
                              {task.title}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </AppWrapper>
  );
}
