'use client';

import React, { useState } from 'react';
import { useChronos } from '../../../context/ChronosContext';
import { Calendar, AlertCircle, FilePlus } from 'lucide-react';

export default function EmployeeLeaves() {
  const { currentUser, leaves, handleApplyLeave } = useChronos();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('Annual');
  const [reason, setReason] = useState('');
  
  // Half Day State Hooks
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayPeriod, setHalfDayPeriod] = useState<'first_half' | 'second_half'>('first_half');

  if (!currentUser) return null;

  const userLeaves = leaves.filter(l => l.employee_id === currentUser.id);

  // Leave balances calculated by summing days_count instead of counting requests
  const approvedAnnual = userLeaves
    .filter(l => l.status === 'approved' && l.leave_type === 'Annual')
    .reduce((sum, l) => sum + (l.days_count || 1), 0);
  const approvedSick = userLeaves
    .filter(l => l.status === 'approved' && l.leave_type === 'Sick')
    .reduce((sum, l) => sum + (l.days_count || 1), 0);
  const approvedCasual = userLeaves
    .filter(l => l.status === 'approved' && l.leave_type === 'Casual')
    .reduce((sum, l) => sum + (l.days_count || 1), 0);

  const leaveBalances = {
    Annual: Math.max(0, 12 - approvedAnnual),
    Sick: Math.max(0, 8 - approvedSick),
    Casual: Math.max(0, 6 - approvedCasual)
  };

  const getDaysCount = () => {
    if (!startDate) return 0;
    if (isHalfDay) return 0.5;
    if (!endDate) return 0;
    
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffTime = e.getTime() - s.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };
  const daysApplied = getDaysCount();

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (isHalfDay) {
      setEndDate(val);
    }
  };

  const handleHalfDayToggle = (checked: boolean) => {
    setIsHalfDay(checked);
    if (checked && startDate) {
      setEndDate(startDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || (!isHalfDay && !endDate)) {
      alert("Please fill all required leave details.");
      return;
    }
    
    const finalEndDate = isHalfDay ? startDate : endDate;
    if (new Date(finalEndDate).getTime() < new Date(startDate).getTime()) {
      alert("End date cannot be before start date.");
      return;
    }

    await handleApplyLeave({
      employee_id: currentUser.id,
      start_date: startDate,
      end_date: finalEndDate,
      leave_type: leaveType,
      reason: reason,
      is_half_day: isHalfDay,
      half_day_period: isHalfDay ? halfDayPeriod : null,
      days_count: daysApplied
    });
    setStartDate('');
    setEndDate('');
    setReason('');
    setIsHalfDay(false);
    setHalfDayPeriod('first_half');
  };

  return (
    <div className="content-view active-view" style={{ padding: '0px' }}>
      
      {/* Leave Balances Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="stat-card glassmorphism">
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Annual Leave Balance</h4>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)' }}>{leaveBalances.Annual} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/ 12 days</span></p>
        </div>
        <div className="stat-card glassmorphism">
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Sick Leave Balance</h4>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--success)' }}>{leaveBalances.Sick} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/ 8 days</span></p>
        </div>
        <div className="stat-card glassmorphism">
          <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Casual Leave Balance</h4>
          <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--warning)' }}>{leaveBalances.Casual} <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/ 6 days</span></p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Leave Form */}
        <div style={{
          flex: '1',
          minWidth: '320px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FilePlus style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
            Request Time Off
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
              {/* Half Day Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <input
                  type="checkbox"
                  id="half-day"
                  checked={isHalfDay}
                  onChange={(e) => handleHalfDayToggle(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: 'var(--primary)'
                  }}
                />
                <label htmlFor="half-day" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                  Request Half Day
                </label>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {isHalfDay ? 'Leave Date' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    required
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px'
                    }}
                  />
                </div>

                {!isHalfDay ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Half Day Period</label>
                    <select
                      value={halfDayPeriod}
                      onChange={(e) => setHalfDayPeriod(e.target.value as 'first_half' | 'second_half')}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="first_half">First Half</option>
                      <option value="second_half">Second Half</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Leave Category</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <option value="Annual">Annual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Reason for request (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief description of the reason..."
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
            </div>

            {daysApplied > 0 && (
              <div style={{
                background: 'var(--primary-glow)',
                color: 'var(--primary)',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                textAlign: 'center',
                border: '1px solid var(--primary-light)',
                marginTop: '4px'
              }}>
                Applied for: {daysApplied} {daysApplied === 0.5 ? 'day' : (daysApplied === 1 ? 'day' : 'days')}
              </div>
            )}

            <button
              type="submit"
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px var(--primary-glow)',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Submit Application
            </button>
          </form>
        </div>

        {/* Requests List */}
        <div style={{
          flex: '2',
          minWidth: '400px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
            Leave History & Status
          </h3>

          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Duration</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Reason</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {userLeaves.map((lv, idx) => {
                  let statusBadgeColor = '#f59e0b'; // pending -> amber
                  if (lv.status === 'approved') statusBadgeColor = '#10b981'; // success -> emerald
                  if (lv.status === 'rejected') statusBadgeColor = '#ef4444'; // danger -> crimson

                  return (
                    <tr key={lv.id} style={{ borderBottom: idx === userLeaves.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-main)' }}>
                        <div style={{ fontWeight: 500 }}>
                          {new Date(lv.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {!lv.is_half_day && lv.end_date !== lv.start_date && (
                            <> - {new Date(lv.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                          )}
                          {(lv.is_half_day || lv.end_date === lv.start_date) && (
                            <>, {new Date(lv.start_date).getFullYear()}</>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {lv.is_half_day 
                            ? `0.5 day (${lv.half_day_period === 'first_half' ? 'First Half' : 'Second Half'})` 
                            : `${lv.days_count || 1} ${Number(lv.days_count || 1) === 1 ? 'day' : 'days'}`
                          }
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>
                        {lv.leave_type}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                        {lv.reason || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{
                          background: `${statusBadgeColor}15`,
                          color: statusBadgeColor,
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: `1px solid ${statusBadgeColor}20`,
                          textTransform: 'capitalize'
                        }}>
                          {lv.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {userLeaves.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dark)', fontSize: '13px' }}>
                      <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--text-dark)', margin: '0 auto 8px', display: 'block' }} />
                      No leaves submitted yet.
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
