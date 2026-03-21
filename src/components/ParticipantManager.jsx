import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X, Users } from 'lucide-react';

export default function ParticipantManager({ participants, setParticipants }) {
    const [name, setName] = useState('');

    const addParticipant = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setParticipants([...participants, { id: uuidv4(), name: name.trim() }]);
        setName('');
    };

    const removeParticipant = (id) => {
        setParticipants(participants.filter(p => p.id !== id));
    };

    return (
        <section className="glass-panel section-card">
            <div className="flex-row title">
                <Users size={24} />
                <h2>1. 參與者 ({participants.length})</h2>
            </div>

            <form onSubmit={addParticipant} className="flex-row">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="輸入朋友名稱 (例如: Keith)..."
                    className="input-field"
                />
                <button type="submit" className="btn-primary">
                    <Plus size={20} />
                    新增
                </button>
            </form>

            {participants.length > 0 && (
                <div className="item-list">
                    {participants.map(p => (
                        <div key={p.id} className="list-item">
                            <span style={{ fontWeight: 500 }}>{p.name}</span>
                            <button
                                onClick={() => removeParticipant(p.id)}
                                className="btn-danger"
                                aria-label="Remove"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
