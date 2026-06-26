'use client';

import React, { useState, useMemo } from 'react';
import { useChronos, Project } from '../../../context/ChronosContext';
import { useRouter } from 'next/navigation';
import { Briefcase, AlertCircle, Search, Edit2, Trash2, Plus, Calendar, DollarSign, Globe, Hash, Clock, FileText } from 'lucide-react';

export default function AdminProjects() {
  const { projects, handleDeleteProject } = useChronos();
  const router = useRouter();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.project_status === statusFilter || (!p.project_status && statusFilter === 'Active');
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const handleOpenAdd = () => {
    router.push('/admin/projects/add');
  };

  const handleOpenEdit = (project: Project) => {
    router.push(`/admin/projects/edit/${project.id}`);
  };

  const handleDelete = async (projectId: number, code: string) => {
    if (confirm(`Are you sure you want to delete project ${code}? This will remove it from the projects list.`)) {
      await handleDeleteProject(projectId);
    }
  };

  const totalProjects = projects.length;
  const activeCount = projects.filter(p => !p.project_status || p.project_status === 'Active').length;
  const completedCount = projects.filter(p => p.project_status === 'Completed').length;

  return (
    <div className="content-view active-view" style={{ padding: '0px' }}>
      
      {/* Stats Dashboard */}
      <div className="stats-grid" style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="stat-card glassmorphism hover-tilt" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>
            <Briefcase />
          </div>
          <div className="stat-info">
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total Projects</h3>
            <p className="stat-value" style={{ fontSize: '32px', fontWeight: 800, background: 'linear-gradient(90deg, #1e293b, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{totalProjects}</p>
          </div>
        </div>

        <div className="stat-card glassmorphism hover-tilt" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
            <Clock />
          </div>
          <div className="stat-info">
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Active Projects</h3>
            <p className="stat-value" style={{ fontSize: '32px', fontWeight: 800, color: '#10b981' }}>{activeCount}</p>
          </div>
        </div>

        <div className="stat-card glassmorphism hover-tilt" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
          <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
            <FileText />
          </div>
          <div className="stat-info">
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Completed Projects</h3>
            <p className="stat-value" style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6' }}>{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        padding: '16px 24px',
        borderRadius: '16px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '300px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', width: '18px', height: '18px' }} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                background: '#f8fafc',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          
          {/* Filters */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            {['All', 'Active', 'On Hold', 'Completed'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: statusFilter === status ? '#ffffff' : 'transparent',
                  color: statusFilter === status ? 'var(--primary)' : '#64748b',
                  boxShadow: statusFilter === status ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.4)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.3)'; }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
          <span>New Project</span>
        </button>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '60px 20px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <AlertCircle style={{ width: '48px', height: '48px', color: '#cbd5e1', margin: '0 auto 16px', display: 'block' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>No projects found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Try adjusting your search or filters, or create a new project.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {filteredProjects.map((proj) => {
            const status = proj.project_status || 'Active';
            let statusBg = 'rgba(16, 185, 129, 0.1)';
            let statusColor = '#10b981';
            let borderTopColor = '#10b981';
            
            if (status === 'On Hold') {
              statusBg = 'rgba(245, 158, 11, 0.1)';
              statusColor = '#f59e0b';
              borderTopColor = '#f59e0b';
            } else if (status === 'Completed') {
              statusBg = 'rgba(59, 130, 246, 0.1)';
              statusColor = '#3b82f6';
              borderTopColor = '#3b82f6';
            }

            return (
              <div key={proj.id} className="glassmorphism" style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                borderTop: `4px solid ${borderTopColor}`,
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.03)'; }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px' }}><Hash size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }}/>{proj.code}</span>
                      <span style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: statusBg, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{status}</span>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: 0, lineHeight: '1.4' }}>{proj.name}</h3>
                  </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, marginBottom: '20px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {proj.description || 'No description provided.'}
                  </p>
                </div>

                {/* Meta Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={14} color="#64748b" />
                    <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 500 }}>{proj.country || 'Global'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={14} color="#64748b" />
                    <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 500 }}>{proj.project_type || 'Internal'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={14} color={proj.is_billable !== false ? '#10b981' : '#64748b'} />
                    <span style={{ fontSize: '12px', color: proj.is_billable !== false ? '#10b981' : '#64748b', fontWeight: 600 }}>{proj.is_billable !== false ? 'Billable' : 'Non-Billable'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={14} color="#64748b" />
                    <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 500 }}>
                      {proj.start_date ? new Date(proj.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'TBD'}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    style={{ background: '#f1f5f9', color: 'var(--primary)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = 'var(--primary)'; }}
                  >
                    <Edit2 size={16} />
                    <span style={{ fontSize: '13px', fontWeight: 600, paddingRight: '4px' }}>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.code)}
                    style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
