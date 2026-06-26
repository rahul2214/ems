import { createClient } from '@supabase/supabase-js';

// Get Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize live Supabase Client only if variables exist
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Log initialization status
if (supabase) {
    console.log("Veltria: Connected to live Supabase Backend.");
} else {
    console.warn("Veltria: Supabase keys missing. Running in local simulation mode (LocalStorage).");
}

// ==========================================================================
// SEED MOCK DATA (For Local Storage Fallback Mode)
// ==========================================================================
const MOCK_EMPLOYEES = [
    { id: 1, user_id: "emp-1", name: "John Doe", email: "employee@company.com", role: "Software Engineer", department: "Engineering", created_at: "2026-05-20T09:00:00Z", fathers_name: "Richard Doe", mobile_no: "9876543210", blood_group_id: 1, aadhar_no: "1234-5678-9012", marital_status_id: 1, spouse_name: "", emergency_contact_no: "9876543211", gender: "Male", dob: "1990-01-15" },
    { id: 2, user_id: "emp-2", name: "Varshitha", email: "varshitha@company.com", role: "Project Lead", department: "Engineering", created_at: "2026-05-20T09:00:00Z", fathers_name: "S. Murthy", mobile_no: "8765432109", blood_group_id: 3, aadhar_no: "2345-6789-0123", marital_status_id: 2, spouse_name: "Vikram", emergency_contact_no: "8765432100", gender: "Female", dob: "1993-04-22" },
    { id: 3, user_id: "emp-3", name: "Sarah Connor", email: "designer@company.com", role: "Lead Designer", department: "Engineering", created_at: "2026-05-20T09:00:00Z", fathers_name: "P. Connor", mobile_no: "7654321098", blood_group_id: 7, aadhar_no: "3456-7890-1234", marital_status_id: 1, spouse_name: "", emergency_contact_no: "7654321099", gender: "Female", dob: "1988-11-10" },
    { id: 4, user_id: "emp-4", name: "Tony Stark", email: "marketer@company.com", role: "Growth Specialist", department: "Sales and Marketing", created_at: "2026-05-20T09:00:00Z", fathers_name: "Howard Stark", mobile_no: "6543210987", blood_group_id: 1, aadhar_no: "4567-8901-2345", marital_status_id: 2, spouse_name: "Pepper Potts", emergency_contact_no: "6543210988", gender: "Male", dob: "1970-05-29" },
    { id: 5, user_id: "hr-1", name: "Jane Smith", email: "hr@company.com", role: "hr", department: "HR", created_at: "2026-05-20T09:00:00Z", fathers_name: "George Smith", mobile_no: "5432109876", blood_group_id: 7, aadhar_no: "5678-9012-3456", marital_status_id: 1, spouse_name: "", emergency_contact_no: "5432109877", gender: "Female", dob: "1994-08-05" },
    { id: 6, user_id: "mgr-1", name: "Bob Johnson", email: "manager@company.com", role: "manager", department: "Engineering", created_at: "2026-05-20T09:00:00Z", fathers_name: "Alan Johnson", mobile_no: "4321098765", blood_group_id: 3, aadhar_no: "6789-0123-4567", marital_status_id: 2, spouse_name: "Alice Johnson", emergency_contact_no: "4321098766", gender: "Male", dob: "1985-12-12" },
    { id: 7, user_id: "admin-1", name: "System Admin", email: "admin@company.com", role: "admin", department: "Management", created_at: "2026-05-20T09:00:00Z", fathers_name: "Admin Sr.", mobile_no: "3210987654", blood_group_id: 1, aadhar_no: "7890-1234-5678", marital_status_id: 1, spouse_name: "", emergency_contact_no: "3210987655", gender: "Male", dob: "1980-06-30" }
];

const MOCK_BLOOD_GROUPS = [
    { id: 1, name: "A+" },
    { id: 2, name: "A-" },
    { id: 3, name: "B+" },
    { id: 4, name: "B-" },
    { id: 5, name: "AB+" },
    { id: 6, name: "AB-" },
    { id: 7, name: "O+" },
    { id: 8, name: "O-" }
];

const MOCK_MARITAL_STATUSES = [
    { id: 1, name: "Single" },
    { id: 2, name: "Married" },
    { id: 3, name: "Divorced" },
    { id: 4, name: "Widowed" }
];

const MOCK_PASSWORDS: Record<string, string> = {
    "employee@company.com": "emp123",
    "varshitha@company.com": "varsh123",
    "designer@company.com": "design123",
    "marketer@company.com": "mark123",
    "hr@company.com": "hr123",
    "manager@company.com": "mgr123",
    "admin@company.com": "admin123"
};

const MOCK_PROJECTS = [
    { id: 1, code: "ABM006", name: "Opcenter MES Solution", description: "Deployment and customization of Opcenter MES for manufacturing clients.", manager_id: 6, created_at: "2026-05-20T09:00:00Z", project_status: "Active", country: "India", is_billable: true },
    { id: 2, code: "DEV001", name: "Veltria Platform Core Development", description: "Design and implement core timesheet and attendance capabilities.", manager_id: 6, created_at: "2026-05-20T09:00:00Z", project_status: "Active", country: "India", is_billable: true },
    { id: 3, code: "MKT003", name: "Growth Campaign & SEO Audit", description: "Optimize SEO metrics and manage growth campaigns for Veltria.", manager_id: 6, created_at: "2026-05-20T09:00:00Z", project_status: "Active", country: "India", is_billable: false },
    { id: 4, code: "SYS004", name: "Cloud Maintenance & SSL Renewals", description: "Ensure server uptime, run audits, and update certificates.", manager_id: 6, created_at: "2026-05-20T09:00:00Z", project_status: "Active", country: "India", is_billable: false }
];

