'use client';

import React, { useState } from 'react';
import { useChronos } from '../../../context/ChronosContext';
import { 
  Users, Clock, CheckSquare, Check, X, AlertCircle, 
  CalendarDays, Play
} from 'lucide-react';

export default function ManagerDashboard() {
  const {
    currentUser,
    employees,
    timesheets,
    clockState,
    allClockStates,
    leaves,
    elapsedTime,
    handleClockToggle,
    handleProcessApproval,
    handleApproveLeave,
    getInitials,
    currentTime
  } = useChronos();

  const [activeTab, setActiveTab] = useState<'tracker' | 'timesheets' | 'leaves'>('tracker');

  if (!currentUser) return null;

  // Filter employees belonging to the manager's department
  const teamEmployees = employees.filter(emp => 
    emp.id !== currentUser.id &&
    emp.department === currentUser.department
  );

  const teamEmpIds = teamEmployees.map(e => e.id);

  // Filter timesheets where the manager is explicitly selected as the approver
  const teamTimesheets = timesheets.filter(t => t.approver_id === currentUser.id);

  // Filter leaves belonging to team employees
  const teamLeaves = leaves.filter(l => teamEmpIds.includes(l.employee_id));

  // Calculate statistics
  const teamSize = teamEmployees.length;

  const pendingTimesheets = teamTimesheets.filter(t => t.status === 'submitted');
  const pendingLeaves = teamLeaves.filter(l => l.status === 'pending');

  const teamClockedInCount = teamEmployees.filter(emp => {
    const stateObj = allClockStates[emp.id];
    return stateObj && stateObj.is_clocked_in;
  }).length;

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
      
      {/* Overview Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        
        {/* Team size */}
        <div className="stat-card glassmorphism hover-tilt">
          <div className="stat-icon-wrapper color-indigo">
            <Users />
          </div>
          <div className="stat-info">
            <h3>Team Size</h3>
            <p className="stat-value">{teamSize}</p>
            <span className="stat-subtext text-muted">
              {currentUser.department} department
            </span>
          </div>
        </div>

        {/* Pending Timesheets */}
        <div className="stat-card glassmorphism hover-tilt">
          <div className="stat-icon-wrapper color-amber">
            <CheckSquare />
          </div>
          <div className="stat-info">
            <h3>Pending Timesheets</h3>
            <p className="stat-value">{pendingTimesheets.length}</p>
            <span className="stat-subtext text-warning">
              Awaiting approvals
            </span>
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="stat-card glassmorphism hover-tilt">
          <div className="stat-icon-wrapper color-rose">
            <CalendarDays />
          </div>
          <div className="stat-info">
            <h3>Pending Leaves</h3>
            <p className="stat-value">{pendingLeaves.length}</p>
            <span className="stat-subtext text-danger">
              Leave requests queue
            </span>
          </div>
        </div>

       
      </div>

      {/* Tab Switched Content Sections */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('tracker')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: activeTab === 'tracker' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'tracker' ? '#ffffff' : 'var(--text-muted)',
              transition: 'background-color 0.2s, color 0.2s'
            }}
          >
            Real-Time Shift Tracker
          </button>
          <button
            onClick={() => setActiveTab('timesheets')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: activeTab === 'timesheets' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'timesheets' ? '#ffffff' : 'var(--text-muted)',
              transition: 'background-color 0.2s, color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Timesheet Approvals
            {pendingTimesheets.length > 0 && (
              <span style={{ fontSize: '11px', background: '#ef4444', color: '#ffffff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pendingTimesheets.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: activeTab === 'leaves' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'leaves' ? '#ffffff' : 'var(--text-muted)',
              transition: 'background-color 0.2s, color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Leave Approvals
            {pendingLeaves.length > 0 && (
              <span style={{ fontSize: '11px', background: '#ef4444', color: '#ffffff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pendingLeaves.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'tracker' && (
        <div>
          <div className="widget-header flex-row flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>Real-Time Department Shift Tracker</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Live status of department team members</p>
            </div>
            <span className="pulse-indicator-live" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="live-dot pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2ecc71', display: 'inline-block' }} /> Live System Feed
            </span>
          </div>

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
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Session Start</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Duration Today</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Work Location</th>
                </tr>
              </thead>
              <tbody>
                {teamEmployees.map((emp, idx) => {
                  const stateObj = allClockStates[emp.id];
                  const active = stateObj && stateObj.is_clocked_in;
                  let startStr = '--:--';
                  let diffStr = '--';

                  if (active) {
                    const startLocal = new Date(stateObj.start_time);
                    startStr = startLocal.toLocaleTimeString('en-US', {
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    });
                    const diffHrs = ((Date.now() - startLocal.getTime()) / 3600000).toFixed(2);
                    diffStr = `${diffHrs} hrs`;
                  }

                  return (
                    <tr key={emp.id} style={{ borderBottom: idx === teamEmployees.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
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
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{emp.name}</h5>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{emp.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: active ? '#10b98115' : '#64748b15',
                          color: active ? '#10b981' : '#64748b',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: active ? '1px solid #10b98130' : '1px solid #64748b30'
                        }}>
                          {active ? 'Active Duty' : 'Offline'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px', fontFamily: 'monospace' }}>{startStr}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px' }}>
                        <strong>{diffStr}</strong>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px' }}>
                        {active ? (stateObj.project || 'Office') : '-'}
                      </td>
                    </tr>
                  );
                })}

                {teamEmployees.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dark)' }}>
                      No employees registered in your department.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'timesheets' && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>
            Timesheet Approvals Queue
          </h3>

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
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Week Commencing</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Project / Activity</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Weekly Hours</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Description</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, textAlign: 'center', width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTimesheets.map((ts, idx) => {
                  const name = getEmployeeName(ts.employee_id);
                  const email = getEmployeeEmail(ts.employee_id);

                  return (
                    <tr key={ts.id} style={{ borderBottom: idx === pendingTimesheets.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
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
                        {ts.week_start_date ? new Date(ts.week_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px' }}>
                        <div style={{ fontWeight: 600 }}>{ts.project}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ts.activity_name} ({ts.activity_type})</div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', minWidth: '180px' }}>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>M</span>{ts.monday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>T</span>{ts.tuesday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>W</span>{ts.wednesday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>T</span>{ts.thursday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>F</span>{ts.friday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>S</span>{ts.saturday_hours}</div>
                          <div><span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '9px' }}>S</span>{ts.sunday_hours}</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px', fontWeight: 700 }}>
                        {ts.hours.toFixed(1)} hrs
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', maxWidth: '200px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {ts.description}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleProcessApproval(ts.id, 'approved')}
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
                              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)',
                              transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <Check style={{ width: '12px', height: '12px' }} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleProcessApproval(ts.id, 'rejected')}
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
                              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)',
                              transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <X style={{ width: '12px', height: '12px' }} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {pendingTimesheets.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '14px' }}>
                      <AlertCircle style={{ width: '24px', height: '24px', color: 'var(--text-dark)', margin: '0 auto 8px', display: 'block' }} />
                      No pending timesheet approvals in your team queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'leaves' && (
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '16px' }}>
            Leave Requests Queue
          </h3>

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
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Duration</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Reason</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, textAlign: 'center', width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map((lv, idx) => {
                  const name = getEmployeeName(lv.employee_id);
                  const email = getEmployeeEmail(lv.employee_id);

                  return (
                    <tr key={lv.id} style={{ borderBottom: idx === pendingLeaves.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
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
                        {lv.start_date ? new Date(lv.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'} - {lv.end_date ? new Date(lv.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px' }}>
                        <span style={{
                          background: '#4f46e510',
                          color: 'var(--primary)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: '1px solid #4f46e520'
                        }}>
                          {lv.leave_type}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px', fontWeight: 600 }}>
                        {lv.days_count || 1} {lv.days_count === 1 ? 'day' : 'days'}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', maxWidth: '280px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {lv.reason || '—'}
                      </td>
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
                              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)',
                              transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <Check style={{ width: '12px', height: '12px' }} />
                            <span>Approve</span>
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
                              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)',
                              transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <X style={{ width: '12px', height: '12px' }} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {pendingLeaves.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '14px' }}>
                      <AlertCircle style={{ width: '24px', height: '24px', color: 'var(--text-dark)', margin: '0 auto 8px', display: 'block' }} />
                      No pending leave requests in your team queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
