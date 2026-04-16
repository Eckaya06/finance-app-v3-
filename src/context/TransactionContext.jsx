import { createContext, useState, useEffect, useContext } from 'react';
import { useChat } from './ChatContext'; 

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { addMessage } = useChat();

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : []; 
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);

    if (transaction.type === 'expense') {
      const category = transaction.category;
      const amount = Number(transaction.amount);
      const budget = budgets.find(b => b.category === category);

      // ✅ AI SADECE BÜTÇEDEN SONRAKİ İŞLEMLER İÇİN UYARI VERİR
      if (budget && transaction.id > (budget.createdAt || 0)) {
        const limitNum = Number(budget.limit || budget.maxSpend || 0);
        
        const previousTotal = transactions
          .filter(t => 
            t.category === category && 
            t.type === 'expense' &&
            t.id > budget.createdAt // Eski harcamaları toplama katma
          )
          .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const newTotal = previousTotal + amount;

        if (limitNum > 0) {
          const percentageUsed = (newTotal / limitNum) * 100;
          if (percentageUsed >= 75) {
            addMessage('bot', `⚠️ Warning! You've used ${percentageUsed.toFixed(1)}% of your ${category} budget!`);
          }
        }
      }
    }
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, addTransaction, budgets, setBudgets     
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);