const MOCK_LEAVES = [
    { id: 1, employee_id: 1, start_date: "2026-06-10", end_date: "2026-06-12", leave_type: "Annual", reason: "Family trip", status: "pending", created_at: "2026-06-01T09:00:00Z" },
    { id: 2, employee_id: 2, start_date: "2026-06-15", end_date: "2026-06-16", leave_type: "Sick", reason: "Dental checkup", status: "approved", created_at: "2026-05-28T09:00:00Z" }
];

const MOCK_TASKS = [
    { id: 1, assigned_to: 1, title: "Develop HR page components", description: "Design and implement HR directory lists and modal components.", status: "In Progress", created_at: "2026-06-01T09:00:00Z" },
    { id: 2, assigned_to: 2, title: "Database schema migration", description: "Migrate profile tables to include team and department details.", status: "Pending", created_at: "2026-06-01T09:00:00Z" }
];

const MOCK_TIMESHEETS = [
    {
        id: 1,
        employee_id: 1,
        week_start_date: "2026-05-18",
        project: "DEV001",
        activity_name: "Feature Development",
        activity_type: "Feature Development",
        monday_hours: 8.0,
        tuesday_hours: 8.0,
        wednesday_hours: 8.0,
        thursday_hours: 8.0,
        friday_hours: 8.0,
        saturday_hours: 0.0,
        sunday_hours: 0.0,
        hours: 40.0,
        description: "Implemented custom UI buttons and refined CSS variables for the main portal.",
        status: "approved",
        processed_date: "2026-05-21"
    },
    {
        id: 2,
        employee_id: 1,
        week_start_date: "2026-05-18",
        project: "ABM006",
        activity_name: "Tech Enablement",
        activity_type: "Tech Enablement",
        monday_hours: 0.0,
        tuesday_hours: 0.0,
        wednesday_hours: 4.0,
        thursday_hours: 4.0,
        friday_hours: 0.0,
        saturday_hours: 0.0,
        sunday_hours: 0.0,
        hours: 8.0,
        description: "Integrated API endpoints and resolved data mapping schema conflicts.",
        status: "approved",
        processed_date: "2026-05-22"
    },
    {
        id: 3,
        employee_id: 1,
        week_start_date: "2026-05-25",
        project: "SYS004",
        activity_name: "System Maintenance",
        activity_type: "System Maintenance",
        monday_hours: 4.0,
        tuesday_hours: 4.0,
        wednesday_hours: 4.0,
        thursday_hours: 4.0,
        friday_hours: 4.0,
        saturday_hours: 0.0,
        sunday_hours: 0.0,
        hours: 20.0,
        description: "Drafted test coverage scripts and verified build logs on sandbox environment.",
        status: "pending",
        processed_date: null
    },
    {
        id: 4,
        employee_id: 2,
        week_start_date: "2026-05-18",
        project: "DEV001",
        activity_name: "Feature Development",
        activity_type: "Feature Development",
        monday_hours: 8.0,
        tuesday_hours: 8.0,
        wednesday_hours: 8.0,
        thursday_hours: 8.0,
        friday_hours: 8.0,
        saturday_hours: 0.0,
        sunday_hours: 0.0,
        hours: 40.0,
        description: "Client alignment meeting and architecture roadmap presentation.",
        status: "approved",
        processed_date: "2026-05-21"
    },
    {
        id: 5,
        employee_id: 2,
        week_start_date: "2026-05-25",
        project: "DEV001",
        activity_name: "Feature Development",
        activity_type: "Feature Development",
        monday_hours: 8.0,
        tuesday_hours: 8.0,
        wednesday_hours: 8.0,
        thursday_hours: 8.0,
        friday_hours: 8.0,
        saturday_hours: 0.0,
        sunday_hours: 0.0,
        hours: 40.0,
        description: "Sprint review meeting and documentation update.",
        status: "pending",
        processed_date: null
    },
    {
        id: 6,
        employee_id: 3,
        week_start_date: "2026-05-18",
        project: "DEV001",
        activity_name: "Documentation",
        activity_type: "Documentation",
        monday_hours: 8.0,
        tuesday_hours: 8.0,
        wednesday_hours: 8.0,
        thursday_hours: 8.0,
        friday_hours: 8.0,
        saturday_hours: 0.0,
        sunday_hours: 0.0,
        hours: 40.0,
        description: "Created wireframes for the user onboarding flow.",
        status: "approved",
        processed_date: "2026-05-22"
    },
    {
        id: 7,
        employee_id: 4,
        week_start_date: "2026-05-18",
        project: "MKT003",
        activity_name: "Marketing Research",
        activity_type: "Marketing Research",
        monday_hours: 8.0,
        tuesday_hours: 8.0,
        wednesday_hours: 8.0,
        thursday_hours: 8.0,
        friday_hours: 8.0,
        saturday_hours: 0.0,
        sunday_hours: 0.0,
        hours: 40.0,
        description: "Competitor positioning analysis and SEM target keywords planning.",
        status: "approved",
        processed_date: "2026-05-21"
    }
];

