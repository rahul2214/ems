'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Clock, LayoutDashboard, LogOut, Check, AlertTriangle, Info, Users, CalendarDays, BarChart3, Calendar, UserCheck, User
} from 'lucide-react';
import { useChronos } from '../../context/ChronosContext';

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    loading,
    sidebarOpen,
    toasts,
    clockState,
    getInitials,
    handleSignOut
  } = useChronos();

  React.useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.replace('/');
      } else {
        const role = (currentUser.role || '').toLowerCase();
        if (role !== 'hr') {
          if (role === 'admin') {
            router.replace('/admin/dashboard');
          } else if (role === 'manager') {
            router.replace('/manager/dashboard');
          } else {
            router.replace('/employee/dashboard');
          }
        }
      }
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="flex-center flex-col" style={{ minHeight: '100vh', gap: '16px' }}>
        <Clock className="logo-icon animate-spin text-indigo" style={{ width: '48px', height: '48px' }} />
        <h4 className="text-muted">Loading Human Resources Console...</h4>
      </div>
    );
  }

  if (!currentUser || (currentUser.role || '').toLowerCase() !== 'hr') {
    return null;
  }

  const getPageTitle = () => {
    if (pathname.includes('/hr/dashboard')) return 'HR Dashboard Overview';
    if (pathname.includes('/hr/employees')) return 'HR Personnel Onboarding & Offboarding';
    if (pathname.includes('/hr/leaves')) return 'HR Leaves Approval command';
    if (pathname.includes('/hr/attendance')) return 'HR Staff Attendance logs';
    if (pathname.includes('/hr/my-attendance')) return 'My Personal Attendance';
    if (pathname.includes('/hr/reports')) return 'HR Management Reports';
    if (pathname.includes('/hr/timesheets')) return 'HR Timesheet Submissions';
    return 'HR Workspace';
  };

  return (
    <div id="app-container">
      {/* Toast Notifications */}
      <div id="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <div className="toast-icon">
              {t.type === 'success' && <Check style={{ width: '16px', height: '16px' }} />}
              {t.type === 'error' && <AlertTriangle style={{ width: '16px', height: '16px' }} />}
              {t.type === 'info' && <Info style={{ width: '16px', height: '16px' }} />}
            </div>
            <p>{t.message}</p>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <span className="logo-text">Veltria</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link
            href="/hr/dashboard"
            className={`nav-item ${pathname === '/hr/dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard /> <span>Overview</span>
          </Link>
          <Link
            href="/hr/my-attendance"
            className={`nav-item ${pathname === '/hr/my-attendance' ? 'active' : ''}`}
          >
            <UserCheck /> <span>My Attendance</span>
          </Link>
          <Link
            href="/hr/employees"
            className={`nav-item ${pathname === '/hr/employees' ? 'active' : ''}`}
          >
            <Users /> <span>Employees</span>
          </Link>
          <Link
            href="/hr/leaves"
            className={`nav-item ${pathname === '/hr/leaves' ? 'active' : ''}`}
          >
            <CalendarDays /> <span>Leave Requests</span>
          </Link>
          <Link
            href="/hr/attendance"
            className={`nav-item ${pathname === '/hr/attendance' ? 'active' : ''}`}
          >
            <Clock /> <span>Attendance Logs</span>
          </Link>
          <Link
            href="/hr/timesheets"
            className={`nav-item ${pathname === '/hr/timesheets' ? 'active' : ''}`}
          >
            <Calendar /> <span>Log Hours</span>
          </Link>
          <Link
            href="/hr/reports"
            className={`nav-item ${pathname === '/hr/reports' ? 'active' : ''}`}
          >
            <BarChart3 /> <span>Reports</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">{getInitials(currentUser.name)}</div>
          <div className="user-details">
            <h4>{currentUser.name}</h4>
            <span>HR Manager</span>
          </div>
          <button id="logout-btn" onClick={handleSignOut} title="Sign Out">
            <LogOut style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <div className="app-body">
        <header className="app-header">
          <div className="header-left">
            <h2 className="view-title">{getPageTitle()}</h2>
          </div>
          <div className="header-right">
            {clockState?.is_clocked_in ? (
              <div className="pulse-indicator-live">
                <span className="live-dot pulse" /> Checked In
              </div>
            ) : (
              <div className="pulse-indicator-offline" style={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(148, 163, 184, 0.1)',
                color: 'var(--text-muted)',
                padding: '6px 14px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '20px',
                fontWeight: 600
              }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} /> Checked Out
              </div>
            )}
          </div>
        </header>

        <main className="view-content">
          {children}
        </main>
      </div>
    </div>
  );
}

