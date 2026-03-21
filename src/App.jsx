import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import ParticipantManager from './components/ParticipantManager';
import ExpenseManager from './components/ExpenseManager';
import SettlementResult from './components/SettlementResult';
import './App.css';

function App() {
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(1.08); // 預設 1 RMB = 1.08 HKD

  return (
    <div className="app-container">
      <header className="header">
        <h1>Expense Splitter</h1>
        <p>優雅地計算與分攤出門吃喝玩樂的花費</p>
      </header>

      <section className="glass-panel section-card" style={{ padding: '1rem 1.5rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
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
