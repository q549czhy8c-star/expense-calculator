import React, { useRef } from 'react';
import { Download, Calculator, ArrowRight } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function SettlementResult({ participants, expenses }) {
    const printRef = useRef(null);

    if (participants.length === 0 || expenses.length === 0) {
        return null;
    }

    // 计算每个人的花费
    const balances = participants.reduce((acc, p) => {
        acc[p.id] = { ...p, paid: 0, share: 0, net: 0 };
        return acc;
    }, {});

    expenses.forEach(expense => {
        const { amount, payerId, involvedIds } = expense;
        // 付款人增加已付金额
        if (balances[payerId]) {
            balances[payerId].paid += amount;
        }
        // 参与者增加应付金额
        const splitAmount = amount / involvedIds.length;
        involvedIds.forEach(id => {
            if (balances[id]) {
                balances[id].share += splitAmount;
            }
        });
    });

    // 计算净值 (Net) = 付出 - 应付
    let debtors = [];
    let creditors = [];

    Object.values(balances).forEach(b => {
        b.net = b.paid - b.share;
        // 使用0.01来避免浮点数精度问题
        if (b.net < -0.01) {
            debtors.push({ ...b, amountOwed: Math.abs(b.net) });
        } else if (b.net > 0.01) {
            creditors.push({ ...b, amountToReceive: b.net });
        }
    });

    // 排序：欠最多的人排前面，应收最多的人排前面
    debtors.sort((a, b) => b.amountOwed - a.amountOwed);
    creditors.sort((a, b) => b.amountToReceive - a.amountToReceive);

    // 贪心算法计算转账路径
    const transactions = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
        const debtor = debtors[dIdx];
        const creditor = creditors[cIdx];

        const amount = Math.min(debtor.amountOwed, creditor.amountToReceive);

        transactions.push({
            from: debtor.name,
            to: creditor.name,
            amount: amount
        });

        debtor.amountOwed -= amount;
        creditor.amountToReceive -= amount;

        if (debtor.amountOwed < 0.01) dIdx++;
        if (creditor.amountToReceive < 0.01) cIdx++;
    }

    const handleDownload = async () => {
        if (!printRef.current) return;
        try {
            // 稍微延迟让UI稳定后再截屏
            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                backgroundColor: '#0f172a', // 使用深色背景确保渲染正确
                logging: false,
                useCORS: true
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'expense-summary.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to export image', err);
            alert('匯出圖片發生錯誤');
        }
    };

    return (
        <div className="flex-col" style={{ gap: '1rem' }}>
            <section
                ref={printRef}
                className="glass-panel section-card"
                style={{ border: '1px solid rgba(165, 180, 252, 0.4)', padding: '2rem' }}
            >
                <div className="flex-row title" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                    <Calculator size={28} color="#a5b4fc" />
                    <h2 style={{ fontSize: '1.75rem', background: 'linear-gradient(135deg, #a5b4fc, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        3. 結算結果
                    </h2>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#c084fc', fontSize: '1.1rem', fontWeight: 600 }}>個人收支明細</h3>
                    <div className="item-list">
                        {Object.values(balances).map(b => (
                            <div key={b.id} className="list-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(255,255,255,0.02)' }}>
                                <div className="flex-between" style={{ width: '100%' }}>
                                    <strong style={{ fontSize: '1.1rem' }}>{b.name}</strong>
                                    <span className="badge" style={{
                                        background: b.net > 0 ? 'rgba(16, 185, 129, 0.15)' : b.net < 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.1)',
                                        color: b.net > 0 ? '#34d399' : b.net < 0 ? '#f87171' : 'var(--text-muted)'
                                    }}>
                                        {b.net > 0.01 ? `應收回 $${b.net.toFixed(2)}` : b.net < -0.01 ? `需支付 $${Math.abs(b.net).toFixed(2)}` : '已結清'}
                                    </span>
                                </div>
                                <div className="subtitle" style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-muted)' }}>
                                    已先付: ${b.paid.toFixed(2)} | 應分攤: ${b.share.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: '1rem', color: '#818cf8', fontSize: '1.1rem', fontWeight: 600 }}>最終轉帳明細表</h3>
                    {transactions.length === 0 ? (
                        <div className="list-item" style={{ justifyContent: 'center', color: '#34d399', fontWeight: 500 }}>
                            🎉 大家都不相欠，無須轉帳！
                        </div>
                    ) : (
                        <div className="flex-col" style={{ gap: '0.75rem' }}>
                            {transactions.map((t, i) => (
                                <div key={i} className="list-item" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.15)' }}>
                                    <div className="flex-row" style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                        <div className="flex-row" style={{ gap: '0.75rem' }}>
                                            <span style={{ fontWeight: 600, color: '#f87171', fontSize: '1.05rem' }}>{t.from}</span>
                                            <ArrowRight size={18} color="var(--text-muted)" />
                                            <span style={{ fontWeight: 600, color: '#34d399', fontSize: '1.05rem' }}>{t.to}</span>
                                        </div>
                                        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#e2e8f0' }}>${t.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '3rem' }}>
                <button onClick={handleDownload} className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '999px' }}>
                    <Download size={24} />
                    儲存此結算表為圖片
                </button>
            </div>
        </div>
    );
}
