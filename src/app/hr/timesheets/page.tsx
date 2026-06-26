'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Trash2, PlusCircle, Calendar, Briefcase, User, Info, CheckSquare, Save } from 'lucide-react';
import { useChronos } from '../../../context/ChronosContext';

export default function HrTimesheets() {
  const router = useRouter();
  const {
    currentUser,
    tsWeek,
    setTsWeek,
    tsMasterCode,
    setTsMasterCode,
    tsManager,
    setTsManager,
    tsRole,
    setTsRole,
    isTsLoaded,
    tsStatus,
    activities,
    activityRows,
    projects,
    addActivityRow,
    removeActivityRow,
    updateActivityRowField,
    handleLoadActivities,
    handleResetTimesheet,
    handleSaveTimesheetDraft,
    handleSubmitTimesheet
  } = useChronos();

  if (!currentUser) return null;



  const validProjects = projects.filter(proj => {
    if (!tsWeek || !proj.start_date || !proj.end_date) return true;
    return tsWeek >= proj.start_date && tsWeek <= proj.end_date;
  });

  const selectedProjectObj = projects.find(p => p.code === tsMasterCode);
  
  const MANAGER_OPTIONS = [
    { id: 'admin', name: 'System Admin' }
  ];

  const ROLE_OPTIONS = selectedProjectObj 
    ? (selectedProjectObj.members || [])
        .filter(m => m.employee_id === currentUser.id)
        .map(m => m.role)
    : [];

  return (
    <div className="content-view active-view" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
    

        {/* 2. Top filters row (4 columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="form-group">
            <label><Calendar style={{ width: '14px', height: '14px' }} /> Week *</label>
            <input
              type="date"
              value={tsWeek}
              onChange={(e) => setTsWeek(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label><Briefcase style={{ width: '14px', height: '14px' }} /> Master Project Code *</label>
            <select
              value={tsMasterCode}
              onChange={(e) => setTsMasterCode(e.target.value)}
              disabled={!tsWeek}
              required
            >
              <option value="">Select Project Code</option>
              {validProjects.map(proj => (
                <option key={proj.code} value={proj.code}>{proj.code} - {proj.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label><User style={{ width: '14px', height: '14px' }} /> Manager *</label>
            <select
              value={tsManager}
              onChange={(e) => setTsManager(e.target.value)}
              disabled={!tsWeek}
              required
            >
              <option value="">Select Manager</option>
              {MANAGER_OPTIONS.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label><Info style={{ width: '14px', height: '14px' }} /> Status</label>
            <input
              type="text"
              value={tsStatus}
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
              readOnly
            />
          </div>
        </div>

        {/* 3. Operations Row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '0 0 200px', marginBottom: 0 }}>
            <label><Briefcase style={{ width: '14px', height: '14px' }} /> Role *</label>
            <select
              value={tsRole}
              onChange={(e) => setTsRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              {ROLE_OPTIONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', height: '46px' }}>
            <button onClick={handleLoadActivities} className="glow-button" style={{ padding: '0 24px', borderRadius: 'var(--radius-sm)' }}>
              LOAD
            </button>
            <button onClick={handleResetTimesheet} style={{ padding: '0 24px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              RESET
            </button>
          </div>
        </div>

        {/* 4. Reactive Project details panel */}
        {tsMasterCode && (
          <div className="glassmorphism" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Project Details</span>
                <div style={{ display: 'flex', gap: '24px', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Master Project Code</span>
                    <div style={{ fontWeight: 700, marginTop: '2px' }}>{tsMasterCode}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Project Name</span>
                    <div style={{ fontWeight: 700, marginTop: '2px' }}>{projects.find(p => p.code === tsMasterCode)?.name || 'Project Workspace'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Description</span>
                    <div style={{ fontWeight: 700, marginTop: '2px' }}>{projects.find(p => p.code === tsMasterCode)?.description || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isTsLoaded && (
          <>
        {/* 5. Dynamic Activity Table */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 600 }}>Weekly Work Details</h4>
          <button 
            onClick={addActivityRow} 
            disabled={tsStatus === 'Approved'}
            className="glow-button" 
            style={{ 
              background: 'var(--primary)', 
              padding: '10px 16px', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: '13px',
              opacity: tsStatus === 'Approved' ? 0.5 : 1,
              cursor: tsStatus === 'Approved' ? 'not-allowed' : 'pointer'
            }}
          >
            <PlusCircle style={{ width: '15px', height: '15px' }} /> Add Activity Row
          </button>
        </div>

        <div className="table-container" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          <table style={{ minWidth: '950px' }}>
            <thead>
              <tr>
                <th style={{ width: '70px', textAlign: 'center' }}>Action</th>
                <th style={{ width: '220px' }}>Activity</th>
                <th style={{ width: '55px', textAlign: 'center' }}>Mon</th>
                <th style={{ width: '55px', textAlign: 'center' }}>Tue</th>
                <th style={{ width: '55px', textAlign: 'center' }}>Wed</th>
                <th style={{ width: '55px', textAlign: 'center' }}>Thu</th>
                <th style={{ width: '55px', textAlign: 'center' }}>Fri</th>
                <th style={{ width: '55px', textAlign: 'center' }}>Sat</th>
                <th style={{ width: '55px', textAlign: 'center' }}>Sun</th>
                <th>Work Comment</th>
              </tr>
            </thead>
            <tbody>
              {activityRows.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No activities added. Click "Add Activity Row" to begin.
                  </td>
                </tr>
              )}
              {activityRows.map((row, idx) => (
                <tr key={row.id}>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => removeActivityRow(row.id)}
                      disabled={tsStatus === 'Approved'}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--danger)', 
                        cursor: tsStatus === 'Approved' ? 'not-allowed' : 'pointer', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: '6px', 
                        borderRadius: '50%', 
                        transition: 'background-color 0.2s',
                        opacity: tsStatus === 'Approved' ? 0.5 : 1
                      }}
                      onMouseEnter={(e) => { if(tsStatus !== 'Approved') e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
                      onMouseLeave={(e) => { if(tsStatus !== 'Approved') e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </td>
                  <td>
                    <select
                      value={row.activityId || ''}
                      onChange={(e) => updateActivityRowField(row.id, 'activityId', e.target.value)}
                      style={{ padding: '8px 10px' }}
                      disabled={tsStatus === 'Approved'}
                    >
                      <option value="" disabled>Select Activity</option>
                      {activities.map(act => (
                        <option key={act.id} value={act.id}>{act.name}</option>
                      ))}
                    </select>
                  </td>
                  {[0, 1, 2, 3, 4, 5, 6].map(dayIdx => (
                    <td key={dayIdx} style={{ padding: '8px 4px' }}>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={row.hours[dayIdx]}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newHrs = [...row.hours];
                          if (val !== '') {
                            const num = Number(val);
                            if (num > 24) {
                              newHrs[dayIdx] = '24';
                            } else if (num < 0) {
                              newHrs[dayIdx] = '0';
                            } else {
                              newHrs[dayIdx] = val;
                            }
                          } else {
                            newHrs[dayIdx] = '';
                          }
                          updateActivityRowField(row.id, 'hours', newHrs);
                        }}
                        style={{ padding: '8px 4px', textAlign: 'center' }}
                        placeholder="-"
                        disabled={tsStatus === 'Approved'}
                      />
                    </td>
                  ))}
                  <td>
                    <textarea
                      value={row.comment}
                      onChange={(e) => updateActivityRowField(row.id, 'comment', e.target.value)}
                      placeholder="Comment..."
                      style={{ padding: '8px 12px', minHeight: '38px', resize: 'vertical' }}
                      rows={1}
                      disabled={tsStatus === 'Approved'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 6. Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <button
            onClick={handleSaveTimesheetDraft}
            disabled={tsStatus === 'Approved'}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: 'transparent', border: '1px solid var(--border-hover)', 
              color: 'var(--text-main)', padding: '12px 24px', borderRadius: 'var(--radius-sm)', 
              fontWeight: 600, 
              cursor: tsStatus === 'Approved' ? 'not-allowed' : 'pointer', 
              transition: 'all 0.2s',
              opacity: tsStatus === 'Approved' ? 0.5 : 1
            }}
            onMouseEnter={(e) => { if (tsStatus !== 'Approved') e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; }}
            onMouseLeave={(e) => { if (tsStatus !== 'Approved') e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Save style={{ width: '16px', height: '16px' }} /> Save Draft
          </button>
          <button 
            onClick={handleSubmitTimesheet} 
            disabled={tsStatus === 'Approved'}
            className="glow-button" 
            style={{ 
              padding: '0 24px', height: '46px', borderRadius: 'var(--radius-sm)',
              opacity: tsStatus === 'Approved' ? 0.5 : 1,
              cursor: tsStatus === 'Approved' ? 'not-allowed' : 'pointer'
            }}
          >
            <CheckSquare style={{ width: '16px', height: '16px' }} /> Submit Timesheet
          </button>
        </div>
        </>
        )}

      </div>
    </div>
  );
}
