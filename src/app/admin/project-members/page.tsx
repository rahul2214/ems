'use client';

import React, { useState, useEffect } from 'react';
import { useChronos, Project } from '../../../context/ChronosContext';
import { Users, Trash2, Check, AlertCircle } from 'lucide-react';

export default function AdminProjectMembers() {
  const { projects, employees, handleUpdateProject } = useChronos();

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projMembers, setProjMembers] = useState<{ employee_id: number; role: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedProjectId) {
      const proj = projects.find(p => p.id === selectedProjectId);
      if (proj) {
        setSelectedProject(proj);
        setProjMembers(proj.members?.map(m => ({ employee_id: m.employee_id, role: m.role })) || []);
      }
    } else {
      setSelectedProject(null);
      setProjMembers([]);
    }
  }, [selectedProjectId, projects]);

  const handleSaveMembers = async () => {
    if (!selectedProject) return;
    setSaving(true);
    try {
      const payload = {
        code: selectedProject.code,
        name: selectedProject.name,
        description: selectedProject.description || '',
        members: projMembers,
        project_status: selectedProject.project_status,
        project_type: selectedProject.project_type,
        country: selectedProject.country,
        is_billable: selectedProject.is_billable,
        start_date: selectedProject.start_date,
        end_date: selectedProject.end_date,
        budget: selectedProject.budget
      };
      await handleUpdateProject(selectedProject.id, payload);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-view active-view" style={{ padding: '0px' }}>
      
      <div 
        className="glassmorphism animated-scale-up"
        style={{
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          background: '#ffffff',
          marginBottom: '24px',
          maxWidth: '800px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Select Project */}
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
              Select a Project
            </label>
            <select
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : null)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                fontSize: '14px',
                cursor: 'pointer',
                color: 'var(--text-main)'
              }}
            >
              <option value="">-- Choose Project --</option>
              {projects.map(proj => (
                <option key={proj.id} value={proj.id}>
                  {proj.code} - {proj.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>Team Configuration</h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedProject.name}</span>
                </div>
              </div>

              {/* Add Member Controls */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <select
                  id="pageEmployeeSelect"
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                >
                  <option value="">Select Employee...</option>
                  {employees.filter(e => !projMembers.some(m => m.employee_id === e.id)).map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.designation || e.role})</option>
                  ))}
                </select>
                <input
                  type="text"
                  id="pageRoleSelect"
                  placeholder="Role (e.g. Developer)"
                  style={{ width: '160px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const empSelect = document.getElementById('pageEmployeeSelect') as HTMLSelectElement;
                    const roleSelect = document.getElementById('pageRoleSelect') as HTMLInputElement;
                    if (empSelect.value) {
                      setProjMembers([...projMembers, { 
                        employee_id: Number(empSelect.value), 
                        role: roleSelect.value || 'Member' 
                      }]);
                      empSelect.value = '';
                    }
                  }}
                  style={{ 
                    padding: '10px 20px', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '13px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px var(--primary-glow)'
                  }}
                >
                  Add
                </button>
              </div>

              {/* Member List */}
              <div style={{ background: '#ffffff', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0', minHeight: '120px' }}>
                {projMembers.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px', padding: '20px 0' }}>
                    <AlertCircle size={24} color="#94a3b8" />
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>No team members assigned.</p>
                  </div>
                ) : (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {projMembers.map(member => {
                      const emp = employees.find(e => e.id === member.employee_id);
                      return (
                        <li key={member.employee_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{emp?.name || 'Unknown'}</span>
                            <span style={{ 
                              fontSize: '11px', 
                              padding: '3px 8px', 
                              background: member.role.toLowerCase() === 'manager' ? '#e0e7ff' : '#f1f5f9', 
                              color: member.role.toLowerCase() === 'manager' ? '#4f46e5' : '#64748b', 
                              borderRadius: '4px', 
                              fontWeight: 600, 
                              textTransform: 'uppercase' 
                            }}>
                              {member.role}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setProjMembers(projMembers.filter(m => m.employee_id !== member.employee_id))}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Remove Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Save Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleSaveMembers}
                  disabled={saving}
                  style={{
                    background: 'var(--primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: saving ? 0.7 : 1,
                    boxShadow: '0 4px 12px var(--primary-glow)',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => { if (!saving) e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={(e) => { if (!saving) e.currentTarget.style.opacity = '1'; }}
                >
                  {saving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>Save Assignments</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
