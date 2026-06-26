'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { db } from '../lib/supabase';

// Type declarations matching schema
export interface UserProfile {
  id: number;
  user_id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  created_at: string;
  designation?: string;
  fathers_name?: string;
  mobile_no?: string;
  blood_group_id?: number | null;
  aadhar_no?: string;
  marital_status_id?: number | null;
  spouse_name?: string;
  emergency_contact_no?: string;
  gender?: string;
  dob?: string | null;
  status_id?: number;
}

export interface Timesheet {
  id: number;
  employee_id: number;
  week_start_date: string;
  project: string;
  project_id?: number | null;
  activity_id?: number | null;
  activity_name: string;
  activity_type: string;
  monday_hours: number;
  tuesday_hours: number;
  wednesday_hours: number;
  thursday_hours: number;
  friday_hours: number;
  saturday_hours: number;
  sunday_hours: number;
  hours: number;
  description: string;
  status: string;
  processed_date?: string | null;
  approver_id?: number | null;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  is_half_day?: boolean;
  half_day_period?: string | null;
  days_count?: number;
}

export interface Project {
  id: number;
  code: string;
  name: string;
  description: string;
  members?: { id: number; employee_id: number; role: string; profiles?: { name: string; email: string } }[];
  created_at: string;
  project_status?: string;
  project_type?: string;
  country?: string;
  is_billable?: boolean;
  start_date?: string;
  end_date?: string;
  budget?: number;
}

export interface AssignedTask {
  id: number;
  assigned_to: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  created_at: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ActivityRow {
  id: string;
  activityId: number | null;
  activityName: string;
  hours: string[];
  comment: string;
}

interface ChronosContextType {
  currentUser: UserProfile | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  timesheets: Timesheet[];
  setTimesheets: React.Dispatch<React.SetStateAction<Timesheet[]>>;
  employees: UserProfile[];
  setEmployees: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  clockState: any;
  setClockState: React.Dispatch<React.SetStateAction<any>>;
  clockHistory: any[];
  setClockHistory: React.Dispatch<React.SetStateAction<any[]>>;
  allClockStates: Record<string, any>;
  setAllClockStates: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  
  // Auth states (only for login page inputs)
  authRole: 'employee' | 'admin';
  setAuthRole: React.Dispatch<React.SetStateAction<'employee' | 'admin'>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;

  // Timesheet Entry Form states
  tsWeek: string;
  setTsWeek: React.Dispatch<React.SetStateAction<string>>;
  tsMasterCode: string;
  setTsMasterCode: React.Dispatch<React.SetStateAction<string>>;
  tsManager: string;
  setTsManager: React.Dispatch<React.SetStateAction<string>>;
  tsRole: string;
  isTsLoaded: boolean;
  setTsRole: React.Dispatch<React.SetStateAction<string>>;
  setIsTsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  tsStatus: string;
  activities: any[];
  timesheetStatuses: { id: number; name: string }[];
  activityRows: ActivityRow[];
  setActivityRows: React.Dispatch<React.SetStateAction<ActivityRow[]>>;
  PROJECT_DETAILS_MAP: Record<string, { description: string }>;

  // Employee Add Modal Inputs
  isAddModalOpen: boolean;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newEmpName: string;
  setNewEmpName: React.Dispatch<React.SetStateAction<string>>;
  newEmpEmail: string;
  setNewEmpEmail: React.Dispatch<React.SetStateAction<string>>;
  newEmpRole: string;
  setNewEmpRole: React.Dispatch<React.SetStateAction<string>>;
  newEmpDept: string;
  setNewEmpDept: React.Dispatch<React.SetStateAction<string>>;
  newEmpSystemRole: string;
  setNewEmpSystemRole: React.Dispatch<React.SetStateAction<string>>;
  newEmpPassword: string;
  setNewEmpPassword: React.Dispatch<React.SetStateAction<string>>;
  newEmpConfirmPassword: string;
  setNewEmpConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  newEmpDesignation: string;
  setNewEmpDesignation: React.Dispatch<React.SetStateAction<string>>;

  // Shared Helper states
  toasts: ToastMessage[];
  currentTime: string;
  currentDate: string;
  elapsedTime: string;

