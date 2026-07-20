import { useState, useEffect } from 'react';
import { Plus, Settings, Download, Upload, Trash2, Edit2, X } from 'lucide-react';
import { database, ref, get, set, remove, update } from '../lib/firebase';
import Papa from 'papaparse';
import styles from '../styles/Home.module.css';

export default function CRM() {
  const [leads, setLeads] = useState([]);
  const [columns, setColumns] = useState(['name', 'phone', 'email', 'company', 'status']);
  const [showModal, setShowModal] = useState(false);
  const [showColsModal, setShowColsModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newCol, setNewCol] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dbRef = ref(database, 'crm');
      const snapshot = await get(dbRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        setLeads(data.leads || []);
        setColumns(data.columns || ['name', 'phone', 'email', 'company', 'status']);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const saveData = async (newLeads, newColumns) => {
    try {
      const dbRef = ref(database, 'crm');
      await set(dbRef, {
        leads: newLeads,
        columns: newColumns,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const addLead = () => {
    const newLead = {
      id: Date.now(),
      ...Object.fromEntries(columns.map(col => [col, '']))
    };
    const updated = [...leads, newLead];
    setLeads(updated);
    saveData(updated, columns);
    setFormData(newLead);
    setEditingId(newLead.id);
    setShowModal(true);
  };

  const editLead = (lead) => {
    setFormData(lead);
    setEditingId(lead.id);
    setShowModal(true);
  };

  const saveLead = () => {
    const updated = leads.map(l => l.id === editingId ? formData : l);
    setLeads(updated);
    saveData(updated, columns);
    setShowModal(false);
    setEditingId(null);
    setFormData({});
  };

  const deleteLead = (id) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    saveData(updated, columns);
  };

  const addColumn = () => {
    if (newCol.trim() && !columns.includes(newCol.trim())) {
      const updated = [...columns, newCol.trim()];
      setColumns(updated);
      const leadsWithCol = leads.map(l => ({ ...l, [newCol.trim()]: '' }));
      setLeads(leadsWithCol);
      saveData(leadsWithCol, updated);
      setNewCol('');
    }
  };

  const removeColumn = (col) => {
    const updated = columns.filter(c => c !== col);
    setColumns(updated);
    const leadsNoCol = leads.map(({ [col]: _, ...rest }) => rest);
    setLeads(leadsNoCol);
    saveData(leadsNoCol, updated);
  };

  const exportCSV = () => {
    const csv = Papa.unparse([
      columns,
      ...leads.map(l => columns.map(c => l[c] || ''))
    ]);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${Date.now()}.csv`;
    a.click();
  };

  const importCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const newColumns = Object.keys(results.data[0]);
          setColumns(newColumns);
          const newLeads = results.data.map((row, idx) => ({
            id: Date.now() + idx,
            ...row
          }));
          setLeads(newLeads);
          saveData(newLeads, newColumns);
        }
      }
    });
  };

  if (loading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Partechnology CRM</h1>
        <div className={styles.toolbar}>
          <button onClick={addLead} className={styles.btnPrimary}>
            <Plus size={18} /> Add Lead
          </button>
          <button onClick={() => setShowColsModal(true)} className={styles.btnSecondary}>
            <Settings size={18} /> Columns
          </button>
          <button onClick={exportCSV} className={styles.btnSecondary}>
            <Download size={18} /> Export
          </button>
          <label className={styles.btnSecondary}>
            <Upload size={18} /> Import
            <input type="file" accept=".csv" onChange={importCSV} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id}>
                {columns.map(col => (
                  <td key={col}>{lead[col] || '-'}</td>
                ))}
                <td className={styles.actions}>
                  <button onClick={() => editLead(lead)} className={styles.btnEdit}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteLead(lead.id)} className={styles.btnDelete}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? 'Edit Lead' : 'New Lead'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {columns.map(col => (
                <div key={col} className={styles.formGroup}>
                  <label>{col}</label>
                  <input
                    type="text"
                    value={formData[col] || ''}
                    onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
                    placeholder={col}
                  />
                </div>
              ))}
            </div>
            <div className={styles.modalFooter}>
              <button onClick={saveLead} className={styles.btnPrimary}>Save</button>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className={styles.btnSecondary}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showColsModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Manage Columns</h2>
              <button onClick={() => setShowColsModal(false)} className={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.addColForm}>
                <input
                  type="text"
                  value={newCol}
                  onChange={(e) => setNewCol(e.target.value)}
                  placeholder="New column name"
                  onKeyPress={(e) => e.key === 'Enter' && addColumn()}
                />
                <button onClick={addColumn} className={styles.btnPrimary}>Add</button>
              </div>
              <div className={styles.colsList}>
                {columns.map(col => (
                  <div key={col} className={styles.colItem}>
                    <span>{col}</span>
                    <button onClick={() => removeColumn(col)} className={styles.btnDelete}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setShowColsModal(false)} className={styles.btnSecondary}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
