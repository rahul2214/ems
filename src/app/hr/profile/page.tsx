'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, User, Shield, Phone } from 'lucide-react';
import { useChronos } from '../../../context/ChronosContext';

export default function HRProfile() {
  const {
    currentUser,
    bloodGroups,
    maritalStatuses,
    handleUpdateProfile,
    getInitials,
    formatDateDisplay
  } = useChronos();

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields states
  const [fathersName, setFathersName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [bloodGroupId, setBloodGroupId] = useState<number | null>(null);
  const [aadharNo, setAadharNo] = useState('');
  const [maritalStatusId, setMaritalStatusId] = useState<number | null>(null);
  const [spouseName, setSpouseName] = useState('');
  const [emergencyContactNo, setEmergencyContactNo] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  // Set form fields from currentUser on load or when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFathersName(currentUser.fathers_name || '');
      setMobileNo(currentUser.mobile_no || '');
      setBloodGroupId(currentUser.blood_group_id || null);
      setAadharNo(currentUser.aadhar_no || '');
      setMaritalStatusId(currentUser.marital_status_id || null);
      setSpouseName(currentUser.spouse_name || '');
      setEmergencyContactNo(currentUser.emergency_contact_no || '');
      setGender(currentUser.gender || '');
      setDob(currentUser.dob || '');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  // Lookup Helpers
  const getBloodGroupName = (id: number | null) => {
    if (!id) return 'Not Specified';
    const bg = bloodGroups.find(item => item.id === id);
    return bg ? bg.name : 'Not Specified';
  };

  const getMaritalStatusName = (id: number | null) => {
    if (!id) return 'Not Specified';
    const ms = maritalStatuses.find(item => item.id === id);
    return ms ? ms.name : 'Not Specified';
  };

  // Check if active marital status is 'Married'
  const isSelectedMarried = () => {
    if (!maritalStatusId) return false;
    const ms = maritalStatuses.find(item => item.id === maritalStatusId);
    return ms ? ms.name.toLowerCase() === 'married' : false;
  };

  // Check if current user's saved status is 'Married'
  const isUserMarried = () => {
    return getMaritalStatusName(currentUser.marital_status_id || null).toLowerCase() === 'married';
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset form values to current user values
    setFathersName(currentUser.fathers_name || '');
    setMobileNo(currentUser.mobile_no || '');
    setBloodGroupId(currentUser.blood_group_id || null);
    setAadharNo(currentUser.aadhar_no || '');
    setMaritalStatusId(currentUser.marital_status_id || null);
    setSpouseName(currentUser.spouse_name || '');
    setEmergencyContactNo(currentUser.emergency_contact_no || '');
    setGender(currentUser.gender || '');
    setDob(currentUser.dob || '');
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validations
    if (mobileNo.trim() && !/^\d{10,15}$/.test(mobileNo.replace(/[\s-]/g, ''))) {
      alert("Please enter a valid mobile number (10 to 15 digits).");
      return;
    }

    if (emergencyContactNo.trim() && !/^\d{10,15}$/.test(emergencyContactNo.replace(/[\s-]/g, ''))) {
      alert("Please enter a valid emergency contact number.");
      return;
    }

    if (aadharNo.trim() && aadharNo.replace(/[\s-]/g, '').length !== 12) {
      alert("Please enter a valid 12-digit Aadhar number.");
      return;
    }

    // Determine spouse name based on marital status
    const actualSpouseName = isSelectedMarried() ? spouseName.trim() : '';

    const payload = {
      fathers_name: fathersName.trim(),
      mobile_no: mobileNo.trim(),
      blood_group_id: bloodGroupId || null,
      aadhar_no: aadharNo.trim(),
      marital_status_id: maritalStatusId || null,
      spouse_name: actualSpouseName,
      emergency_contact_no: emergencyContactNo.trim(),
      gender: gender.trim(),
      dob: dob.trim()
    };

    await handleUpdateProfile(payload);
    setIsEditing(false);
  };

  return (
    <div
      className="content-view active-view"
      style={{
        maxWidth: '780px',
        margin: '0 auto',
        padding: '0px'
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        {/* Main Profile Info Card */}
        <div
          className="glassmorphism"
          style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            borderRadius: '24px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)'
          }}
        >
          {/* Header section with User Avatar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                className="user-avatar"
                style={{
                  width: '84px',
                  height: '84px',
                  fontSize: '32px',
                  fontWeight: 700,
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {getInitials(currentUser.name)}
              </div>
              <div>
                <h2
                  style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    margin: '0 0 6px 0'
                  }}
                >
                  {currentUser.name}
                </h2>
                <p
                  style={{
                    color: 'var(--primary-light)',
                    fontWeight: 600,
                    fontSize: '14px',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{currentUser.role}</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span>{currentUser.department}</span>
                </p>
              </div>
            </div>

            {/* Toggle Edit buttons */}
            <div>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  style={{
                    background: 'rgba(79, 70, 229, 0.08)',
                    color: 'var(--primary)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(79, 70, 229, 0.08)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                >
                  <Edit2 style={{ width: '15px', height: '15px' }} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  >
                    <X style={{ width: '15px', height: '15px' }} />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 18px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px var(--primary-glow)',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    <Save style={{ width: '15px', height: '15px' }} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 1: Employment Details */}
          <div>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-main)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Shield style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
              <span>Employment Information</span>
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
              }}
            >
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                  {currentUser.email}
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Department
                </label>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                  {currentUser.department}
                </div>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Designation
                </label>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                  {currentUser.designation || 'N/A'}
                </div>
              </div>

      
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid #f1f5f9', margin: '0' }} />

          {/* Section 2: Personal Details */}
          <div>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-main)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <User style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
              <span>Personal Details</span>
            </h4>

            {/* VIEW MODE */}
            {!isEditing ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px'
                }}
              >
                {/* Gender */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Gender
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', padding: '6px 0' }}>
                    {currentUser.gender || <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>Not Specified</span>}
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Date of Birth
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', padding: '6px 0' }}>
                    {currentUser.dob ? formatDateDisplay(currentUser.dob) : <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>Not Specified</span>}
                  </div>
                </div>

                {/* Father's Name */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Father's Name
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', padding: '6px 0' }}>
                    {currentUser.fathers_name || <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>Not Specified</span>}
                  </div>
                </div>

                {/* Mobile No. */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Mobile Number
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', padding: '6px 0' }}>
                    {currentUser.mobile_no || <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>Not Specified</span>}
                  </div>
                </div>

                {/* Blood Group */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Blood Group
                  </label>
                  <div style={{ padding: '4px 0' }}>
                    {currentUser.blood_group_id ? (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        background: 'rgba(239, 68, 68, 0.08)',
                        color: '#ef4444',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700
                      }}>
                        {getBloodGroupName(currentUser.blood_group_id || null)}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>Not Specified</span>
                    )}
                  </div>
                </div>

                {/* Aadhar No. */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Aadhar Number
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', padding: '6px 0', letterSpacing: '0.05em' }}>
                    {currentUser.aadhar_no || <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>Not Specified</span>}
                  </div>
                </div>

                {/* Marital Status */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Marital Status
                  </label>
                  <div style={{ padding: '4px 0' }}>
                    {currentUser.marital_status_id ? (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        background: 'rgba(79, 70, 229, 0.08)',
                        color: 'var(--primary)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700
                      }}>
                        {getMaritalStatusName(currentUser.marital_status_id || null)}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>Not Specified</span>
                    )}
                  </div>
                </div>

                {/* Spouse Name (Only shown if Married) */}
                {isUserMarried() && (
                  <div className="form-group">
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Spouse Name
                    </label>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', padding: '6px 0' }}>
                      {currentUser.spouse_name || <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>Not Specified</span>}
                    </div>
                  </div>
                )}

                {/* Emergency Contact No. */}
                <div className="form-group" style={{ gridColumn: isUserMarried() ? 'span 1' : 'span 2' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Emergency Contact Number
                  </label>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {currentUser.emergency_contact_no ? (
                      <>
                        <Phone style={{ width: '14px', height: '14px' }} />
                        <span>{currentUser.emergency_contact_no}</span>
                      </>
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>Not Specified</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* EDIT MODE */
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px'
                }}
              >
                {/* Gender Selection */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 1)',
                      fontSize: '14px',
                      outline: 'none',
                      fontWeight: 500,
                      color: 'var(--text-main)',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Choose Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 1)',
                      fontSize: '14px',
                      outline: 'none',
                      fontWeight: 500,
                      color: 'var(--text-main)',
                      background: '#ffffff'
                    }}
                  />
                </div>

                {/* Father's Name */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Father's Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Richard Doe"
                    value={fathersName}
                    onChange={(e) => setFathersName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 1)',
                      fontSize: '14px',
                      outline: 'none',
                      fontWeight: 500,
                      color: 'var(--text-main)'
                    }}
                  />
                </div>

                {/* Mobile No. */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 1)',
                      fontSize: '14px',
                      outline: 'none',
                      fontWeight: 500,
                      color: 'var(--text-main)'
                    }}
                  />
                </div>

                {/* Blood Group Selection */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Blood Group
                  </label>
                  <select
                    value={bloodGroupId || ''}
                    onChange={(e) => setBloodGroupId(e.target.value ? Number(e.target.value) : null)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 1)',
                      fontSize: '14px',
                      outline: 'none',
                      fontWeight: 500,
                      color: 'var(--text-main)',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Choose Blood Group</option>
                    {bloodGroups.map(bg => (
                      <option key={bg.id} value={bg.id}>{bg.name}</option>
                    ))}
                  </select>
                </div>

                {/* Aadhar No. */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="e.g. 1234-5678-9012"
                    value={aadharNo}
                    onChange={(e) => setAadharNo(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 1)',
                      fontSize: '14px',
                      outline: 'none',
                      fontWeight: 500,
                      color: 'var(--text-main)'
                    }}
                  />
                </div>

                {/* Marital Status Selection */}
                <div className="form-group">
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Marital Status
                  </label>
                  <select
                    value={maritalStatusId || ''}
                    onChange={(e) => setMaritalStatusId(e.target.value ? Number(e.target.value) : null)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 1)',
                      fontSize: '14px',
                      outline: 'none',
                      fontWeight: 500,
                      color: 'var(--text-main)',
                      background: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Choose Marital Status</option>
                    {maritalStatuses.map(ms => (
                      <option key={ms.id} value={ms.id}>{ms.name}</option>
                    ))}
                  </select>
                </div>

                {/* Spouse Name (Only enabled/required if 'Married' selected) */}
                <div className="form-group" style={{ opacity: isSelectedMarried() ? 1 : 0.5, pointerEvents: isSelectedMarried() ? 'auto' : 'none' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Spouse Name {isSelectedMarried() && '*'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alice Doe"
                    disabled={!isSelectedMarried()}
                    required={isSelectedMarried()}
                    value={isSelectedMarried() ? spouseName : ''}
                    onChange={(e) => setSpouseName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 1)',
                      fontSize: '14px',
                      outline: 'none',
                      fontWeight: 500,
                      color: 'var(--text-main)',
                      background: isSelectedMarried() ? '#ffffff' : '#f8fafc'
                    }}
                  />
                </div>

                {/* Emergency Contact No. */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Emergency Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543211"
                    value={emergencyContactNo}
                    onChange={(e) => setEmergencyContactNo(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 1)',
                      fontSize: '14px',
                      outline: 'none',
                      fontWeight: 500,
                      color: 'var(--text-main)'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}



