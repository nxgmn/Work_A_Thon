import React, { useState, useEffect } from 'react';

/**
 * A component for editing min/max task points from the server.
 * Immediately saves changes as soon as the user types them.
 */
export default function Settings() {
  const [settings, setSettings] = useState({ minTaskPoints: 1, maxTaskPoints: 50 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1) Fetch current settings on mount
  useEffect(() => {
    fetch('https://work-a-thon.onrender.com/api/settings')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch settings: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 2) Handle changes locally, then auto-save to the server
  const handleChange = async (field, value) => {
    const newVal = parseInt(value, 10) || 0;

    // Update local state so UI reflects the change
    setSettings((prev) => ({
      ...prev,
      [field]: newVal
    }));

    // Immediately call PUT /api/settings
    try {
      const response = await fetch('https://work-a-thon.onrender.com/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          [field]: newVal
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save settings: ${response.status}`);
      }

      // We might update local state with the response if needed:
      const updated = await response.json();
      setSettings(updated);

    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ margin: '1rem 0' }}>
      <h3>Task Points Settings</h3>
      <div>
        <label>
          Min Task Points:
          <input
            type="number"
            value={settings.minTaskPoints}
            onChange={(e) => handleChange('minTaskPoints', e.target.value)}
            style={{ marginLeft: '8px', marginRight: '16px' }}
          />
        </label>

        <label>
          Max Task Points:
          <input
            type="number"
            value={settings.maxTaskPoints}
            onChange={(e) => handleChange('maxTaskPoints', e.target.value)}
            style={{ marginLeft: '8px', marginRight: '16px' }}
          />
        </label>
      </div>
    </div>
  );
}
