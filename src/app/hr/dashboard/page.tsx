'use client';

import React, { useState } from 'react';
import { useChronos } from '../../../context/ChronosContext';
import { 
  Users, Building, ShieldAlert, Search, Play, CalendarDays,
  Check, X, AlertCircle
} from 'lucide-react';

export default function HRDashboard() {
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

  const [activeTab, setActiveTab] = useState<'directory' | 'tracker' | 'leaves' | 'timesheets'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  if (!currentUser) return null;

  // Calculate stats
  const totalEmployees = employees.length;
  
  const uniqueDepartments = Array.from(new Set(employees.map(e => e.department || 'N/A')));
  
  // Count by role type
  const hrCount = employees.filter(e => (e.role || '').toLowerCase() === 'hr').length;
  const managerCount = employees.filter(e => (e.role || '').toLowerCase() === 'manager').length;
  const employeeCount = totalEmployees - hrCount - managerCount;

  const hrClockedInCount = employees.filter(emp => {
    const stateObj = allClockStates[emp.id];
    return stateObj && stateObj.is_clocked_in;
  }).length;

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const pendingTimesheets = timesheets.filter(t => t.status === 'submitted');

  // Filter employee directory list
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (emp.role || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    
    return matchesSearch && matchesDept;
  });

  const getEmployeeName = (empId: number) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? emp.name : 'Unknown Employee';
  };

  const getEmployeeEmail = (empId: number) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? emp.email : '';
  };

  const getEmployeeDeptTeam = (empId: number) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? emp.department || 'N/A' : 'N/A';
  };

  return (
    <div className="content-view active-view" style={{ padding: '0px' }}>
      
      {/* Overview Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        
        {/* Total Directory Size */}
        <div className="stat-card glassmorphism hover-tilt">
          <div className="stat-icon-wrapper color-indigo">
            <Users />
          </div>
          <div className="stat-info">
            <h3>Directory Size</h3>
            <p className="stat-value">{totalEmployees}</p>
            <span className="stat-subtext text-muted">
              {employeeCount} Staff Employees
            </span>
          </div>
        </div>

        {/* Clocked In Now */}
        <div className="stat-card glassmorphism hover-tilt">
          <div className="stat-icon-wrapper color-emerald">
            <Play />
          </div>
          <div className="stat-info">
            <h3>Active Now</h3>
            <p className="stat-value">{hrClockedInCount}</p>
            <span className="stat-subtext text-success">
              Clocked in company-wide
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
              Awaiting review
            </span>
          </div>
        </div>

        {/* Pending Timesheets */}
        <div className="stat-card glassmorphism hover-tilt">
          <div className="stat-icon-wrapper color-amber">
            <ShieldAlert />
          </div>
          <div className="stat-info">
            <h3>Pending Timesheets</h3>
            <p className="stat-value">{pendingTimesheets.length}</p>
            <span className="stat-subtext text-warning">
              Awaiting approvals
            </span>
          </div>
        </div>

        {/* Total Departments */}
        <div className="stat-card glassmorphism hover-tilt">
          <div className="stat-icon-wrapper color-emerald">
            <Building />
          </div>
          <div className="stat-info">
            <h3>Departments</h3>
            <p className="stat-value">{uniqueDepartments.length}</p>
            <span className="stat-subtext text-success">
              Active operating sectors
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #cbd5e1', paddingBottom: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('directory')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: activeTab === 'directory' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'directory' ? '#ffffff' : 'var(--text-muted)',
              transition: 'background-color 0.2s, color 0.2s'
            }}
          >
            Personnel Directory
          </button>
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
              transition: 'background-color 0.2s, color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Live Company Tracker
            {hrClockedInCount > 0 && (
              <span style={{ fontSize: '11px', background: '#2ecc71', color: '#ffffff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {hrClockedInCount}
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
            Leave Queue
            {pendingLeaves.length > 0 && (
              <span style={{ fontSize: '11px', background: '#ef4444', color: '#ffffff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pendingLeaves.length}
              </span>
            )}
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
            Timesheet Queue
            {pendingTimesheets.length > 0 && (
              <span style={{ fontSize: '11px', background: '#ef4444', color: '#ffffff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pendingTimesheets.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'directory' && (
        <div>
          {/* Filter Controls Panel */}
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
            {/* Search Field */}
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

            {/* Department Filter Selector */}
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
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Clear Button */}
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Directory List Container */}
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
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Department</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Job Title / Role</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>System Access Level</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Date Registered</th>
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
                      <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px', fontWeight: 500 }}>
                        {emp.department || 'N/A'}
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        {emp.role || 'N/A'}
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
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        {emp.created_at ? new Date(emp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>
                    </tr>
                  );
                })}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '14px' }}>
                      No employees matching the search filter query.
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
              Showing {filteredEmployees.length} of {totalEmployees} employee profiles
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tracker' && (
        <div>
          <div className="widget-header flex-row flex-between" style={{ marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>Real-Time Company-Wide Shift Tracker</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>Live status feed of clocked-in employees across all departments</p>
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
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Role / Department</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Work Location</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => {
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
                    <tr key={emp.id} style={{ borderBottom: idx === employees.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
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
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        {emp.role} <span style={{ fontSize: '12px' }}>({emp.department})</span>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px' }}>
                        {active ? (stateObj.project || 'Office') : '-'}
                      </td>
                    </tr>
                  );
                })}

                {employees.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dark)' }}>
                      No employees registered.
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
            Global Leave Requests Queue
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
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Department</th>
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
                  const dept = getEmployeeDeptTeam(lv.employee_id);

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
                        {dept}
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
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', maxWidth: '240px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
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
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '14px' }}>
                      <AlertCircle style={{ width: '24px', height: '24px', color: 'var(--text-dark)', margin: '0 auto 8px', display: 'block' }} />
                      No pending leave requests found.
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
            Global Timesheet Queue
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
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Department</th>
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
                  const dept = getEmployeeDeptTeam(ts.employee_id);

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
                        {dept}
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
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '14px' }}>
                      <AlertCircle style={{ width: '24px', height: '24px', color: 'var(--text-dark)', margin: '0 auto 8px', display: 'block' }} />
                      No pending timesheets found.
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
