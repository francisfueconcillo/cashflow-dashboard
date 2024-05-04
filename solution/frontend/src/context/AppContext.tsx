import React, { createContext, useState, useContext, ReactElement, useEffect } from 'react';

import AppContextType from './types/AppContextType';
import Company from './types/Company';
import Totals from './types/Totals';
import Transactions from './types/Transactions';
import TransactionsByCountry from './types/TransactionsByCountry';

const initialAppState: AppContextType = {
  company: null,
  setCompany: () => {},
  allCompanies: [],
  setAllCompanies: () => {},
  totals: null,
  setTotals: () => {},
  transactions: [],
  setTransactions: () => {},
  transactionsByCountry: [],
  setTransactionsByCountry: () => {},
};

const AppContext = createContext<AppContextType>(initialAppState);

type Props = {
  children: ReactElement
}

const AppProvider = ({children}: Props) => {
  const [company, setCompany] = useState<Company | null>(initialAppState.company);
  const [allCompanies, setAllCompanies] = useState<Company[] | []>(initialAppState.allCompanies);
  const [totals, setTotals] = useState<Totals | null>(initialAppState.totals);
  const [transactions, setTransactions] = useState<Transactions[] | []>(initialAppState.transactions);
  const [transactionsByCountry, setTransactionsByCountry] = useState<TransactionsByCountry[] | []>(initialAppState.transactionsByCountry);


  return (
    <AppContext.Provider value={{ 
        company, setCompany, 
        allCompanies, setAllCompanies,
        totals, setTotals,
        transactions, setTransactions,
        transactionsByCountry, setTransactionsByCountry
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to make sure AppContext is used withing the AppProvider
const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === initialAppState) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { AppProvider, useAppContext, initialAppState };