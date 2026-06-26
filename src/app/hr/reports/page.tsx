'use client';

import React, { useState } from 'react';
import { useChronos } from '../../../context/ChronosContext';
import { BarChart3, TrendingUp, Download, PieChart, Users, FileSpreadsheet } from 'lucide-react';

export default function HRReports() {
  const { employees, timesheets, leaves } = useChronos();
  const [reportType, setReportType] = useState<'productivity' | 'attendance' | 'leaves'>('productivity');

  const departments = ['HR', 'Engineering', 'Sales and Marketing', 'Finance'];

  // Calculations
  const getDeptEmployeeCount = (dept: string) => employees.filter(e => e.department === dept).length;
  
  const getDeptHoursWorked = (dept: string) => {
    const deptEmpIds = employees.filter(e => e.department === dept).map(e => e.id);
    return timesheets
      .filter(t => deptEmpIds.includes(t.employee_id) && t.status === 'approved')
      .reduce((sum, t) => sum + t.hours, 0);
  };

  const getDeptLeaveDays = (dept: string) => {
    const deptEmpIds = employees.filter(e => e.department === dept).map(e => e.id);
    return leaves
      .filter(l => deptEmpIds.includes(l.employee_id) && l.status === 'approved').length; // Mock day count is 1-to-1 with leave requests for simple metric
  };

  // Totals
  const totalEmployees = employees.length;
  const totalHours = timesheets.filter(t => t.status === 'approved').reduce((sum, t) => sum + t.hours, 0);
  const totalLeaves = leaves.filter(l => l.status === 'approved').length;

  const handleDownload = () => {
    alert(`Downloading Veltria_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="content-view active-view" style={{ padding: '0px' }}>
      
      {/* Overview stats panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="stat-card glassmorphism">
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users style={{ width: '16px', height: '16px', color: 'var(--primary)' }} /> Staff Count
          </h4>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>{totalEmployees} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Employees</span></p>
        </div>
        <div className="stat-card glassmorphism">
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--success)' }} /> Productive Time
          </h4>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--success)', margin: 0 }}>{totalHours.toFixed(1)} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Hours logged</span></p>
        </div>
        <div className="stat-card glassmorphism">
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart3 style={{ width: '16px', height: '16px', color: 'var(--warning)' }} /> Approved Leaves
          </h4>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--warning)', margin: 0 }}>{totalLeaves} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Approved requests</span></p>
        </div>
      </div>

      {/* Main reports grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Navigation / Selection Column */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Report Types</h4>
          <button
            onClick={() => setReportType('productivity')}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: reportType === 'productivity' ? '1.5px solid var(--primary-light)' : '1px solid #e2e8f0',
              background: reportType === 'productivity' ? 'var(--primary-glow)' : '#ffffff',
              color: reportType === 'productivity' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <TrendingUp style={{ width: '16px', height: '16px' }} />
            Productivity Metrics
          </button>
          <button
            onClick={() => setReportType('attendance')}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: reportType === 'attendance' ? '1.5px solid var(--primary-light)' : '1px solid #e2e8f0',
              background: reportType === 'attendance' ? 'var(--primary-glow)' : '#ffffff',
              color: reportType === 'attendance' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <PieChart style={{ width: '16px', height: '16px' }} />
            Personnel Allocation
          </button>
          <button
            onClick={() => setReportType('leaves')}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: reportType === 'leaves' ? '1.5px solid var(--primary-light)' : '1px solid #e2e8f0',
              background: reportType === 'leaves' ? 'var(--primary-glow)' : '#ffffff',
              color: reportType === 'leaves' ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <BarChart3 style={{ width: '16px', height: '16px' }} />
            Leave Outage Rates
          </button>
        </div>

        {/* Display Column */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', margin: 0, textTransform: 'capitalize' }}>
                Departmental {reportType} Report
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Summary analytics of active operations across organizational sectors.
              </p>
            </div>
            <button
              onClick={handleDownload}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Download style={{ width: '14px', height: '14px' }} />
              Export CSV Report
            </button>
          </div>

          {/* Productivity metrics representation */}
          {reportType === 'productivity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {departments.map(dept => {
                const hours = getDeptHoursWorked(dept);
                // Calculate percentage relative to total hours (max 100% or relative scale)
                const pct = totalHours > 0 ? (hours / totalHours) * 100 : 0;

                return (
                  <div key={dept} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-main)' }}>{dept} Department</span>
                      <span style={{ color: 'var(--primary)' }}>{hours.toFixed(1)} hours logged ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gradient-primary)', borderRadius: '5px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Allocation metrics representation */}
          {reportType === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {departments.map(dept => {
                const count = getDeptEmployeeCount(dept);
                const pct = totalEmployees > 0 ? (count / totalEmployees) * 100 : 0;

                return (
                  <div key={dept} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-main)' }}>{dept} Department</span>
                      <span style={{ color: 'var(--success)' }}>{count} Employees ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '5px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Leave outage rates representation */}
          {reportType === 'leaves' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {departments.map(dept => {
                const leavesCount = getDeptLeaveDays(dept);
                const pct = totalLeaves > 0 ? (leavesCount / totalLeaves) * 100 : 0;

                return (
                  <div key={dept} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-main)' }}>{dept} Department</span>
                      <span style={{ color: 'var(--warning)' }}>{leavesCount} Leave days took ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '5px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