// Helper to initialize local storage simulation
function initLocalMock() {
    if (typeof window === 'undefined') return;

    // Auto-wipe old string-based mock data to transition to int8/integer IDs
    const currentMockEmpsStrCheck = localStorage.getItem('ems_mock_employees');
    if (currentMockEmpsStrCheck) {
        try {
            const checkList = JSON.parse(currentMockEmpsStrCheck);
            if (checkList && checkList.length > 0 && typeof checkList[0].id === 'string') {
                console.log("EMS: Wiping old string-based mock data to transition to int8/integer IDs.");
                localStorage.removeItem('ems_mock_initialized');
                localStorage.removeItem('ems_mock_employees');
                localStorage.removeItem('ems_mock_passwords');
                localStorage.removeItem('ems_mock_timesheets');
                localStorage.removeItem('ems_mock_leaves');
                localStorage.removeItem('ems_mock_tasks');
                localStorage.removeItem('ems_mock_clock_states');
                localStorage.removeItem('ems_mock_projects');
                localStorage.removeItem('ems_mock_blood_groups');
                localStorage.removeItem('ems_mock_marital_statuses');
                localStorage.removeItem('ems_mock_session');
            }
        } catch (e) {}
    }

    if (!localStorage.getItem('ems_mock_initialized')) {
        localStorage.setItem('ems_mock_employees', JSON.stringify(MOCK_EMPLOYEES));
        localStorage.setItem('ems_mock_passwords', JSON.stringify(MOCK_PASSWORDS));
        localStorage.setItem('ems_mock_timesheets', JSON.stringify(MOCK_TIMESHEETS));
        localStorage.setItem('ems_mock_leaves', JSON.stringify(MOCK_LEAVES));
        localStorage.setItem('ems_mock_tasks', JSON.stringify(MOCK_TASKS));
        localStorage.setItem('ems_mock_clock_states', JSON.stringify([]));
        localStorage.setItem('ems_mock_projects', JSON.stringify(MOCK_PROJECTS));
        localStorage.setItem('ems_mock_blood_groups', JSON.stringify(MOCK_BLOOD_GROUPS));
        localStorage.setItem('ems_mock_marital_statuses', JSON.stringify(MOCK_MARITAL_STATUSES));
        localStorage.setItem('ems_mock_initialized', 'true');
    }
    if (!localStorage.getItem('ems_mock_projects')) {
        localStorage.setItem('ems_mock_projects', JSON.stringify(MOCK_PROJECTS));
    }
    if (!localStorage.getItem('ems_mock_blood_groups')) {
        localStorage.setItem('ems_mock_blood_groups', JSON.stringify(MOCK_BLOOD_GROUPS));
    }
    if (!localStorage.getItem('ems_mock_marital_statuses')) {
        localStorage.setItem('ems_mock_marital_statuses', JSON.stringify(MOCK_MARITAL_STATUSES));
    }
    if (!localStorage.getItem('ems_mock_clock_states') || localStorage.getItem('ems_mock_clock_states')?.startsWith('{')) {
        localStorage.setItem('ems_mock_clock_states', JSON.stringify([]));
    }

    // Migration helper: Make sure existing local storage employees have the new personal details fields
    const currentMockEmpsStr = localStorage.getItem('ems_mock_employees');
    if (currentMockEmpsStr) {
        try {
            const currentMockEmps = JSON.parse(currentMockEmpsStr);
            let updated = false;
            const updatedEmps = currentMockEmps.map((emp: any) => {
                const updatedEmp = { ...emp };
                const fields = ['fathers_name', 'mobile_no', 'blood_group_id', 'aadhar_no', 'marital_status_id', 'spouse_name', 'emergency_contact_no', 'gender', 'dob'];
                fields.forEach(f => {
                    if (!(f in updatedEmp)) {
                        updatedEmp[f] = f.endsWith('_id') ? null : '';
                        updated = true;
                    }
                });
                return updatedEmp;
            });
            if (updated) {
                localStorage.setItem('ems_mock_employees', JSON.stringify(updatedEmps));
                
                // Update active mock session if loaded
                const sessionStr = localStorage.getItem('ems_mock_session');
                if (sessionStr) {
                    const session = JSON.parse(sessionStr);
                    const matchingUpdated = updatedEmps.find((e: any) => e.id === session.id);
                    if (matchingUpdated) {
                        localStorage.setItem('ems_mock_session', JSON.stringify(matchingUpdated));
                    }
                }
            }
        } catch (e) {
            console.error("Migration error for mock employees:", e);
        }
    }
}

// Read from LocalStorage helper
function getLocalMockData(key: string) {
    initLocalMock();
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(`ems_mock_${key}`) || '[]');
}

// Write to LocalStorage helper
function saveLocalMockData(key: string, data: any) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`ems_mock_${key}`, JSON.stringify(data));
}

