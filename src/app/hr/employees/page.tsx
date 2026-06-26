'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChronos, UserProfile } from '../../../context/ChronosContext';
import { UserPlus, Edit2, UserMinus, Shield, Briefcase, Mail, Search, X } from 'lucide-react';

export default function HREmployees() {
  const router = useRouter();
  const {
    employees,
    getInitials,
    handleDeleteEmployee
  } = useChronos();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const departments = ['HR', 'Engineering', 'Sales and Marketing', 'Finance'];
  const systemRoles = ['employee', 'manager', 'hr'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (emp.role || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="content-view active-view" style={{ padding: '0px' }}>
      
      {/* Header action panel */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>
            Onboard new employees, update active profiles, or offboard personnel.
          </p>
        </div>
        <button
          onClick={() => router.push('/hr/employees/add')}
          style={{
            background: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px var(--primary-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <UserPlus style={{ width: '18px', height: '18px' }} />
          Onboard Personnel
        </button>
      </div>

      {/* Filter panel */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        alignItems: 'center',
        background: '#ffffff',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.01)'
      }}>
        <div style={{
          position: 'relative',
          border: '1px solid rgba(226, 232, 240, 1)',
          borderRadius: '12px',
          padding: '10px 16px 10px 40px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          width: '280px'
        }}>
          <Search style={{
            position: 'absolute',
            left: '14px',
            color: 'var(--text-muted)',
            width: '16px',
            height: '16px'
          }} />
          <input
            type="text"
            placeholder="Search by name, role or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontSize: '14px',
              color: 'var(--text-main)',
              fontWeight: 500
            }}
          />
        </div>

        <div style={{
          position: 'relative',
          border: '1px solid rgba(226, 232, 240, 1)',
          borderRadius: '12px',
          padding: '10px 16px',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          width: '220px'
        }}>
          <span style={{
            position: 'absolute',
            top: '-8px',
            left: '12px',
            background: '#ffffff',
            padding: '0 4px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontWeight: 500
          }}>Department</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontSize: '14px',
              color: 'var(--text-main)',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {(searchQuery || deptFilter !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setDeptFilter('All');
            }}
            style={{
              background: '#f1f5f9',
              color: 'var(--text-main)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Directory Table */}
      <div className="table-container" style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Employee</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Department & Team</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Designation</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>System Access Level</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, idx) => {
              const sysRole = (emp.role || '').toLowerCase();
              let accessLevel = 'Employee';
              let accessBadgeColor = '#4f46e5'; // indigo
              
              if (sysRole === 'hr') {
                accessLevel = 'HR Manager';
                accessBadgeColor = '#06b6d4'; // cyan
              } else if (sysRole === 'manager') {
                accessLevel = 'Manager';
                accessBadgeColor = '#f59e0b'; // amber
              } else if (sysRole === 'admin') {
                accessLevel = 'Administrator';
                accessBadgeColor = '#ef4444'; // crimson
              } else if (sysRole === 'intern') {
                accessLevel = 'Intern';
                accessBadgeColor = '#10b981'; // emerald
              }

              return (
                <tr key={emp.id} style={{ borderBottom: idx === filteredEmployees.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="directory-avatar" style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        color: '#ffffff',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)'
                      }}>
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{emp.name}</h5>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{emp.department || 'N/A'}</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    {emp.designation || 'N/A'}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px' }}>
                    <span style={{
                      background: `${accessBadgeColor}15`,
                      color: accessBadgeColor,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: `1px solid ${accessBadgeColor}30`
                    }}>
                      {accessLevel}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                        onClick={() => router.push(`/hr/employees/edit/${emp.id}`)}
                        style={{
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: 'var(--primary)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit2 style={{ width: '12px', height: '12px' }} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <UserMinus style={{ width: '12px', height: '12px' }} />
                        Offboard
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '14px' }}>
                  No employee profiles found matching current search/filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          fontSize: '13px',
          color: 'var(--text-muted)',
          textAlign: 'right',
          fontWeight: 500,
          background: '#ffffff'
        }}>
          Showing {filteredEmployees.length} employee records
        </div>
      </div>

    </div>
  );
}
