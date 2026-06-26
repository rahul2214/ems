'use client';

import React, { useState, useEffect } from 'react';
import { useChronos, Project } from '../../../../../context/ChronosContext';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Briefcase, DollarSign, Globe, Calendar, Clock, Save, X } from 'lucide-react';

export default function AdminEditProject() {
  const { projects, handleUpdateProject } = useChronos();
  const router = useRouter();
  const params = useParams();
  const projectIdStr = params.id as string;
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Fields
  const [projCode, setProjCode] = useState('');
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStatus, setProjStatus] = useState('Active');
  const [projType, setProjType] = useState('Internal');
  const [projCountry, setProjCountry] = useState('India');
  const [projIsBillable, setProjIsBillable] = useState(true);
  const [projStartDate, setProjStartDate] = useState('');
  const [projEndDate, setProjEndDate] = useState('');
  const [projBudget, setProjBudget] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projects.length > 0 && projectIdStr) {
      const proj = projects.find(p => p.id.toString() === projectIdStr);
      if (proj) {
        setEditingProject(proj);
        setProjCode(proj.code);
        setProjName(proj.name);
        setProjDesc(proj.description || '');
        setProjStatus(proj.project_status || 'Active');
        setProjType(proj.project_type || 'Internal');
        setProjCountry(proj.country || 'India');
        setProjIsBillable(proj.is_billable ?? true);
        setProjStartDate(proj.start_date || '');
        setProjEndDate(proj.end_date || '');
        setProjBudget(proj.budget ? String(proj.budget) : '');
      }
      setIsLoading(false);
    }
  }, [projects, projectIdStr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!projName.trim()) {
      alert("Project name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await handleUpdateProject(editingProject.id, {
        code: editingProject.code,
        name: projName.trim(),
        description: projDesc.trim(),
        members: editingProject.members || [], // Preserve existing members!
        project_status: projStatus,
        project_type: projType,
        country: projCountry,
        is_billable: projIsBillable,
        start_date: projStartDate || undefined,
        end_date: projEndDate || undefined,
        budget: projBudget ? Number(projBudget) : undefined
      });
      router.push('/admin/projects');
    } catch (error) {
      console.error(error);
      alert('Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading project details...</div>;
  }

  if (!editingProject) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <h2>Project Not Found</h2>
        <button onClick={() => router.push('/admin/projects')} style={{ marginTop: '16px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #e2e8f0' }}>Back to Projects</button>
      </div>
    );
  }

  return (
    <div className="content-view active-view" style={{ padding: '0px', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={() => router.push('/admin/projects')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-dark)' }}>Edit Project</h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Update project details and settings.</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="glassmorphism" style={{ background: '#ffffff', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Project Code */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Hash size={14} color="var(--primary)" /> Project Code (Locked)
              </label>
              <input
                type="text"
                disabled
                value={projCode}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', fontSize: '14px', color: '#64748b',
                  background: '#f8fafc', outline: 'none', cursor: 'not-allowed'
                }}
              />
            </div>

            {/* Project Name */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                Project Name <span style={{color: '#ef4444'}}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Operations Upgrade"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', fontSize: '14px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                required
              />
            </div>

            {/* Project Type */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Briefcase size={14} color="#64748b" /> Project Type
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={projType}
                  onChange={(e) => setProjType(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '12px', appearance: 'none',
                    border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '14px', cursor: 'pointer', outline: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <option value="Internal">Internal</option>
                  <option value="T&M">T&amp;M</option>
                  <option value="Fixed Price">Fixed Price</option>
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>▼</div>
              </div>
            </div>

            {/* Status */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Clock size={14} color="#64748b" /> Status
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={projStatus}
                  onChange={(e) => setProjStatus(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '12px', appearance: 'none',
                    border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '14px', cursor: 'pointer', outline: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>▼</div>
              </div>
            </div>

            {/* Country */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Globe size={14} color="#64748b" /> Location / Country
              </label>
              <input
                type="text"
                placeholder="e.g. India"
                value={projCountry}
                onChange={(e) => setProjCountry(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Billing Setup */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <DollarSign size={14} color="#64748b" /> Billing Setup
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={projIsBillable ? "true" : "false"}
                  onChange={(e) => setProjIsBillable(e.target.value === "true")}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '12px', appearance: 'none',
                    border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '14px', cursor: 'pointer', outline: 'none', transition: 'all 0.2s'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <option value="true">Billable</option>
                  <option value="false">Non-Billable</option>
                </select>
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>▼</div>
              </div>
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Calendar size={14} color="#64748b" /> Start Date
              </label>
              <input
                type="date"
                value={projStartDate}
                onChange={(e) => setProjStartDate(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', fontSize: '14px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Target End Date */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Calendar size={14} color="#64748b" /> Target End Date
              </label>
              <input
                type="date"
                value={projEndDate}
                onChange={(e) => setProjEndDate(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', fontSize: '14px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
            
            {/* Budget */}
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <DollarSign size={14} color="#64748b" /> Project Budget ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={projBudget}
                onChange={(e) => setProjBudget(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', fontSize: '14px', color: 'var(--text-main)', outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Description */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>Project Description</label>
              <textarea
                placeholder="Outline the project scope, deliverables, and any critical details..."
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                rows={4}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', fontSize: '14px', color: 'var(--text-main)',
                  resize: 'vertical', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s'
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
              style={{
                background: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '12px',
                padding: '12px 28px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
                color: '#ffffff', border: 'none', borderRadius: '12px',
                padding: '12px 36px', fontSize: '14px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseEnter={(e) => { if(!isSubmitting) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.4)'; } }}
              onMouseLeave={(e) => { if(!isSubmitting) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)'; } }}
            >
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Hash icon component
const Hash = ({ size, color, style }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);