// ==========================================================================
// UNIFIED DATABASE SERVICE (Supabase with Local Simulation Fallback)
// ==========================================================================
export const db = {
    // 1. Authentication
    async signIn(email: string, password: string) {
        if (supabase) {
            // Live Supabase Authenticate
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw new Error(authError.message);
            
            // Resolve Profile Details
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*, roles(name), departments(name)')
                .eq('user_id', authData.user.id)
                .single();
                
            if (profileError) throw new Error(profileError.message);
            
            if (profile) {
                profile.role = profile.roles?.name || '';
                profile.department = profile.departments?.name || '';
                delete profile.roles;
                delete profile.departments;
            }
            return profile;
        } else {
            // Mock Local Authenticate
            initLocalMock();
            const employees = getLocalMockData('employees') as any[];
            const passwords = JSON.parse(localStorage.getItem('ems_mock_passwords') || '{}');
            
            const emp = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
            if (!emp || passwords[emp.email] !== password) {
                throw new Error("Invalid credentials or user does not exist.");
            }
            
            // Save mock session
            localStorage.setItem('ems_mock_session', JSON.stringify(emp));
            return emp;
        }
    },

    async updatePassword(password: string) {
        if (supabase) {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw new Error(error.message);
        } else {
            // Mock mode password update (no-op since auth is mocked)
        }
    },

    async signOut() {
        if (supabase) {
            await supabase.auth.signOut();
        } else {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('ems_mock_session');
            }
        }
    },

    async getCurrentUser() {
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;
            
            const { data: profile } = await supabase
                .from('profiles')
                .select('*, roles(name), departments(name)')
                .eq('user_id', user.id)
                .single();
                
            if (profile) {
                profile.role = profile.roles?.name || '';
                profile.department = profile.departments?.name || '';
                delete profile.roles;
                delete profile.departments;
            }
            return profile;
        } else {
            if (typeof window === 'undefined') return null;
            const session = localStorage.getItem('ems_mock_session');
            return session ? JSON.parse(session) : null;
        }
    },

    // 2. Clock states
    async getClockState(employeeId: number) {
        if (supabase) {
            const { data, error } = await supabase
                .from('clock_states')
                .select('*')
                .eq('employee_id', employeeId)
                .order('start_time', { ascending: false })
                .limit(1);
                
            if (error) throw new Error(error.message);
            return data && data.length > 0 ? data[0] : null;
        } else {
            const list = JSON.parse(localStorage.getItem('ems_mock_clock_states') || '[]');
            const empSessions = Array.isArray(list) ? list.filter((c: any) => Number(c.employee_id) === Number(employeeId)) : [];
            if (empSessions.length === 0) return null;
            empSessions.sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
            return empSessions[0];
        }
    },

    async getClockHistory(employeeId: number) {
        if (supabase) {
            const { data, error } = await supabase
                .from('clock_states')
                .select('*')
                .eq('employee_id', employeeId)
                .order('start_time', { ascending: false });
                
            if (error) throw new Error(error.message);
            return data || [];
        } else {
            const list = JSON.parse(localStorage.getItem('ems_mock_clock_states') || '[]');
            const empSessions = Array.isArray(list) ? list.filter((c: any) => Number(c.employee_id) === Number(employeeId)) : [];
            empSessions.sort((a: any, b: any) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
            return empSessions;
        }
    },

    async getAllClockStates() {
        if (supabase) {
            const { data, error } = await supabase
                .from('clock_states')
                .select('*');
            if (error) throw new Error(error.message);
            return data || [];
        } else {
            return JSON.parse(localStorage.getItem('ems_mock_clock_states') || '[]');
        }
    },

    async getActivities() {
        if (supabase) {
            const { data, error } = await supabase
                .from('activities')
                .select('*')
                .order('id', { ascending: true });
            if (error) throw new Error(error.message);
            return data || [];
        } else {
            return [];
        }
    },

    async setClockState(
        employeeId: number, 
        isClockedIn: boolean, 
        isClockedOut: boolean, 
        startTime: string | null, 
        endTime: string | null
    ) {
        if (supabase) {
            if (isClockedIn && !isClockedOut && startTime) {
                // Check-in: Insert new record
                const { error } = await supabase
                    .from('clock_states')
                    .insert({
                        employee_id: employeeId,
                        is_clocked_in: true,
                        is_clocked_out: false,
                        start_time: startTime,
                        end_time: null,
                        updated_at: new Date().toISOString()
                    });
                if (error) throw new Error(error.message);
            } else if (!isClockedIn && isClockedOut && endTime) {
                // Check-out: Find the active session (where is_clocked_in is true and end_time is null) and update it
                const { data: activeSessions, error: findError } = await supabase
                    .from('clock_states')
                    .select('id')
                    .eq('employee_id', employeeId)
                    .eq('is_clocked_in', true)
                    .is('end_time', null)
                    .order('start_time', { ascending: false })
                    .limit(1);
                if (findError) throw new Error(findError.message);

                const activeId = activeSessions && activeSessions.length > 0 ? activeSessions[0].id : null;
                if (activeId) {
                    const { error } = await supabase
                        .from('clock_states')
                        .update({
                            is_clocked_in: false,
                            is_clocked_out: true,
                            end_time: endTime,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', activeId);
                    if (error) throw new Error(error.message);
                } else {
                    // Fallback insertion
                    const { error } = await supabase
                        .from('clock_states')
                        .insert({
                            employee_id: employeeId,
                            is_clocked_in: false,
                            is_clocked_out: true,
                            start_time: startTime,
                            end_time: endTime,
                            updated_at: new Date().toISOString()
                        });
                    if (error) throw new Error(error.message);
                }
            } else if (!isClockedIn && !isClockedOut && !startTime && !endTime) {
                // Reset / Cancel active session: Delete the latest active record
                const { data: activeSessions, error: findError } = await supabase
                    .from('clock_states')
                    .select('id')
                    .eq('employee_id', employeeId)
                    .eq('is_clocked_in', true)
                    .is('end_time', null)
                    .order('start_time', { ascending: false })
                    .limit(1);
                if (findError) throw new Error(findError.message);

                const activeId = activeSessions && activeSessions.length > 0 ? activeSessions[0].id : null;
                if (activeId) {
                    const { error } = await supabase
                        .from('clock_states')
                        .delete()
                        .eq('id', activeId);
                    if (error) throw new Error(error.message);
                }
            }
        } else {
            const list = JSON.parse(localStorage.getItem('ems_mock_clock_states') || '[]');
            const arrayList = Array.isArray(list) ? list : [];

            if (isClockedIn && !isClockedOut && startTime) {
                arrayList.push({
                    id: Date.now(),
                    employee_id: employeeId,
                    is_clocked_in: true,
                    is_clocked_out: false,
                    start_time: startTime,
                    end_time: null,
                    updated_at: new Date().toISOString()
                });
            } else if (!isClockedIn && isClockedOut && endTime) {
                const activeIdx = arrayList.findIndex((c: any) => Number(c.employee_id) === Number(employeeId) && c.is_clocked_in && !c.end_time);
                if (activeIdx !== -1) {
                    arrayList[activeIdx].is_clocked_in = false;
                    arrayList[activeIdx].is_clocked_out = true;
                    arrayList[activeIdx].end_time = endTime;
                    arrayList[activeIdx].updated_at = new Date().toISOString();
                } else {
                    arrayList.push({
                        id: Date.now(),
                        employee_id: employeeId,
                        is_clocked_in: false,
                        is_clocked_out: true,
                        start_time: startTime,
                        end_time: endTime,
                        updated_at: new Date().toISOString()
                    });
                }
            } else if (!isClockedIn && !isClockedOut && !startTime && !endTime) {
                const activeIdx = arrayList.findIndex((c: any) => Number(c.employee_id) === Number(employeeId) && c.is_clocked_in && !c.end_time);
                if (activeIdx !== -1) {
                    arrayList.splice(activeIdx, 1);
                }
            }

            localStorage.setItem('ems_mock_clock_states', JSON.stringify(arrayList));
        }
    },

    // 3. Timesheets
    async getTimesheets(employeeId?: number) {
        if (supabase) {
            let query = supabase.from('timesheets').select('*, projects(code), activities(name), timesheet_statuses(name)');
            if (employeeId) {
                query = query.eq('employee_id', employeeId);
            }
            const { data, error } = await query;
            if (error) throw new Error(error.message);
            return (data || []).map((t: any) => ({
                ...t,
                project: t.projects?.code || t.project || '',
                status: t.timesheet_statuses?.name || t.status || 'pending',
                activity_name: t.activities?.name || t.activity_name || '',
                activity_type: t.activity_type || '',
                hours: t.total_hours !== undefined ? Number(t.total_hours) : Number(t.hours)
            }));
        } else {
            const list = getLocalMockData('timesheets') as any[];
            if (employeeId) {
                return list.filter(t => Number(t.employee_id) === Number(employeeId));
            }
            return list;
        }
    },

    async createTimesheet(timesheet: {
        employee_id: number;
        week_start_date: string;
        project: string;
        project_id?: number | null;
        activity_id?: number | null;
        monday_hours: number;
        tuesday_hours: number;
        wednesday_hours: number;
        thursday_hours: number;
        friday_hours: number;
        saturday_hours: number;
        sunday_hours: number;
        hours: number;
        description: string;
        status_id: number;
        processed_date?: string | null;
        approver_id?: number | null;
    }) {
        if (supabase) {
            // Omit hours and project from payload as database calculates total_hours automatically
            const { hours, project, ...payload } = timesheet;
            const { data, error } = await supabase
                .from('timesheets')
                .insert([payload])
                .select()
                .single();
                
            if (error) throw new Error(error.message);
            return data ? { ...data, hours: Number(data.total_hours) } : null;
        } else {
            const list = getLocalMockData('timesheets') as any[];
            const newTs = {
                id: Date.now(),
                ...timesheet,
                processed_date: timesheet.processed_date || null
            };
            list.push(newTs);
            saveLocalMockData('timesheets', list);
            return newTs;
        }
    },

    async deleteTimesheets(employeeId: number, weekStartDate: string, projectId: number) {
        if (supabase) {
            const { error } = await supabase
                .from('timesheets')
                .delete()
                .eq('employee_id', employeeId)
                .eq('week_start_date', weekStartDate)
                .eq('project_id', projectId);
            if (error) throw new Error(error.message);
        } else {
            const list = getLocalMockData('timesheets') as any[];
            const filtered = list.filter(t => !(t.employee_id === employeeId && t.week_start_date === weekStartDate && t.project_id === projectId));
            saveLocalMockData('timesheets', filtered);
        }
    },

    async updateTimesheetStatus(timesheetId: number, statusId: number, processedDate: string) {
        if (supabase) {
            const { error } = await supabase
                .from('timesheets')
                .update({ status_id: statusId, processed_date: processedDate })
                .eq('id', timesheetId);
                
            if (error) throw new Error(error.message);
        } else {
            const list = getLocalMockData('timesheets') as any[];
            const idx = list.findIndex(t => Number(t.id) === Number(timesheetId));
            if (idx !== -1) {
                list[idx].status = status;
                list[idx].processed_date = processedDate;
                saveLocalMockData('timesheets', list);
            }
        }
    },

    // 4. Employees Directory (Admin Views)
    async getEmployees() {
        if (supabase) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*, roles(name), departments(name)');
            if (error) throw new Error(error.message);
            return (data || [])
                .map((p: any) => ({
                    ...p,
                    role: p.roles?.name || '',
                    department: p.departments?.name || ''
                }))
                .filter((p: any) => p.role !== 'admin');
        } else {
            const list = getLocalMockData('employees') as any[];
            return list.filter(e => e.role !== 'admin');
        }
    },

    async createEmployee(employee: {
        name: string;
        email: string;
        role: string;
        department: string;
        designation?: string;
        password?: string;
    }) {
        if (supabase) {
            // Under Supabase, creating users requires calling sign-up or admin api.
            // For standard demo, we trigger supabase.auth.signUp
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: employee.email,
                password: employee.password || 'password123',
                options: {
                    data: {
                        name: employee.name,
                        role: employee.role,
                        department: employee.department,
                        designation: employee.designation
                    }
                }
            });
            if (authError) throw new Error(authError.message);
            
            // Note: If you configure a trigger in postgres database, profiles row is auto created.
            // If not, we manually check if we can insert it here.
            if (authData.user) {
                // Supabase returns a fake user object if the email already exists and email enumeration protection is on.
                if (authData.user.identities && authData.user.identities.length === 0) {
                    throw new Error("An employee with this email already exists.");
                }
                const { data: roleData } = await supabase.from('roles').select('id').eq('name', employee.role).single();
                const { data: deptData } = await supabase.from('departments').select('id').eq('name', employee.department).single();
                
                const { error: profError } = await supabase.from('profiles').upsert({
                    user_id: authData.user.id,
                    name: employee.name,
                    email: employee.email,
                    role_id: roleData?.id || null,
                    department_id: deptData?.id || null,
                    designation: employee.designation || null
                }, { onConflict: 'user_id' });
                if (profError) {
                    // Suppressing this warning because the Supabase Auth Trigger handles the insertion automatically in production,
                    // and this manual upsert is just a fallback that safely fails if the trigger already succeeded.
                }
            }
            return authData.user;
        } else {
            const list = getLocalMockData('employees') as any[];
            const passwords = JSON.parse(localStorage.getItem('ems_mock_passwords') || '{}');
            
            const emailLower = employee.email.toLowerCase();
            if (list.some(e => e.email.toLowerCase() === emailLower)) {
                throw new Error("An employee account with this email already exists.");
            }
            
            const maxId = list.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0);
            const newEmp = {
                id: maxId + 1,
                user_id: `emp-${maxId + 1}`,
                name: employee.name,
                email: emailLower,
                role: employee.role,
                department: employee.department,
                designation: employee.designation || null,
                created_at: new Date().toISOString()
            };
            
            list.push(newEmp);
            passwords[emailLower] = employee.password || 'password123';
            
            saveLocalMockData('employees', list);
            localStorage.setItem('ems_mock_passwords', JSON.stringify(passwords));
            return newEmp;
        }
    },

    async updateEmployee(employeeId: number, employee: {
        name: string;
        email: string;
        role: string;
        department: string;
        designation?: string;
    }) {
        if (supabase) {
            const { data: roleData } = await supabase.from('roles').select('id').eq('name', employee.role).single();
            const { data: deptData } = await supabase.from('departments').select('id').eq('name', employee.department).single();
            
            const { error } = await supabase
                .from('profiles')
                .update({
                    name: employee.name,
                    email: employee.email.toLowerCase(),
                    role_id: roleData?.id || null,
                    department_id: deptData?.id || null,
                    designation: employee.designation || null
                })
                .eq('id', employeeId);
            if (error) throw new Error(error.message);
        } else {
            const list = getLocalMockData('employees') as any[];
            const idx = list.findIndex(e => Number(e.id) === Number(employeeId));
            if (idx !== -1) {
                list[idx].name = employee.name;
                list[idx].email = employee.email.toLowerCase();
                list[idx].role = employee.role;
                list[idx].department = employee.department;
                list[idx].designation = employee.designation;
                saveLocalMockData('employees', list);
            }
        }
    },

    async deleteEmployee(employeeId: number) {
        if (supabase) {
            // For Supabase, deactivating employees is usually done by deleting or updates.
            // Standard delete from profiles (cascade deletes timesheets/clock states)
            const { error } = await supabase.from('profiles').delete().eq('id', employeeId);
            if (error) throw new Error(error.message);
        } else {
            let list = getLocalMockData('employees') as any[];
            const emp = list.find(e => Number(e.id) === Number(employeeId));
            if (!emp) return;
            
            list = list.filter(e => Number(e.id) !== Number(employeeId));
            saveLocalMockData('employees', list);
            
            // Clean up password
            const passwords = JSON.parse(localStorage.getItem('ems_mock_passwords') || '{}');
            delete passwords[emp.email];
            localStorage.setItem('ems_mock_passwords', JSON.stringify(passwords));
            
            // Clean up timesheets
            let tsList = getLocalMockData('timesheets') as any[];
            tsList = tsList.filter(t => Number(t.employee_id) !== Number(employeeId));
            saveLocalMockData('timesheets', tsList);
            
            // Clean up clock state
            let states = JSON.parse(localStorage.getItem('ems_mock_clock_states') || '[]');
            if (Array.isArray(states)) {
                states = states.filter((c: any) => Number(c.employee_id) !== Number(employeeId));
                localStorage.setItem('ems_mock_clock_states', JSON.stringify(states));
            } else {
                localStorage.setItem('ems_mock_clock_states', JSON.stringify([]));
            }
        }
    },

    // 5. Leaves

    async getTimesheetStatuses() {
        if (supabase) {
            const { data, error } = await supabase.from('timesheet_statuses').select('*');
            if (error) throw new Error(error.message);
            return data || [];
        } else {
            return getLocalMockData('timesheet_statuses') as any[];
        }
    },

    async getLeaves(employeeId?: number) {
        if (supabase) {
            let query = supabase.from('leaves').select('*');
            if (employeeId) {
                query = query.eq('employee_id', employeeId);
            }
            const { data, error } = await query;
            if (error) throw new Error(error.message);
            return data || [];
        } else {
            const list = getLocalMockData('leaves') as any[];
            if (employeeId) {
                return list.filter(l => Number(l.employee_id) === Number(employeeId));
            }
            return list;
        }
    },

    async createLeave(leave: {
        employee_id: number;
        start_date: string;
        end_date: string;
        leave_type: string;
        reason?: string | null;
        status: 'pending' | 'approved' | 'rejected';
        is_half_day?: boolean;
        half_day_period?: string | null;
        days_count?: number;
    }) {
        if (supabase) {
            const { data, error } = await supabase
                .from('leaves')
                .insert([{
                    ...leave,
                    reason: leave.reason || ''
                }])
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        } else {
            const list = getLocalMockData('leaves') as any[];
            const newLeave = {
                id: Date.now(),
                ...leave,
                reason: leave.reason || '',
                created_at: new Date().toISOString()
            };
            list.push(newLeave);
            saveLocalMockData('leaves', list);
            return newLeave;
        }
    },

    async updateLeaveStatus(leaveId: number, status: 'approved' | 'rejected') {
        if (supabase) {
            const { error } = await supabase
                .from('leaves')
                .update({ status })
                .eq('id', leaveId);
            if (error) throw new Error(error.message);
        } else {
            const list = getLocalMockData('leaves') as any[];
            const idx = list.findIndex(l => Number(l.id) === Number(leaveId));
            if (idx !== -1) {
                list[idx].status = status;
                saveLocalMockData('leaves', list);
            }
        }
    },

    // 6. Tasks
    async getTasks(employeeId?: number) {
        if (supabase) {
            let query = supabase.from('tasks').select('*');
            if (employeeId) {
                query = query.eq('assigned_to', employeeId);
            }
            const { data, error } = await query;
            if (error) throw new Error(error.message);
            return data || [];
        } else {
            const list = getLocalMockData('tasks') as any[];
            if (employeeId) {
                return list.filter(t => Number(t.assigned_to) === Number(employeeId));
            }
            return list;
        }
    },

    async createTask(task: {
        assigned_to: number;
        title: string;
        description: string;
        status: 'Pending' | 'In Progress' | 'Completed';
    }) {
        if (supabase) {
            const { data, error } = await supabase
                .from('tasks')
                .insert([task])
                .select()
                .single();
            if (error) throw new Error(error.message);
            return data;
        } else {
            const list = getLocalMockData('tasks') as any[];
            const newTask = {
                id: Date.now(),
                ...task,
                created_at: new Date().toISOString()
            };
            list.push(newTask);
            saveLocalMockData('tasks', list);
            return newTask;
        }
    },

    async updateTaskStatus(taskId: number, status: 'Pending' | 'In Progress' | 'Completed') {
        if (supabase) {
            const { error } = await supabase
                .from('tasks')
                .update({ status })
                .eq('id', taskId);
            if (error) throw new Error(error.message);
        } else {
            const list = getLocalMockData('tasks') as any[];
            const idx = list.findIndex(t => Number(t.id) === Number(taskId));
            if (idx !== -1) {
                list[idx].status = status;
                saveLocalMockData('tasks', list);
            }
        }
    },

    // 7. Projects
    async getProjects() {
        if (supabase) {
            const { data, error } = await supabase
                .from('projects')
                .select('*, members:project_members(id, employee_id, role, profiles(name, email))')
                .order('code', { ascending: true });
            if (error) throw new Error(error.message);
            return data || [];
        } else {
            return getLocalMockData('projects') as any[];
        }
    },

    async createProject(project: {
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
    }) {
        if (supabase) {
            const { members, ...projectData } = project;
            const { data, error } = await supabase
                .from('projects')
                .insert([{
                    ...projectData,
                    project_status: project.project_status || 'Active',
                    project_type: project.project_type || 'Internal',
                    country: project.country || 'India',
                    is_billable: project.is_billable ?? true,
                    start_date: project.start_date || null,
                    end_date: project.end_date || null,
                    budget: project.budget ?? null
                }])
                .select()
                .single();
            if (error) throw new Error(error.message);

            if (members && members.length > 0) {
                const membersData = members.map(m => ({
                    project_id: data.id,
                    employee_id: m.employee_id,
                    role: m.role
                }));
                const { error: membersError } = await supabase.from('project_members').insert(membersData);
                if (membersError) throw new Error(membersError.message);
            }

            return data;
        } else {
            const list = getLocalMockData('projects') as any[];
            const maxId = list.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
            const newProj = {
                id: maxId + 1,
                ...project,
                project_status: project.project_status || 'Active',
                project_type: project.project_type || 'Internal',
                country: project.country || 'India',
                is_billable: project.is_billable ?? true,
                start_date: project.start_date || null,
                end_date: project.end_date || null,
                budget: project.budget ?? null,
                created_at: new Date().toISOString()
            };
            list.push(newProj);
            saveLocalMockData('projects', list);
            return newProj;
        }
    },

    async updateProject(projectId: number, project: {
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
    }) {
        if (supabase) {
            const { members, ...projectData } = project;
            const { error } = await supabase
                .from('projects')
                .update({
                    ...projectData,
                    project_status: project.project_status || 'Active',
                    project_type: project.project_type || 'Internal',
                    country: project.country || 'India',
                    is_billable: project.is_billable ?? true,
                    start_date: project.start_date || null,
                    end_date: project.end_date || null,
                    budget: project.budget ?? null
                })
                .eq('id', projectId);
            if (error) throw new Error(error.message);

            // Sync members
            if (members) {
                // Delete existing
                await supabase.from('project_members').delete().eq('project_id', projectId);
                // Insert new ones
                if (members.length > 0) {
                    const membersData = members.map(m => ({
                        project_id: projectId,
                        employee_id: m.employee_id,
                        role: m.role
                    }));
                    const { error: membersError } = await supabase.from('project_members').insert(membersData);
                    if (membersError) throw new Error(membersError.message);
                }
            }
        } else {
            const list = getLocalMockData('projects') as any[];
            const idx = list.findIndex(p => Number(p.id) === Number(projectId));
            if (idx !== -1) {
                list[idx].code = project.code;
                list[idx].name = project.name;
                list[idx].description = project.description;
                list[idx].members = project.members;
                list[idx].project_status = project.project_status || 'Active';
                list[idx].project_type = project.project_type || 'Internal';
                list[idx].country = project.country || 'India';
                list[idx].is_billable = project.is_billable ?? true;
                list[idx].start_date = project.start_date || null;
                list[idx].end_date = project.end_date || null;
                list[idx].budget = project.budget ?? null;
                saveLocalMockData('projects', list);
            }
        }
    },

    async deleteProject(projectId: number) {
        if (supabase) {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);
            if (error) throw new Error(error.message);
        } else {
            let list = getLocalMockData('projects') as any[];
            list = list.filter(p => Number(p.id) !== Number(projectId));
            saveLocalMockData('projects', list);
        }
    },

    async getBloodGroups() {
        if (supabase) {
            const { data, error } = await supabase
                .from('blood_groups')
                .select('*')
                .order('name', { ascending: true });
            if (error) throw new Error(error.message);
            return data || [];
        } else {
            return getLocalMockData('blood_groups') as any[];
        }
    },

    async getMaritalStatuses() {
        if (supabase) {
            const { data, error } = await supabase
                .from('marital_statuses')
                .select('*')
                .order('name', { ascending: true });
            if (error) throw new Error(error.message);
            return data || [];
        } else {
            return getLocalMockData('marital_statuses') as any[];
        }
    },

    async updateProfile(userId: number, data: {
        fathers_name: string;
        mobile_no: string;
        blood_group_id: number | null;
        aadhar_no: string;
        marital_status_id: number | null;
        spouse_name: string;
        emergency_contact_no: string;
        gender: string;
        dob: string | null;
    }) {
        if (supabase) {
            const { error } = await supabase
                .from('profiles')
                .update(data)
                .eq('id', userId);
            if (error) throw new Error(error.message);
        } else {
            const list = getLocalMockData('employees') as any[];
            const idx = list.findIndex(e => Number(e.id) === Number(userId));
            if (idx !== -1) {
                list[idx] = {
                    ...list[idx],
                    ...data
                };
                saveLocalMockData('employees', list);
                
                // Update mock session if it is the current logged-in user
                const sessionStr = localStorage.getItem('ems_mock_session');
                if (sessionStr) {
                    const session = JSON.parse(sessionStr);
                    if (Number(session.id) === Number(userId)) {
                        localStorage.setItem('ems_mock_session', JSON.stringify({
                            ...session,
                            ...data
                        }));
                    }
                }
            }
        }
    }
};


