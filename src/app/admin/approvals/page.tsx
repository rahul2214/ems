'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { useChronos } from '../../../context/ChronosContext';

export default function AdminApprovals() {
  const {
    employees,
    timesheets,
    formatDateDisplay,
    handleProcessApproval
  } = useChronos();

  const adminPendingList = timesheets
    .filter(t => t.status === 'submitted' && !t.approver_id)
    .sort((a, b) => new Date(b.week_start_date).getTime() - new Date(a.week_start_date).getTime());

  const adminHistoryList = timesheets
    .filter(t => t.status !== 'submitted' && !t.approver_id)
    .sort((a, b) => new Date(b.processed_date || '').getTime() - new Date(a.processed_date || '').getTime())
    .slice(0, 6);

  return (
    <div className="content-view active-view">
      <div className="approvals-layout">
        {/* Pending Approvals Card */}
        <div className="approvals-card glassmorphism">
          <div className="card-header">
            <h3>Pending Approvals Queue</h3>
            <p>Review weekly timesheets logged by team members</p>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Week Commencing</th>
                  <th>Project / Activity</th>
                  <th>Weekly Hours Grid</th>
                  <th>Total Hours</th>
                  <th>Task Details</th>
                  <th className="actions-th">Action</th>
                </tr>
              </thead>
              <tbody>
                {adminPendingList.map(t => {
                  const emp = employees.find(e => e.id === t.employee_id) || {
                    name: 'Unknown User'
                  };
                  return (
                    <tr key={t.id}>
                      <td>
                        <strong>{emp.name}</strong>
                      </td>
                      <td>{t.week_start_date ? new Date(t.week_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{t.project}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.activity_name} ({t.activity_type})</div>
                      </td>
                      <td style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', minWidth: '160px' }}>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>M</span>{t.monday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>T</span>{t.tuesday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>W</span>{t.wednesday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>T</span>{t.thursday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>F</span>{t.friday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>S</span>{t.saturday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>S</span>{t.sunday_hours}</div>
                        </div>
                      </td>
                      <td>
                        <strong className="text-indigo">{t.hours.toFixed(1)} hrs</strong>
                      </td>
                      <td>
                        <span className="text-muted" title={t.description}>
                          {t.description.length > 50
                            ? t.description.substring(0, 47) + '...'
                            : t.description}
                        </span>
                      </td>
                      <td>
                        <div className="action-btn-group">
                          <button
                            onClick={() => handleProcessApproval(t.id, 'approved')}
                            className="action-btn approve"
                            title="Approve"
                          >
                            <Check style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            onClick={() => handleProcessApproval(t.id, 'rejected')}
                            className="action-btn reject"
                            title="Reject"
                          >
                            <X style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {adminPendingList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-muted" style={{ textAlign: 'center' }}>
                      No timesheets awaiting review.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Decided Approvals History Card */}
        <div className="approvals-card glassmorphism mt-6">
          <div className="card-header">
            <h3>Decided Approvals History</h3>
            <p>Historical log of approved or rejected timesheets</p>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Week Commencing</th>
                  <th>Project / Activity</th>
                  <th>Weekly Hours Breakdown</th>
                  <th>Hours</th>
                  <th>Processed Date</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {adminHistoryList.map(t => {
                  const emp = employees.find(e => e.id === t.employee_id) || {
                    name: 'Unknown User'
                  };
                  return (
                    <tr key={t.id}>
                      <td>{emp.name}</td>
                      <td>{t.week_start_date ? new Date(t.week_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{t.project}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.activity_name} ({t.activity_type})</div>
                      </td>
                      <td style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                        M:{t.monday_hours} T:{t.tuesday_hours} W:{t.wednesday_hours} T:{t.thursday_hours} F:{t.friday_hours} S:{t.saturday_hours} S:{t.sunday_hours}
                      </td>
                      <td>{t.hours.toFixed(1)} hrs</td>
                      <td>{formatDateDisplay(t.processed_date || '')}</td>
                      <td>
                        <span className={`badge badge-${t.status}`}>{t.status}</span>
                      </td>
                    </tr>
                  );
                })}
                {adminHistoryList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-muted" style={{ textAlign: 'center' }}>
                      No historical decisions found.
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
