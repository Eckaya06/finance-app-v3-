import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; 
import { useTransactions } from '../../context/TransactionContext.jsx';
import CustomDropdown from '../../components/dropdown/CustomDropdown.jsx';
import SearchInput from '../../components/search/SearchInput.jsx';
import Pagination from '../../components/pagination/Pagination.jsx';
import { getCategoryTheme } from '../../utils/categoryIcons.jsx';
import './TransactionsPage.css';

const categoryOptions = [
  "All", "Entertainment", "Bills", "Groceries", "Dining Out", "Transportation", 
  "Personal Care", "Education", "Lifestyle", "Shopping", "General", "Income"
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
];

const TransactionsPage = () => {
  const { transactions, budgets } = useTransactions(); 
  const [searchParams] = useSearchParams(); 
  const urlCategory = searchParams.get('category');

  const [sortType, setSortType] = useState('latest');
  const [filterCategory, setFilterCategory] = useState(urlCategory || 'All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (urlCategory && categoryOptions.includes(urlCategory)) {
      setFilterCategory(urlCategory);
    }
  }, [urlCategory]);

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      result = result.filter(tx => tx.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (filterCategory !== 'All') {
      const activeBudget = budgets.find(b => b.category === filterCategory);
      result = result.filter(tx => {
        const isCategoryMatch = tx.category === filterCategory;
        // Bütçe varsa bütçe tarihinden sonrasını göster
        const isAfterBudgetCreation = activeBudget ? Number(tx.id) > activeBudget.createdAt : true;
        return isCategoryMatch && isAfterBudgetCreation;
      });
    }

    switch (sortType) {
      case 'latest': 
        result.sort((a, b) => (new Date(b.date) - new Date(a.date)) || b.id - a.id); 
        break;
      case 'oldest': 
        result.sort((a, b) => (new Date(a.date) - new Date(b.date)) || a.id - b.id); 
        break;
      case 'highest': 
        result.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)); 
        break;
      case 'lowest': 
        result.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount)); 
        break;
      case 'a-z': 
        result.sort((a, b) => a.name.localeCompare(b.name)); 
        break;
      case 'z-a': 
        result.sort((a, b) => b.name.localeCompare(a.name)); 
        break;
      default: break;
    }
    return result;
  }, [transactions, budgets, sortType, filterCategory, searchTerm]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, sortType, searchTerm]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const handlePageChange = (p) => p > 0 && p <= totalPages && setCurrentPage(p);
  const currentItems = filteredAndSortedTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="page-container">
      <h1 className="page-title">Transactions</h1>
      <div className="filters-bar">
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by Recipient / Sender..." />
        <div className="dropdowns">
          <CustomDropdown 
            options={sortOptions.map(opt => opt.value)} selectedValue={sortType} onChange={setSortType}
            labelPrefix="Sort by" displayTransformer={(v) => sortOptions.find(opt => opt.value === v)?.label || v}
            isOpen={openDropdown === 'sort'} onToggle={() => handleDropdownToggle('sort')}
          />
          <CustomDropdown 
            options={categoryOptions} selectedValue={filterCategory} onChange={setFilterCategory}
            labelPrefix="Category" isOpen={openDropdown === 'category'} onToggle={() => handleDropdownToggle('category')}
          />
        </div>
      </div>
      <div className="transaction-table">
        <div className="table-header"><p>Recipient / Sender</p><p>Category</p><p>Transaction Date</p><p>Amount</p></div>
        <div className="table-body">
          {currentItems.length === 0 ? (<div className="no-data-message">No transactions found.</div>) : (
            currentItems.map((tx) => {
              const theme = getCategoryTheme(tx.category);
              return (
                <div key={tx.id} className="table-row">
                  <div className="recipient-cell">
                    <div className="tx-avatar" style={{ backgroundColor: theme.bg }}>
                      <img src={theme.image} alt={tx.category} className="category-img-icon" />
                    </div>
                    <span className="tx-name">{tx.name}</span>
                  </div>
                  <p className="category-cell">{tx.category}</p>
                  <p className="date-cell">{tx.date}</p>
                  <p className={`transaction-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                  </p>
                </div>
              );
            })
          )}
        </div>
        {currentItems.length > 0 && (<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />)}
      </div>
    </div>
  );
};

export default TransactionsPage;