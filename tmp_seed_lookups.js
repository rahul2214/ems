const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to parse .env file
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found at ' + envPath);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let val = match[2] || '';
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      env[match[1]] = val.trim();
    }
  });
  return env;
}

async function run() {
  try {
    const env = loadEnv();
    const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key is missing in env');
    }
    
    console.log('Connecting to Supabase...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Inserting Roles...');
    const { data: roles, error: rolesErr } = await supabase.from('roles').insert([
      { name: 'employee' },
      { name: 'manager' },
      { name: 'hr' },
      { name: 'admin' }
    ]).select();
    if (rolesErr) console.error('Roles insert error:', rolesErr.message);
    else console.log('Roles seeded:', roles);

    console.log('Inserting Departments...');
    const { data: depts, error: deptsErr } = await supabase.from('departments').insert([
      { name: 'Engineering' },
      { name: 'HR' },
      { name: 'Sales and Marketing' },
      { name: 'Management' }
    ]).select();
    if (deptsErr) console.error('Departments insert error:', deptsErr.message);
    else console.log('Departments seeded:', depts);

    if (depts && depts.length > 0) {
      const engDept = depts.find(d => d.name === 'Engineering');
      if (engDept) {
        console.log('Inserting Teams for Engineering...');
        const { data: teams, error: teamsErr } = await supabase.from('teams').insert([
          { name: 'Frontend', department_id: engDept.id },
          { name: 'Backend', department_id: engDept.id },
          { name: 'Design', department_id: engDept.id },
          { name: 'None', department_id: engDept.id }
        ]).select();
        if (teamsErr) console.error('Teams insert error:', teamsErr.message);
        else console.log('Teams seeded:', teams);
      }
    }

  } catch (error) {
    console.error('Failure:', error.message);
  }
}

run();
