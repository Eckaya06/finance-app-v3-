import { useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import './BudgetDetailCard.css';
import { Link } from 'react-router-dom';
import BudgetOptionsMenu from './BudgetOptionsMenu.jsx';
import { useTransactions } from '../../context/TransactionContext.jsx';

const BudgetDetailCard = ({ budget, onEditRequest, onDeleteRequest }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { transactions } = useTransactions();

  // ✅ ZAMAN KİLİDİ: Sadece bütçe oluşturulduktan sonraki harcamaları al
  const relevantTransactions = transactions.filter(tx => 
    tx.category === budget.category && 
    tx.type === 'expense' &&
    Number(tx.id) > (budget.createdAt || 0)
  );
  
  const spent = relevantTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const limitNum = Number(budget.limit || budget.maxSpend || 0);
  const remaining = limitNum - spent;
  
  const spentPercentage = limitNum > 0 ? (spent / limitNum) * 100 : 0;
  const remainingPercentage = limitNum > 0 ? Math.max(0, (remaining / limitNum) * 100) : 0;

  const theme = themeOptions.find(t => t.value === budget.theme) || themeOptions[0];
  const latestTransactions = relevantTransactions.slice(0, 2);

  // ✅ DÜZELTME: Yerel ayar 'en-GB' yapıldı (Artık İngilizce yazacak)
  const creationDate = budget.createdAt 
    ? new Date(budget.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="budget-detail-card" style={{ position: 'relative' }}>
      <div className="card-header">
        <div className="theme-option-display" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="theme-color-swatch" style={{ backgroundColor: theme.color, width: '12px', height: '12px', borderRadius: '50%' }}></span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{budget.category}</h3>
            {/* Tarih artık İngilizce görünecek */}
            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Created: {creationDate}</span>
          </div>
        </div>
        <button className="pot-options-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FiMoreHorizontal size={18} />
        </button>
      </div>

      {isMenuOpen && (
        <BudgetOptionsMenu 
          onEdit={() => { onEditRequest(); setIsMenuOpen(false); }}
          onDelete={() => { onDeleteRequest(); setIsMenuOpen(false); }}
        />
      )}

      <p className="budget-limit-text">Maximum of ${limitNum.toFixed(2)}</p>
      
      <div className="progress-bar-container" style={{ background: '#f8fafc', padding: '3px', height: '12px', marginTop: '5px' }}>
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${remainingPercentage}%`, 
            backgroundColor: theme.color,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
          }}
        ></div>
      </div>
      
      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', textAlign: 'right', fontWeight: '700' }}>
        {spentPercentage.toFixed(1)}% spent
      </div>

      <div className="budget-spend-summary">
        <div className="summary-item">
          <span className="summary-label">Spent</span>
          <span className="summary-value">${spent.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Remaining</span>
          <span className={`summary-value ${remaining < 0 ? 'negative' : ''}`}>
            ${remaining.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="latest-spending">
        <div className="latest-spending-header">
          <h4>Latest Spending</h4>
          <Link to={`/transactions?category=${encodeURIComponent(budget.category)}`} className="see-all-link">
            See All ▸
          </Link>
        </div>
        
        <div className="latest-spending-list">
          {latestTransactions.length === 0 ? (
            <div className="latest-empty" style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#94a3b8' }}>
              No spending yet since creation.
            </div>
          ) : (
            latestTransactions.map((tx) => (
              <div className="latest-row" key={tx.id}>
                <div className="latest-left">
                  <span className="latest-name">{tx.title || tx.name}</span>
                  <span className="latest-date">{tx.date}</span>
                </div>
                <span className="latest-amount">-${Math.abs(Number(tx.amount)).toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const themeOptions = [
  { value: 'blue',   label: 'Blue',   color: '#3b82f6' },
  { value: 'cyan',   label: 'Cyan',   color: '#06b6d4' },
  { value: 'green',  label: 'Green',  color: '#22c55e' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'red',    label: 'Red',    color: '#ef4444' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
];

export default BudgetDetailCard;