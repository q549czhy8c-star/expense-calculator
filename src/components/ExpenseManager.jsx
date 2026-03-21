import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X, Receipt } from 'lucide-react';

export default function ExpenseManager({ participants, expenses, setExpenses }) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('HKD');
    const [payerId, setPayerId] = useState('');
    const [involvedIds, setInvolvedIds] = useState([]);

    const toggleInvolved = (id) => {
        setInvolvedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (involvedIds.length === participants.length) {
            setInvolvedIds([]);
        } else {
            setInvolvedIds(participants.map(p => p.id));
        }
    };

    const addExpense = (e) => {
        e.preventDefault();
        if (!title.trim() || !amount || !payerId || involvedIds.length === 0) {
            alert("請填寫完整資訊並選擇參與者");
            return;
        }
        const newExpense = {
            id: uuidv4(),
            title: title.trim(),
            amount: parseFloat(amount),
            currency: currency,
            payerId,
            involvedIds
        };
        setExpenses([...expenses, newExpense]);
        // Reset fields
        setTitle('');
        setAmount('');
    };

    const removeExpense = (id) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    if (participants.length === 0) {
        return (
            <section className="glass-panel section-card" style={{ opacity: 0.6 }}>
                <div className="flex-row title">
                    <Receipt size={24} />
                    <h2>2. 支出項目</h2>
                </div>
                <p className="subtitle">請先新增參與者才能加入支出。</p>
            </section>
        );
    }

    return (
        <section className="glass-panel section-card">
            <div className="flex-row title">
                <Receipt size={24} />
                <h2>2. 支出項目 ({expenses.length})</h2>
            </div>

            <form onSubmit={addExpense} className="flex-col" style={{ gap: '1rem' }}>
                <div className="flex-row" style={{ flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="項目 (例如: 晚餐)..."
                        className="input-field"
                        style={{ flex: '1 1 200px' }}
                    />
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="select-field"
                        style={{ width: '90px', flex: '0 0 auto', padding: '0.875rem 0.6rem' }}
                    >
                        <option value="HKD">HKD</option>
                        <option value="RMB">RMB</option>
                    </select>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="金額"
                        className="input-field"
                        style={{ flex: '0 0 100px' }}
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="flex-col">
                    <label className="subtitle" style={{ marginBottom: '0.25rem', color: 'var(--text-main)', fontWeight: 500 }}>誰先付款？</label>
                    <select
                        value={payerId}
                        onChange={(e) => setPayerId(e.target.value)}
                        className="select-field"
                    >
                        <option value="" disabled>-- 選擇代墊者 --</option>
                        {participants.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex-col">
                    <label className="subtitle" style={{ marginBottom: '0.25rem', color: 'var(--text-main)', fontWeight: 500 }}>
                        誰有參與這筆花費？ ({involvedIds.length}/{participants.length})
                    </label>
                    <div className="checkbox-group">
                        <button type="button" onClick={toggleAll} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                            {involvedIds.length === participants.length ? '取消全選' : '全選'}
                        </button>
                        {participants.map(p => {
                            const checked = involvedIds.includes(p.id);
                            return (
                                <label key={p.id} className={`checkbox-label ${checked ? 'selected' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleInvolved(p.id)}
                                    />
                                    {p.name}
                                </label>
                            );
                        })}
                    </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                    <Plus size={20} />
                    加入支出
                </button>
            </form>

            {expenses.length > 0 && (
                <div className="item-list">
                    {expenses.map(e => {
                        const payer = participants.find(p => p.id === e.payerId)?.name || '未知';
                        return (
                            <div key={e.id} className="list-item flex-col" style={{ alignItems: 'flex-start' }}>
                                <div className="flex-between" style={{ width: '100%' }}>
                                    <div className="flex-row">
                                        <strong style={{ fontSize: '1.1rem' }}>{e.title}</strong>
                                        <span className="badge">{e.currency === 'RMB' ? '¥' : 'HK$'}{e.amount.toFixed(2)} {e.currency}</span>
                                    </div>
                                    <button onClick={() => removeExpense(e.id)} className="btn-danger" aria-label="Remove">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="subtitle" style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                                    付款人: <span style={{ color: 'var(--text-main)' }}>{payer}</span> | 參與: {e.involvedIds.length} 人
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
