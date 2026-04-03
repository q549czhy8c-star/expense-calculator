import React, { useState, useEffect } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import ParticipantManager from './components/ParticipantManager';
import ExpenseManager from './components/ExpenseManager';
import SettlementResult from './components/SettlementResult';
import './App.css';

function App() {
  const [participants, setParticipants] = useState(() => {
    const saved = localStorage.getItem('expenses-participants');
    return saved ? JSON.parse(saved) : [];
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses-data');
    return saved ? JSON.parse(saved) : [];
  });
  const [exchangeRate, setExchangeRate] = useState(() => {
    const saved = localStorage.getItem('expenses-rate');
    return saved ? JSON.parse(saved) : 1.08;
  }); // 預設 1 RMB = 1.08 HKD

  useEffect(() => {
    localStorage.setItem('expenses-participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('expenses-data', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('expenses-rate', JSON.stringify(exchangeRate));
  }, [exchangeRate]);

  const clearData = () => {
    if (window.confirm('確定要清除所有參與者與支出紀錄嗎？這項操作無法復原！')) {
      setParticipants([]);
      setExpenses([]);
      setExchangeRate(1.08);
      localStorage.removeItem('expenses-participants');
      localStorage.removeItem('expenses-data');
      localStorage.removeItem('expenses-rate');
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Expense Splitter</h1>
        <p>優雅地計算與分攤出門吃喝玩樂的花費</p>
      </header>

      <section className="glass-panel section-card" style={{ padding: '1rem 1.5rem', flexDirection: 'row', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Settings size={20} color="#a5b4fc" />
        <strong style={{ minWidth: 'max-content' }}>匯率設定：</strong>
        <div className="flex-row" style={{ flex: 1, flexWrap: 'wrap' }}>
          <span>1 RMB (人民幣) =</span>
          <input
            type="number"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(Number(e.target.value))}
            className="input-field"
            style={{ width: '90px', padding: '0.4rem 0.6rem' }}
            step="0.01"
            min="0.1"
          />
          <span style={{ color: 'var(--text-muted)' }}>HKD (港幣)</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={clearData} className="btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '8px' }}>
            <Trash2 size={16} />
            清除資料
          </button>
        </div>
      </section>

      <ParticipantManager
        participants={participants}
        setParticipants={setParticipants}
      />

      <ExpenseManager
        participants={participants}
        expenses={expenses}
        setExpenses={setExpenses}
      />

      <SettlementResult
        participants={participants}
        expenses={expenses}
        exchangeRate={exchangeRate}
      />
    </div>
  );
}

export default App;