  // New Leaves & Tasks
  leaves: LeaveRequest[];
  setLeaves: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  tasks: AssignedTask[];
  setTasks: React.Dispatch<React.SetStateAction<AssignedTask[]>>;

  // Projects
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  handleCreateProject: (project: { code: string; name: string; description: string; members: { employee_id: number; role: string }[]; project_status?: string; project_type?: string; country?: string; is_billable?: boolean; start_date?: string; end_date?: string; budget?: number; }) => Promise<void>;
  handleUpdateProject: (projectId: number, project: { code: string; name: string; description: string; members: { employee_id: number; role: string }[]; project_status?: string; project_type?: string; country?: string; is_billable?: boolean; start_date?: string; end_date?: string; budget?: number; }) => Promise<void>;
  handleDeleteProject: (projectId: number) => Promise<void>;
  bloodGroups: { id: number; name: string }[];
  maritalStatuses: { id: number; name: string }[];
  handleUpdateProfile: (profileData: {
    fathers_name: string;
    mobile_no: string;
    blood_group_id: number | null;
    aadhar_no: string;
    marital_status_id: number | null;
    spouse_name: string;
    emergency_contact_no: string;
    gender: string;
    dob: string | null;
  }) => Promise<void>;

  // Actions
  triggerToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  refreshData: () => Promise<void>;
  getInitials: (nameStr: string) => string;
  formatDateDisplay: (dateStr: string) => string;
  getWeekDays: () => string[];
  handleClockToggle: () => Promise<void>;
  addActivityRow: () => void;
  removeActivityRow: (rowId: string) => void;
  updateActivityRowField: (rowId: string, field: string, val: any) => void;
  handleLoadActivities: () => void;
  handleResetTimesheet: () => void;
  handleSaveTimesheetDraft: () => void;
  handleSubmitTimesheet: () => Promise<void>;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleSignOut: () => Promise<void>;
  handleProcessApproval: (tsId: number, status: 'approved' | 'rejected') => Promise<void>;
  handleCreateEmployee: (e: React.FormEvent) => Promise<boolean>;
  handleUpdateEmployee: (empId: number, employee: { name: string; email: string; role: string; department: string; designation?: string }) => Promise<boolean>;
  handleDeleteEmployee: (empId: number) => Promise<void>;
  handleApplyLeave: (leave: {
    employee_id: number;
    start_date: string;
    end_date: string;
    leave_type: string;
    reason?: string;
    is_half_day?: boolean;
    half_day_period?: string | null;
    days_count?: number;
  }) => Promise<void>;
  handleApproveLeave: (leaveId: number, status: 'approved' | 'rejected') => Promise<void>;
  handleCreateTask: (task: { assigned_to: number; title: string; description: string }) => Promise<void>;
  handleUpdateTaskStatus: (taskId: number, status: 'Pending' | 'In Progress' | 'Completed') => Promise<void>;
}

const ChronosContext = createContext<ChronosContextType | undefined>(undefined);

export function ChronosProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Root states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [clockState, setClockState] = useState<any>(null);
  const [clockHistory, setClockHistory] = useState<any[]>([]);
  const [allClockStates, setAllClockStates] = useState<Record<string, any>>({});
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [tasks, setTasks] = useState<AssignedTask[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<{ id: number; name: string }[]>([]);
  const [timesheetStatuses, setTimesheetStatuses] = useState<{ id: number; name: string }[]>([]);
  const [bloodGroups, setBloodGroups] = useState<{ id: number; name: string }[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<{ id: number; name: string }[]>([]);

  // Auth Inputs
  const [authRole, setAuthRole] = useState<'employee' | 'admin'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Timesheet Redesign States
  const getMondayOfCurrentWeek = () => {
    const current = new Date();
    const day = current.getDay();
    const distance = day === 0 ? -6 : 1 - day;
    const monday = new Date(current);
    monday.setDate(current.getDate() + distance);
    return monday.toISOString().split('T')[0];
  };

  const [tsWeek, setTsWeek] = useState(getMondayOfCurrentWeek());
  const [tsMasterCode, setTsMasterCode] = useState('');
  const [tsManager, setTsManager] = useState('');
  const [tsRole, setTsRole] = useState('');
  const [isTsLoaded, setIsTsLoaded] = useState(false);

  let tsStatus = 'Due for submission';
  if (currentUser && timesheets) {
    const existing = timesheets.filter(t => t.employee_id === currentUser.id && t.week_start_date === tsWeek && t.project === tsMasterCode);
    if (existing.length > 0) {
      if (existing.some(t => t.status === 'rejected')) tsStatus = 'Rejected';
      else if (existing.every(t => t.status === 'approved')) tsStatus = 'Approved';
      else if (existing.some(t => t.status === 'submitted')) tsStatus = 'Submitted';
      else if (existing.some(t => t.status === 'active')) tsStatus = 'Draft';
      else tsStatus = 'Pending';
    }
  }

  const [activityRows, setActivityRows] = useState<ActivityRow[]>([]);

  const PROJECT_DETAILS_MAP: Record<string, { description: string }> = {
    'ABM006': { description: 'Opcenter MES Solution' },
    'DEV001': { description: 'Veltria Platform Core Development' },
    'MKT003': { description: 'Growth Campaign & SEO Audit' },
    'SYS004': { description: 'Cloud Maintenance & SSL Renewals' }
  };

  // Employee Add Modal Inputs
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpDesignation, setNewEmpDesignation] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('');
  const [newEmpSystemRole, setNewEmpSystemRole] = useState('employee');
  const [newEmpPassword, setNewEmpPassword] = useState('');
  const [newEmpConfirmPassword, setNewEmpConfirmPassword] = useState('');

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Ticking Headers Clock
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Live Timer for Clock widget
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const clockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger Toast helper
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Synchronize Data
  const refreshData = async () => {
    if (!currentUser) return;
    try {
      // Fetch lookup lists
      const bgs = await db.getBloodGroups();
      const mss = await db.getMaritalStatuses();
      setBloodGroups(bgs);
      setMaritalStatuses(mss);

      // Fetch projects list globally for all authenticated roles
      const allProj = await db.getProjects();
      setProjects(allProj);

      // Fetch employees globally
      const allEmp = await db.getEmployees();
      setEmployees(allEmp);

      // Fetch activities globally
      const allActivities = await db.getActivities();
      setActivities(allActivities);

      // Fetch timesheet statuses globally
      const allTsStatuses = await db.getTimesheetStatuses();
      setTimesheetStatuses(allTsStatuses);

      const role = (currentUser.role || '').toLowerCase();
      if (role === 'admin' || role === 'hr' || role === 'manager') {
        const allTs = await db.getTimesheets();
        setTimesheets(allTs);

        // Fetch leaves and tasks globally
        const allLeaves = await db.getLeaves();
        const allTasks = await db.getTasks();
        setLeaves(allLeaves);
        setTasks(allTasks);

        const clockStatesList = await db.getAllClockStates();
        const clockStatesMap: Record<string, any> = {};
        const sortedStates = [...clockStatesList].sort((a: any, b: any) => new Date(a.start_time || 0).getTime() - new Date(b.start_time || 0).getTime());
        sortedStates.forEach((s: any) => {
          clockStatesMap[s.employee_id] = s;
        });
        setAllClockStates(clockStatesMap);

        // Fetch their own clock state and history too
        const stateObj = await db.getClockState(currentUser.id);
        const historyObj = await db.getClockHistory(currentUser.id);
        setClockState(stateObj);
        setClockHistory(historyObj);
      } else {
        const userTs = await db.getTimesheets(currentUser.id);
        const stateObj = await db.getClockState(currentUser.id);
        const historyObj = await db.getClockHistory(currentUser.id);
        setTimesheets(userTs);
        setClockState(stateObj);
        setClockHistory(historyObj);

        // Fetch user specific leaves and tasks
        const userLeaves = await db.getLeaves(currentUser.id);
        const userTasks = await db.getTasks(currentUser.id);
        setLeaves(userLeaves);
        setTasks(userTasks);
      }
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // Helper actions
  const getInitials = (nameStr: string) => {
    if (!nameStr) return '??';
    const parts = nameStr.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getWeekDays = () => {
    const current = new Date();
    const day = current.getDay();
    const distance = day === 0 ? -6 : 1 - day;
    const monday = new Date(current);
    monday.setDate(current.getDate() + distance);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(monday);
      next.setDate(monday.getDate() + i);
      const yyyy = next.getFullYear();
      const mm = String(next.getMonth() + 1).padStart(2, '0');
      const dd = String(next.getDate()).padStart(2, '0');
      week.push(`${yyyy}-${mm}-${dd}`);
    }
    return week;
  };

  // Clock Widget synchronizer & ticker
  const syncClockWidget = async () => {
    if (!currentUser) return;
    const stateObj = await db.getClockState(currentUser.id);
    setClockState(stateObj);

    // Also sync clock history so check-ins appear immediately in the table
    const historyObj = await db.getClockHistory(currentUser.id);
    setClockHistory(historyObj);

    if (stateObj && stateObj.is_clocked_in) {
      startLiveClockTimer(stateObj.start_time);
    } else {
      stopLiveClockTimer();
    }
  };

  const startLiveClockTimer = (startTimeIso: string) => {
    if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    const startTimeMs = new Date(startTimeIso).getTime();
    
    const update = () => {
      const diffMs = Date.now() - startTimeMs;
      const totalSecs = Math.floor(diffMs / 1000);
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;
      setElapsedTime(
        `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    };

    update();
    clockTimerRef.current = setInterval(update, 1000);
  };

  const stopLiveClockTimer = () => {
    if (clockTimerRef.current) {
      clearInterval(clockTimerRef.current);
      clockTimerRef.current = null;
    }
    setElapsedTime('00:00:00');
  };

  // Synchronous effects
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setCurrentDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    }, 1000);

    const loadSession = async () => {
      try {
        const user = await db.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          // Auto route to page
          if (pathname === '/') {
            const role = (user.role || '').toLowerCase();
            if (role === 'admin') {
              router.replace('/admin/dashboard');
            } else if (role === 'hr') {
              router.replace('/hr/dashboard');
            } else if (role === 'manager') {
              router.replace('/manager/dashboard');
            } else {
              router.replace('/employee/dashboard');
            }
          }
        } else {
          // Redirect to login if on protected page
          if (
            pathname.startsWith('/employee') || 
            pathname.startsWith('/admin') || 
            pathname.startsWith('/hr') || 
            pathname.startsWith('/manager')
          ) {
            router.replace('/');
          }
        }
      } catch (err) {
        console.error("Session load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSession();

    return () => {
      clearInterval(clockInterval);
      stopLiveClockTimer();
    };
  }, []);

  // Fetch data on session status
  useEffect(() => {
    if (!currentUser) return;
    refreshData();
  }, [currentUser, pathname]);

  // Clock widget sync
  useEffect(() => {
    if (!currentUser || (currentUser.role || '').toLowerCase() === 'admin') return;
    syncClockWidget();
    return () => stopLiveClockTimer();
  }, [currentUser, clockState?.is_clocked_in]);

  // Load draft sheet
  useEffect(() => {
    if (!currentUser || !pathname.includes('/employee/timesheets')) return;
    const saved = localStorage.getItem(`ems_draft_${currentUser.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.tsWeek) setTsWeek(parsed.tsWeek);
        if (parsed.tsMasterCode) setTsMasterCode(parsed.tsMasterCode);
        if (parsed.tsManager) setTsManager(parsed.tsManager);
        if (parsed.tsRole) setTsRole(parsed.tsRole);
        if (parsed.activityRows) setActivityRows(parsed.activityRows);
        triggerToast("Loaded saved timesheet draft", "info");
      } catch (e) {
        console.error("Draft load error:", e);
      }
    }
  }, [pathname, currentUser]);

  // Action methods
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerToast("Please fill all authentication inputs", "error");
      return;
    }

    try {
      const profile = await db.signIn(email, password);
      setCurrentUser(profile);
      triggerToast(`Welcome back, ${profile.name}`, "success");
      
      // Clean forms
      setEmail('');
      setPassword('');

      // Redirect
      const role = (profile.role || '').toLowerCase();
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else if (role === 'hr') {
        router.push('/hr/dashboard');
      } else if (role === 'manager') {
        router.push('/manager/dashboard');
      } else if (role === 'intern') {
        router.push('/intern/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    } catch (err: any) {
      triggerToast(err.message, "error");
    }
  };

  const handleSignOut = async () => {
    await db.signOut();
    setCurrentUser(null);
    stopLiveClockTimer();
    triggerToast("Logged out successfully", "info");
    router.replace('/');
  };

  const handleClockToggle = async () => {
    if (!currentUser) return;
    const isClocked = clockState && clockState.is_clocked_in;

    try {
      if (!isClocked) {
        const nowStr = new Date().toISOString();
        await db.setClockState(
          currentUser.id,
          true, // isClockedIn
          false, // isClockedOut
          nowStr, // startTime
          null // endTime
        );
        await syncClockWidget();
        await refreshData();
        triggerToast("Duty clock-in logged. Timer active.", "success");
      } else {
        const startMs = new Date(clockState.start_time).getTime();
        const durationHours = Math.min(24, Number(((Date.now() - startMs) / 3600000).toFixed(2)));

        if (durationHours < 0.0015) {
          triggerToast("Shift canceled. Session logged was too short (< 5s).", "info");
          await db.setClockState(
            currentUser.id,
            false, // isClockedIn
            false, // isClockedOut
            null, // startTime
            null // endTime
          );
          await syncClockWidget();
          await refreshData();
          return;
        }

        const now = new Date();
        await db.setClockState(
          currentUser.id,
          false, // isClockedIn
          true, // isClockedOut
          clockState.start_time, // keep original startTime
          now.toISOString() // endTime
        );
        
        await syncClockWidget();
        await refreshData();
        triggerToast(`Clocked out. Logged ${durationHours} hours.`, "success");
      }
    } catch (err: any) {
      triggerToast(err.message, "error");
    }
  };

  const addActivityRow = () => {
    const newId = `row-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const defaultActivity = activities.length > 0 ? activities[0] : null;
    setActivityRows(prev => [...prev, {
      id: newId,
      activityId: defaultActivity ? defaultActivity.id : null,
      activityName: defaultActivity ? defaultActivity.name : '',
      hours: ['', '', '', '', '', '', ''],
      comment: ''
    }]);
  };

  const removeActivityRow = (rowId: string) => {
    setActivityRows(prev => prev.filter(r => r.id !== rowId));
  };

  const updateActivityRowField = (id: string, field: string, value: any) => {
    setActivityRows(prev => prev.map(r => {
      if (r.id === id) {
        const newRow = { ...r, [field]: value };
        if (field === 'activityId') {
          const matchedActivity = activities.find(a => a.id.toString() === value.toString());
          if (matchedActivity) {
            newRow.activityName = matchedActivity.name;
          }
        }
        return newRow;
      }
      return r;
    }));
  };

  const handleLoadActivities = () => {
    if (!tsMasterCode || !tsManager || !tsRole) {
      triggerToast("Please select Project, Manager, and Role first", "error");
      return;
    }

    if (currentUser && timesheets) {
      const existing = timesheets.filter(t => t.employee_id === currentUser.id && t.week_start_date === tsWeek && t.project === tsMasterCode);
      if (existing.length > 0) {
        const rows: ActivityRow[] = existing.map(t => ({
          id: `row-${Math.random().toString(36).substring(7)}`,
          activityId: t.activity_id || null,
          activityName: t.activity_name || '',
          hours: [
            t.monday_hours ? t.monday_hours.toString() : '',
            t.tuesday_hours ? t.tuesday_hours.toString() : '',
            t.wednesday_hours ? t.wednesday_hours.toString() : '',
            t.thursday_hours ? t.thursday_hours.toString() : '',
            t.friday_hours ? t.friday_hours.toString() : '',
            t.saturday_hours ? t.saturday_hours.toString() : '',
            t.sunday_hours ? t.sunday_hours.toString() : ''
          ],
          comment: t.description || ''
        }));
        setActivityRows(rows);
      } else {
        setActivityRows([]); // Clear rows if loading a fresh combination
      }
    }

    setIsTsLoaded(true);
    triggerToast("Timesheet layout loaded", "success");
  };

  const handleResetTimesheet = () => {
    setTsMasterCode('');
    setTsManager('');
    setTsRole('');
    setIsTsLoaded(false);
    setActivityRows([]);
    triggerToast("Timesheet form reset", "info");
  };

  const handleSaveTimesheetDraft = () => {
    if (typeof window !== 'undefined' && currentUser) {
      const draft = {
        tsWeek, tsMasterCode, tsManager, tsRole, activityRows
      };
      localStorage.setItem(`ems_draft_${currentUser.id}`, JSON.stringify(draft));
      triggerToast("Timesheet draft saved locally", "success");
    }
  };

  const handleSubmitTimesheet = async () => {
    if (!currentUser) return;
    if (!tsMasterCode || !tsManager || !tsRole) {
      triggerToast("Please fill all required fields (Project Code, Manager, Role)", "error");
      return;
    }

    let totalLogged = 0;
    activityRows.forEach(row => {
      row.hours.forEach(h => {
        if (h && !isNaN(Number(h))) {
          totalLogged += Number(h);
        }
      });
    });

    if (totalLogged === 0) {
      triggerToast("Please log at least one hour before submitting", "error");
      return;
    }

    // Validate daily totals and individual cells
    const dailyTotals = [0, 0, 0, 0, 0, 0, 0];
    for (const row of activityRows) {
      for (let i = 0; i < 7; i++) {
        const hrVal = row.hours[i];
        if (hrVal && !isNaN(Number(hrVal))) {
          const hrs = Number(hrVal);
          if (hrs > 24) {
            triggerToast("Logged activity time for any single day cannot exceed 24 hours", "error");
            return;
          }
          if (hrs < 0) {
            triggerToast("Logged hours cannot be negative", "error");
            return;
          }
          dailyTotals[i] += hrs;
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      if (dailyTotals[i] > 24) {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        triggerToast(`Total logged hours on ${days[i]} cannot exceed 24 hours`, "error");
        return;
      }
    }

    try {
      // First, delete any existing timesheets for this week and project to replace them cleanly
      const selectedProjectObj = projects.find(p => p.code === tsMasterCode);
      if (selectedProjectObj) {
        await db.deleteTimesheets(currentUser.id, tsWeek, selectedProjectObj.id);
      }

      for (const row of activityRows) {
        const mon = Number(row.hours[0]) || 0;
        const tue = Number(row.hours[1]) || 0;
        const wed = Number(row.hours[2]) || 0;
        const thu = Number(row.hours[3]) || 0;
        const fri = Number(row.hours[4]) || 0;
        const sat = Number(row.hours[5]) || 0;
        const sun = Number(row.hours[6]) || 0;
        const rowTotalHours = mon + tue + wed + thu + fri + sat + sun;

        if (rowTotalHours > 0) {
          const selectedProjectObj = projects.find(p => p.code === tsMasterCode);
          await db.createTimesheet({
            employee_id: currentUser.id,
            week_start_date: tsWeek,
            project: tsMasterCode,
            project_id: selectedProjectObj ? selectedProjectObj.id : null,
            activity_id: row.activityId,
            monday_hours: mon,
            tuesday_hours: tue,
            wednesday_hours: wed,
            thursday_hours: thu,
            friday_hours: fri,
            saturday_hours: sat,
            sunday_hours: sun,
            hours: rowTotalHours,
            description: row.comment || `Logged via weekly submission sheet (Role: ${tsRole})`,
            status_id: (timesheetStatuses.find(s => s.name === 'submitted') || {id: 1}).id,
            approver_id: tsManager && !isNaN(Number(tsManager)) ? Number(tsManager) : undefined
          });
        }
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem(`ems_draft_${currentUser.id}`);
      }
      triggerToast("Timesheet submitted successfully!", "success");
      handleResetTimesheet();
      await refreshData();
      const role = (currentUser.role || '').toLowerCase();
      if (role === 'intern') {
        router.push('/intern/dashboard');
      } else if (role === 'hr') {
        router.push('/hr/dashboard');
      } else if (role === 'manager') {
        router.push('/manager/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    } catch (e: any) {
      triggerToast(e.message, "error");
    }
  };

  const handleProcessApproval = async (tsId: number, status: 'approved' | 'rejected') => {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      const statusId = (timesheetStatuses.find(s => s.name === status) || {id: 1}).id;
      await db.updateTimesheetStatus(tsId, statusId, todayStr);
      triggerToast(`Timesheet successfully ${status}`, status === 'approved' ? 'success' : 'error');
      refreshData();
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail || !newEmpRole || !newEmpDept || !newEmpPassword || !newEmpConfirmPassword) {
      triggerToast("Please complete all employee fields", "error");
      return false;
    }

    if (newEmpPassword !== newEmpConfirmPassword) {
      triggerToast("Passwords do not match", "error");
      return false;
    }

    try {
      await db.createEmployee({
        name: newEmpName,
        email: newEmpEmail.toLowerCase(),
        role: newEmpSystemRole.toLowerCase(),
        department: newEmpDept,
        designation: newEmpDesignation || newEmpRole, // fallback for backwards compatibility
        password: newEmpPassword
      });
      triggerToast(`Employee account created for ${newEmpName}`, 'success');
      
      setNewEmpName('');
      setNewEmpEmail('');
      setNewEmpRole('');
      setNewEmpDesignation('');
      setNewEmpDept('');
      setNewEmpSystemRole('employee');
      setNewEmpPassword('');
      setNewEmpConfirmPassword('');
      setIsAddModalOpen(false);
      refreshData();
      return true;
    } catch (err: any) {
      triggerToast(err.message, 'error');
      return false;
    }
  };

  const handleApplyLeave = async (leave: {
    employee_id: number;
    start_date: string;
    end_date: string;
    leave_type: string;
    reason?: string;
    is_half_day?: boolean;
    half_day_period?: string | null;
    days_count?: number;
  }) => {
    try {
      await db.createLeave({
        ...leave,
        status: 'pending'
      });
      triggerToast("Leave application submitted successfully!", "success");
      await refreshData();
    } catch (e: any) {
      triggerToast(e.message, "error");
    }
  };

  const handleApproveLeave = async (leaveId: number, status: 'approved' | 'rejected') => {
    try {
      await db.updateLeaveStatus(leaveId, status);
      triggerToast(`Leave request ${status} successfully!`, status === 'approved' ? 'success' : 'info');
      await refreshData();
    } catch (e: any) {
      triggerToast(e.message, "error");
    }
  };

  // Task Actions
  const handleCreateTask = async (task: {
    assigned_to: number;
    title: string;
    description: string;
  }) => {
    try {
      await db.createTask({
        ...task,
        status: 'Pending'
      });
      triggerToast("Task assigned successfully!", "success");
      await refreshData();
    } catch (e: any) {
      triggerToast(e.message, "error");
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, status: 'Pending' | 'In Progress' | 'Completed') => {
    try {
      await db.updateTaskStatus(taskId, status);
      triggerToast(`Task status updated to ${status}!`, "success");
      await refreshData();
    } catch (e: any) {
      triggerToast(e.message, "error");
    }
  };

  const handleCreateProject = async (project: {
    code: string;
    name: string;
    description: string;
    members: { employee_id: number; role: string }[];
    project_status?: string;
    project_type?: string;
    country?: string;
    is_billable?: boolean;
    start_date?: string;
    end_date?: string;
    budget?: number;
  }) => {
    try {
      await db.createProject(project);
      triggerToast("Project created successfully!", "success");
      await refreshData();
    } catch (e: any) {
      triggerToast(e.message, "error");
    }
  };

  const handleUpdateProject = async (projectId: number, project: {
    code: string;
    name: string;
    description: string;
    members: { employee_id: number; role: string }[];
    project_status?: string;
    project_type?: string;
    country?: string;
    is_billable?: boolean;
    start_date?: string;
    end_date?: string;
    budget?: number;
  }) => {
    try {
      await db.updateProject(projectId, project);
      triggerToast("Project updated successfully!", "success");
      await refreshData();
    } catch (e: any) {
      triggerToast(e.message, "error");
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await db.deleteProject(projectId);
      triggerToast("Project deleted successfully!", "success");
      await refreshData();
    } catch (e: any) {
      triggerToast(e.message, "error");
    }
  };

  const handleUpdateProfile = async (profileData: {
    fathers_name: string;
    mobile_no: string;
    blood_group_id: number | null;
    aadhar_no: string;
    marital_status_id: number | null;
    spouse_name: string;
    emergency_contact_no: string;
    gender: string;
    dob: string | null;
  }) => {
    if (!currentUser) return;
    try {
      const processedData = {
        ...profileData,
        dob: profileData.dob === "" ? null : profileData.dob
      };
      await db.updateProfile(currentUser.id, processedData);
      triggerToast("Profile personal details updated successfully!", "success");
      setCurrentUser(prev => prev ? { ...prev, ...processedData } : null);
      await refreshData();
    } catch (e: any) {
      triggerToast(e.message, "error");
    }
  };

  const handleUpdateEmployee = async (empId: number, employee: {
    name: string;
    email: string;
    role: string;
    department: string;
    designation?: string;
  }): Promise<boolean> => {
    try {
      await db.updateEmployee(empId, employee);
      triggerToast(`Employee details updated for ${employee.name}`, 'success');
      await refreshData();
      return true;
    } catch (err: any) {
      triggerToast(err.message, 'error');
      return false;
    }
  };

  const handleDeleteEmployee = async (empId: number) => {
    if (confirm("Are you sure you want to delete this employee? This will permanently wipe their history logs.")) {
      try {
        await db.deleteEmployee(empId);
        triggerToast("Employee account deactivated successfully", "success");
        refreshData();
      } catch (err: any) {
        triggerToast(err.message, 'error');
      }
    }
  };

  return (
    <ChronosContext.Provider value={{
      currentUser, setCurrentUser,
      loading, setLoading,
      sidebarOpen, setSidebarOpen,
      timesheets, setTimesheets,
      employees, setEmployees,
      clockState, setClockState,
      clockHistory, setClockHistory,
      allClockStates, setAllClockStates,
      
      authRole, setAuthRole,
      email, setEmail,
      password, setPassword,
      showPassword, setShowPassword,

      tsWeek, setTsWeek,
      tsMasterCode, setTsMasterCode,
      tsManager, setTsManager,
      tsRole, setTsRole,
      isTsLoaded, setIsTsLoaded,
      tsStatus,
      activities,
      timesheetStatuses,
      activityRows, setActivityRows,
      PROJECT_DETAILS_MAP,

      isAddModalOpen, setIsAddModalOpen,
      newEmpName, setNewEmpName,
      newEmpEmail, setNewEmpEmail,
      newEmpRole, setNewEmpRole,
      newEmpDesignation, setNewEmpDesignation,
      newEmpDept, setNewEmpDept,
      newEmpSystemRole, setNewEmpSystemRole,
      newEmpPassword, setNewEmpPassword,
      newEmpConfirmPassword, setNewEmpConfirmPassword,

      toasts,
      currentTime,
      currentDate,
      elapsedTime,

      leaves, setLeaves,
      tasks, setTasks,

      triggerToast,
      refreshData,
      getInitials,
      formatDateDisplay,
      getWeekDays,
      handleClockToggle,
      addActivityRow,
      removeActivityRow,
      updateActivityRowField,
      handleLoadActivities,
      handleResetTimesheet,
      handleSaveTimesheetDraft,
      handleSubmitTimesheet,
      handleSignIn,
      handleSignOut,
      handleProcessApproval,
      handleCreateEmployee,
      handleUpdateEmployee,
      handleDeleteEmployee,
      handleApplyLeave,
      handleApproveLeave,
      handleCreateTask,
      handleUpdateTaskStatus,
      projects, setProjects,
      handleCreateProject,
      handleUpdateProject,
      handleDeleteProject,
      bloodGroups,
      maritalStatuses,
      handleUpdateProfile
    }}>
      {children}
    </ChronosContext.Provider>
  );
}

export function useChronos() {
  const context = useContext(ChronosContext);
  if (context === undefined) {
    throw new Error('useChronos must be used within a ChronosProvider');
  }
  return context;
}


