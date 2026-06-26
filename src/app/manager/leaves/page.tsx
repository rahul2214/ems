'use client';

import React, { useState } from 'react';
import { useChronos } from '../../../context/ChronosContext';
import { Calendar, Check, X, AlertCircle } from 'lucide-react';

export default function ManagerLeaves() {
  const { currentUser, leaves, employees, handleApproveLeave, getInitials } = useChronos();
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  if (!currentUser) return null;

  // Filter team members
  const teamEmployees = employees.filter(emp => 
    emp.id !== currentUser.id &&
    emp.department === currentUser.department
  );

  const teamEmpIds = teamEmployees.map(e => e.id);

  // Filter team leaves
  const teamLeaves = leaves.filter(lv => 
    teamEmpIds.includes(lv.employee_id) && 
    lv.status === statusFilter
  );

  const getEmployeeName = (empId: number) => {
    const emp = teamEmployees.find(e => e.id === empId);
    return emp ? emp.name : 'Unknown Employee';
  };

  const getEmployeeEmail = (empId: number) => {
    const emp = teamEmployees.find(e => e.id === empId);
    return emp ? emp.email : '';
  };

  return (
    <div className="content-view active-view" style={{ padding: '0px' }}>
      
      {/* Tab Selectors */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['pending', 'approved', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: statusFilter === status ? '1.5px solid var(--primary-light)' : '1px solid #e2e8f0',
              background: statusFilter === status ? 'var(--primary-glow)' : '#ffffff',
              color: statusFilter === status ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s'
            }}
          >
            {status} Requests
          </button>
        ))}
      </div>

      {/* Leaves approvals list */}
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
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Leave Period</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Leave Type</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Reason</th>
              {statusFilter === 'pending' ? (
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, textAlign: 'center', width: '200px' }}>Actions</th>
              ) : (
                <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>Status</th>
              )}
            </tr>
          </thead>
          <tbody>
            {teamLeaves.map((lv, idx) => {
              const name = getEmployeeName(lv.employee_id);
              const email = getEmployeeEmail(lv.employee_id);

              let statusColor = '#f59e0b'; // pending
              if (lv.status === 'approved') statusColor = '#10b981';
              if (lv.status === 'rejected') statusColor = '#ef4444';

              return (
                <tr key={lv.id} style={{ borderBottom: idx === teamLeaves.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
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
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.15)',
                        flexShrink: 0
                      }}>
                        {getInitials(name)}
                      </div>
                      <div>
                        <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{name}</h5>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px', fontWeight: 500 }}>
                    <div>
                      {new Date(lv.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      to {new Date(lv.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, marginTop: '4px' }}>
                      {lv.is_half_day 
                        ? `0.5 day (${lv.half_day_period === 'first_half' ? '1st Half' : '2nd Half'})` 
                        : `${lv.days_count || 1} ${Number(lv.days_count || 1) === 1 ? 'day' : 'days'}`
                      }
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px', fontWeight: 600 }}>
                    {lv.leave_type} Leave
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {lv.reason || '—'}
                  </td>
                  {statusFilter === 'pending' ? (
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleApproveLeave(lv.id, 'approved')}
                          style={{
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)'
                          }}
                        >
                          <Check style={{ width: '12px', height: '12px' }} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveLeave(lv.id, 'rejected')}
                          style={{
                            background: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)'
                          }}
                        >
                          <X style={{ width: '12px', height: '12px' }} />
                          Reject
                        </button>
                      </div>
                    </td>
                  ) : (
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <span style={{
                        background: `${statusColor}15`,
                        color: statusColor,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: `1px solid ${statusColor}30`,
                        textTransform: 'capitalize'
                      }}>
                        {lv.status}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}

            {teamLeaves.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '14px' }}>
                  <AlertCircle style={{ width: '24px', height: '24px', color: 'var(--text-dark)', margin: '0 auto 8px', display: 'block' }} />
                  No leave requests in this queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
