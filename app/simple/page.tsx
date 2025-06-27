import React from 'react'

export default function SimplePage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#22c55e', marginBottom: '1rem' }}>
          ✅ Simple Next.js Page Working!
        </h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          This page uses zero external dependencies.
        </p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          If you see this, Next.js routing is working correctly.
        </p>
        <p style={{ color: '#999', fontSize: '12px', marginTop: '2rem' }}>
          Current time: {new Date().toISOString()}
        </p>
      </div>
    </div>
  )
} 