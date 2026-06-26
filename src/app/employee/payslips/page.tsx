'use client';

import React, { useState } from 'react';
import { useChronos } from '../../../context/ChronosContext';
import { FileText, Printer, ShieldCheck } from 'lucide-react';

export default function EmployeePayslips() {
  const { currentUser } = useChronos();
  const [selectedMonth, setSelectedMonth] = useState('May 2026');

  if (!currentUser) return null;

  // Static salary model based on role type
  const getSalaryDetails = () => {
    const isMgr = (currentUser.role || '').toLowerCase() === 'manager';
    const isHr = (currentUser.role || '').toLowerCase() === 'hr';
    const basic = isMgr ? 95000 : isHr ? 75000 : 55000;
    
    const hra = basic * 0.4;
    const ta = 8000;
    const special = isMgr ? 15000 : isHr ? 10000 : 5000;
    const gross = basic + hra + ta + special;
    
    const pf = basic * 0.12;
    const pt = 200;
    const tds = gross * 0.1;
    const totalDeductions = pf + pt + tds;
    const netPay = gross - totalDeductions;

    return {
      basic, hra, ta, special, gross,
      pf, pt, tds, totalDeductions, netPay
    };
  };

  const sal = getSalaryDetails();

  const payslipsList = [
    { month: 'May 2026', netPay: sal.netPay },
    { month: 'April 2026', netPay: sal.netPay },
    { month: 'March 2026', netPay: sal.netPay }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="content-view active-view" style={{ padding: '0px' }}>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Month Selector Column */}
        <div style={{
          flex: '1',
          minWidth: '240px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Select Pay Period</h4>
          {payslipsList.map(item => (
            <div
              key={item.month}
              onClick={() => setSelectedMonth(item.month)}
              style={{
                background: selectedMonth === item.month ? 'var(--primary-glow)' : '#ffffff',
                border: selectedMonth === item.month ? '1.5px solid var(--primary-light)' : '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.01)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText style={{ width: '20px', height: '20px', color: selectedMonth === item.month ? 'var(--primary)' : 'var(--text-muted)' }} />
                <div>
                  <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{item.month}</h5>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Salary Disbursed</span>
                </div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                ${item.netPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>

        {/* Printable Payslip Card Details */}
        <div id="printable-payslip" style={{
          flex: '2.5',
          minWidth: '460px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          position: 'relative'
        }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: '24px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Veltria Corp
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>100 Innovation Way, Tech District</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>PAYSLIP STATEMENT</h3>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>Period: {selectedMonth}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 40px', marginBottom: '32px', fontSize: '13px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Employee Name</span>
              <strong style={{ color: 'var(--text-main)' }}>{currentUser.name}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Designation / Job Title</span>
              <strong style={{ color: 'var(--text-main)' }}>{currentUser.role}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Department</span>
              <strong style={{ color: 'var(--text-main)' }}>{currentUser.department}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Employment Type</span>
              <strong style={{ color: 'var(--text-main)' }}>Full-time</strong>
            </div>
          </div>

          {/* Table Details */}
          <div style={{ display: 'flex', gap: '40px', marginBottom: '32px' }}>
            
            {/* Earnings Table */}
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>EARNINGS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Basic Salary</span>
                  <span style={{ fontWeight: 500 }}>${sal.basic.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>House Rent Allowance (HRA)</span>
                  <span style={{ fontWeight: 500 }}>${sal.hra.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Transport Allowance (TA)</span>
                  <span style={{ fontWeight: 500 }}>${sal.ta.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Special Allowance</span>
                  <span style={{ fontWeight: 500 }}>${sal.special.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Deductions Table */}
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>DEDUCTIONS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Provident Fund (PF)</span>
                  <span style={{ fontWeight: 500 }}>${sal.pf.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Professional Tax (PT)</span>
                  <span style={{ fontWeight: 500 }}>${sal.pt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Income Tax (TDS)</span>
                  <span style={{ fontWeight: 500 }}>${sal.tds.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Row */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '20px 24px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Net Take-Home Salary</span>
              <strong style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)' }}>
                ${sal.netPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
              <div>Gross Earnings: ${sal.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div>Total Deductions: ${sal.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck style={{ width: '14px', height: '14px', color: '#10b981' }} />
              Digitally certified statement.
            </span>
            <button
              onClick={handlePrint}
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
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <Printer style={{ width: '14px', height: '14px' }} />
              Print payslip
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
