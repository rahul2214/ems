'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  UserPlus, Trash2, Edit2
} from 'lucide-react';
import { useChronos, UserProfile } from '../../../context/ChronosContext';

export default function AdminEmployees() {
  const router = useRouter();
  const {
    employees,
    allClockStates,
    getInitials,
    handleDeleteEmployee
  } = useChronos();

  return (
    <div className="content-view active-view">
      <div className="directory-header-row flex-row flex-between">
        <div>
          <h3>Employee Staff Directory</h3>
          <p className="section-subtitle">Manage company access, job descriptions, and view stats</p>
        </div>
        <button
          onClick={() => router.push('/admin/employees/add')}
          className="add-emp-btn glow-button"
        >
          <UserPlus style={{ width: '16px', height: '16px', display: 'inline', marginRight: '6px' }} />
          <span>Add New Employee</span>
        </button>
      </div>

      <div className="directory-container glassmorphism mt-4">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role / Department</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const active = allClockStates[emp.id]?.is_clocked_in;

                return (
                  <tr key={emp.id}>
                    <td>
                      <div className="employee-info-cell">
                        <div className="directory-avatar">{getInitials(emp.name)}</div>
                        <h5>{emp.name}</h5>
                      </div>
                    </td>
                    <td>{emp.email}</td>
                    <td>
                      <div>
                        <strong>{emp.role}</strong>
                      </div>
                      <div className="text-sm text-muted">{emp.department}</div>
                    </td>
                    <td>
                      <span className="text-muted font-medium">{emp.designation || 'N/A'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button
                          onClick={() => router.push(`/admin/employees/edit/${emp.id}`)}
                          className="action-btn"
                          title="Edit Account"
                          style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: 'var(--primary)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit2 style={{ width: '16px', height: '16px' }} />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp.id)}
                          className="action-btn reject"
                          title="Delete Account"
                        >
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted" style={{ textAlign: 'center' }}>
                    No employees registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
