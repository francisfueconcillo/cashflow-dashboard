import React, { createContext, useState, useContext, ReactElement, useEffect } from 'react';

import AppContextType from './types/AppContextType';
import Company from './types/Company';
import Totals from './types/Totals';
import TransactionsByMonth from './types/TransactionsByMonth';
import TransactionsByDay from './types/TransactionsByDay';
import TransactionsByCountry from './types/TransactionsByCountry';

const initialAppState: AppContextType = {
  company: null,
  setCompany: () => {},
  allCompanies: [],
  setAllCompanies: () => {},
  totals: null,
  setTotals: () => {},
  transactionsByMonth: [],
  setTransactionsByMonth: () => {},
  transactionsByDay: [],
  setTransactionsByDay: () => {},
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
  const [transactionsByMonth, setTransactionsByMonth] = useState<TransactionsByMonth[] | []>(initialAppState.transactionsByMonth);
  const [transactionsByDay, setTransactionsByDay] = useState<TransactionsByDay[] | []>(initialAppState.transactionsByDay);
  const [transactionsByCountry, setTransactionsByCountry] = useState<TransactionsByCountry[] | []>(initialAppState.transactionsByCountry);


  return (
    <AppContext.Provider value={{ 
        company, setCompany, 
        allCompanies, setAllCompanies,
        totals, setTotals,
        transactionsByMonth, setTransactionsByMonth,
        transactionsByDay, setTransactionsByDay,
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