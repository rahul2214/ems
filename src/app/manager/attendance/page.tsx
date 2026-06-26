'use client';

import React, { useState } from 'react';
import { useChronos } from '../../../context/ChronosContext';
import { Clock, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function ManagerAttendance() {
  const { currentUser, timesheets, employees, getInitials } = useChronos();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!currentUser) return null;

  // Filter team members
  const teamEmployees = employees.filter(emp => 
    emp.id !== currentUser.id &&
    emp.department === currentUser.department
  );

  const teamEmpIds = teamEmployees.map(e => e.id);

  // Filter team timesheets
  const teamLogs = timesheets.filter(ts => {
    if (!teamEmpIds.includes(ts.employee_id)) return false;

    const emp = teamEmployees.find(e => e.id === ts.employee_id);
    if (!emp) return false;

    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ts.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Sort logs by week start date descending
  const sortedLogs = [...teamLogs].sort((a, b) => new Date(b.week_start_date).getTime() - new Date(a.week_start_date).getTime());

  // Pagination calculations
  const totalRows = sortedLogs.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + rowsPerPage);

  const formatClockTime = (timeIso: string) => {
    if (!timeIso) return 'N/A';
    if (timeIso.includes('T')) {
      return new Date(timeIso).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    }
    return timeIso;
  };

  const getEmployeeName = (empId: number) => {
    const emp = teamEmployees.find(e => e.id === empId);
    return emp ? emp.name : 'Unknown';
  };

  const getEmployeeEmail = (empId: number) => {
    const emp = teamEmployees.find(e => e.id === empId);
    return emp ? emp.email : '';
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="content-view active-view" style={{ padding: '0px' }}>
      
      {/* Search panel */}
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
            placeholder="Search team member..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
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
      </div>

      {/* Attendance Logs Table */}
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
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Weekly Hours Grid</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Total Hours</th>
              <th style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>Logging Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((ts, idx) => {
              const name = getEmployeeName(ts.employee_id);
              const email = getEmployeeEmail(ts.employee_id);

              return (
                <tr key={ts.id} style={{ borderBottom: idx === paginatedLogs.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
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
                  <td style={{ padding: '16px 20px', color: 'var(--text-main)', fontSize: '14px' }}>
                    {ts.week_start_date ? new Date(ts.week_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
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
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {ts.hours.toFixed(1)} hrs
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '13px', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>{ts.project}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{ts.activity_name} ({ts.activity_type})</div>
                    <div>{ts.description}</div>
                  </td>
                </tr>
              );
            })}

            {paginatedLogs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '14px' }}>
                  <AlertCircle style={{ width: '24px', height: '24px', color: 'var(--text-dark)', margin: '0 auto 8px', display: 'block' }} />
                  No team attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Showing {totalRows > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows} records
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-main)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              <ChevronLeft style={{ width: '16px', height: '16px' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, marginLeft: '4px' }}>Previous</span>
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-main)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, marginRight: '4px' }}>Next</span>
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
