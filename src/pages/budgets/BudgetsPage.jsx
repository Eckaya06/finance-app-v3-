import { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext.jsx';
import Modal from '../../components/modal/Modal.jsx';
import AddBudgetForm from '../../components/budgets/AddBudgetForm.jsx';
import EmptyState from '../../components/emptystate/EmptyState.jsx';
import { FiPieChart } from 'react-icons/fi';
import './BudgetsPage.css';
import BudgetDetailCard from '../../components/budgets/BudgetDetailCard.jsx';
import DeleteBudgetModal from '../../components/budgets/DeleteBudgetModal.jsx';
import emptyBudgetImg from '../../assets/empty-budget.png';

const BudgetsPage = () => {
  const { budgets, setBudgets } = useTransactions(); 
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

  const handleCreateBudget = (newBudgetData) => {
    const now = Date.now(); // Şimdiki zamanı milisaniye olarak al
    const newBudget = {
      id: now,
      ...newBudgetData,
      createdAt: now, // ✅ ZAMAN KİLİDİ: Oluşturulma tarihini buraya mühürledik
      spent: 0,
    };
    setBudgets((prev) => [newBudget, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!budgetToDelete) return;
    setBudgets((prev) => prev.filter((b) => b.id !== budgetToDelete.id));
    setBudgetToDelete(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Budgets</h1>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          + Add New Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <EmptyState
          icon={<FiPieChart />}
          title="Create Your First Budget"
          message="Set spending limits for different categories to help you monitor and control your spending."
          buttonText="+ Create First Budget"
          onAction={() => setIsAddModalOpen(true)}
          backgroundImage={emptyBudgetImg}
        />
      ) : (
        <div className="budget-cards-grid">
          {budgets.map((budget, index) => (
            <BudgetDetailCard
              key={budget.id || `fallback-key-${index}`} 
              budget={{
                ...budget,
                latestSpending: Array.isArray(budget.latestSpending) ? budget.latestSpending : [],
              }}
              onDeleteRequest={() => setBudgetToDelete(budget)}
              onEditRequest={() => alert(`Editing ${budget.category}`)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddBudgetForm
          onAddBudget={handleCreateBudget}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!budgetToDelete} onClose={() => setBudgetToDelete(null)}>
        <DeleteBudgetModal
          budget={budgetToDelete}
          onConfirm={handleDeleteConfirm}
          onClose={() => setBudgetToDelete(null)}
        />
      </Modal>
    </div>
  );
};

export default BudgetsPage;