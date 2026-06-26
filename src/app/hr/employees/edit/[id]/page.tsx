'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useChronos } from '@/context/ChronosContext';
import { User, Mail, Building2, Edit2, ArrowLeft } from 'lucide-react';

export default function HREditEmployee() {
  const router = useRouter();
  const params = useParams();
  const { employees, handleUpdateEmployee } = useChronos();

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editDept, setEditDept] = useState('');

  const departments = ['Engineering', 'Design', 'Marketing', 'Operations', 'HR', 'Sales and Marketing', 'Finance'];

  useEffect(() => {
    if (employees.length > 0 && params?.id) {
      const empId = Number(params.id);
      const emp = employees.find(e => e.id === empId);
      if (emp) {
        setEditName(emp.name || '');
        setEditEmail(emp.email || '');
        setEditRole(emp.role || '');
        setEditDesignation(emp.designation || '');
        setEditDept(emp.department || 'Engineering');
      }
    }
  }, [employees, params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params?.id) return;
    
    if (!editName || !editEmail || !editRole || !editDept) {
      alert('Please fill out all required fields.');
      return;
    }
    
    const success = await handleUpdateEmployee(Number(params.id), {
      name: editName,
      email: editEmail,
      role: editRole,
      designation: editDesignation,
      department: editDept
    });

    if (success) {
      router.push('/hr/employees');
    }
  };

  return (
    <div className="content-view active-view" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 0' }}>
      <button 
        onClick={() => router.push('/hr/employees')}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none',
          color: 'var(--text-muted)', cursor: 'pointer',
          fontSize: '14px', fontWeight: 600, marginBottom: '24px',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to Directory
      </button>

      <div className="glassmorphism" style={{ padding: '32px', borderRadius: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Edit Employee Details</h2>
        <p className="text-muted" style={{ marginBottom: '24px' }}>Update the profile information for this employee.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <User style={{ width: '14px', height: '14px' }} /> Full Name
              </label>
              <input
                type="text" required
                value={editName} onChange={e => setEditName(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Mail style={{ width: '14px', height: '14px' }} /> Email Address
              </label>
              <input
                type="email" required
                value={editEmail} onChange={e => setEditEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Building2 style={{ width: '14px', height: '14px' }} /> Department
              </label>
              <select
                required value={editDept} onChange={e => setEditDept(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '14px', cursor: 'pointer' }}
              >
                <option value="">Select Dept</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Building2 style={{ width: '14px', height: '14px' }} /> Designation
              </label>
              <input
                type="text" required placeholder="e.g. Senior Developer"
                value={editDesignation} onChange={e => setEditDesignation(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Edit2 style={{ width: '14px', height: '14px' }} /> System Access Role
              </label>
              <select
                required value={editRole} onChange={e => setEditRole(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '14px', cursor: 'pointer' }}
              >
                <option value="" disabled>Select Role</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
                <option value="intern">Intern</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
            <button 
              type="button" 
              onClick={() => router.push('/hr/employees')}
              style={{
                background: '#f1f5f9', color: '#475569', border: 'none',
                borderRadius: '10px', padding: '12px 24px', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{
                background: 'var(--primary)', color: '#ffffff', border: 'none',
                borderRadius: '10px', padding: '12px 24px', fontSize: '14px',
                fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px var(--primary-glow)',
                display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Edit2 style={{ width: '18px', height: '18px' }} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

