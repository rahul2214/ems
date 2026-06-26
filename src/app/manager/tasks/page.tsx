'use client';

import React, { useState } from 'react';
import { useChronos } from '../../../context/ChronosContext';
import { ListTodo, CheckSquare, Plus, AlertCircle, RefreshCw } from 'lucide-react';

export default function ManagerTasks() {
  const { currentUser, tasks, employees, handleCreateTask, handleUpdateTaskStatus, getInitials } = useChronos();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  if (!currentUser) return null;

  // Filter team members
  const teamEmployees = employees.filter(emp => 
    emp.id !== currentUser.id &&
    emp.department === currentUser.department
  );

  const teamEmpIds = teamEmployees.map(e => e.id);

  // Filter team tasks
  const teamTasks = tasks.filter(t => teamEmpIds.includes(t.assigned_to));

  const getEmployeeName = (empId: number) => {
    const emp = teamEmployees.find(e => e.id === empId);
    return emp ? emp.name : 'Unknown';
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDescription || !assignedTo) {
      alert("Please fill in all task details and select a team assignee.");
      return;
    }
    await handleCreateTask({
      assigned_to: Number(assignedTo),
      title: taskTitle,
      description: taskDescription
    });
    setTaskTitle('');
    setTaskDescription('');
    setAssignedTo('');
  };

  return (
    <div className="content-view active-view" style={{ padding: '0px' }}>
      
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Left Column - Assign Task Form */}
        <div style={{
          flex: '1',
          minWidth: '320px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
            Assign New Team Task
          </h3>

          <form onSubmit={handleAssignTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Implement layout scroll wrapper"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Assign To (Team Member)</label>
              <select
                required
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select a team member...</option>
                {teamEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Description</label>
              <textarea
                required
                placeholder="Provide task goals, requirements, or scope..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px var(--primary-glow)',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Assign Task
            </button>
          </form>
        </div>

        {/* Right Column - Active Tasks Board */}
        <div style={{
          flex: '2',
          minWidth: '420px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ListTodo style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
            Active Team Tasks List
          </h3>

          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Task Info</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Assigned To</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textAlign: 'center', width: '150px' }}>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {teamTasks.map((tk, idx) => {
                  const assigneeName = getEmployeeName(tk.assigned_to);

                  let statusColor = '#94a3b8'; // pending -> slate
                  if (tk.status === 'In Progress') statusColor = '#f59e0b'; // amber
                  if (tk.status === 'Completed') statusColor = '#10b981'; // emerald

                  return (
                    <tr key={tk.id} style={{ borderBottom: idx === teamTasks.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{tk.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{tk.description}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getInitials(assigneeName)}
                          </div>
                          <span>{assigneeName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{
                          background: `${statusColor}15`,
                          color: statusColor,
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: `1px solid ${statusColor}20`
                        }}>
                          {tk.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <select
                          value={tk.status}
                          onChange={(e) => handleUpdateTaskStatus(tk.id, e.target.value as any)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            background: '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}

                {teamTasks.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '13px' }}>
                      <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--text-dark)', margin: '0 auto 8px', display: 'block' }} />
                      No active tasks assigned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
