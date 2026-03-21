import React, { useState } from 'react';
import ParticipantManager from './components/ParticipantManager';
import ExpenseManager from './components/ExpenseManager';
import SettlementResult from './components/SettlementResult';
import './App.css';

function App() {
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Expense Splitter</h1>
        <p>優雅地計算與分攤出門吃喝玩樂的花費</p>
      </header>

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
      />
    </div>
  );
}

export default App;
