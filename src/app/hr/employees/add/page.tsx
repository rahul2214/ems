'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useChronos } from '@/context/ChronosContext';
import { User, Mail, Building2, Shield, KeyRound, UserCheck, ArrowLeft } from 'lucide-react';

export default function HRAddEmployee() {
  const router = useRouter();
  const {
    newEmpName, setNewEmpName,
    newEmpEmail, setNewEmpEmail,
    newEmpRole, setNewEmpRole,
    newEmpDept, setNewEmpDept,
    newEmpSystemRole, setNewEmpSystemRole,
    newEmpPassword, setNewEmpPassword,
    newEmpConfirmPassword, setNewEmpConfirmPassword,
    handleCreateEmployee
  } = useChronos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleCreateEmployee(e);
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
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Onboard New Personnel</h2>
        <p className="text-muted" style={{ marginBottom: '24px' }}>Fill in the details to register a new employee account.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <User style={{ width: '14px', height: '14px' }} /> Full Name
              </label>
              <input
                type="text" required placeholder="John Doe"
                value={newEmpName} onChange={e => setNewEmpName(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Mail style={{ width: '14px', height: '14px' }} /> Email Address
              </label>
              <input
                type="email" required placeholder="johndoe@company.com"
                value={newEmpEmail} onChange={e => setNewEmpEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Building2 style={{ width: '14px', height: '14px' }} /> Department
              </label>
              <select
                required value={newEmpDept} onChange={e => setNewEmpDept(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '14px', cursor: 'pointer' }}
              >
                <option value="">Select Dept</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="Sales and Marketing">Sales and Marketing</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Building2 style={{ width: '14px', height: '14px' }} /> Job Title / Designation
              </label>
              <input
                type="text" required placeholder="UI/UX Designer"
                value={newEmpRole} onChange={e => setNewEmpRole(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Shield style={{ width: '14px', height: '14px' }} /> System Access Role
              </label>
              <select
                required value={newEmpSystemRole} onChange={e => setNewEmpSystemRole(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '14px', cursor: 'pointer' }}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="hr">HR</option>
                <option value="intern">Intern</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <KeyRound style={{ width: '14px', height: '14px' }} /> Password
              </label>
              <input
                type="password" required placeholder="Min 6 characters" minLength={6}
                value={newEmpPassword} onChange={e => setNewEmpPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <KeyRound style={{ width: '14px', height: '14px' }} /> Confirm Password
              </label>
              <input
                type="password" required placeholder="Verify password" minLength={6}
                value={newEmpConfirmPassword} onChange={e => setNewEmpConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px' }}
              />
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
              <UserCheck style={{ width: '18px', height: '18px' }} />
              Register Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

