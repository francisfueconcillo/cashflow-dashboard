import Company from './Company';
import Totals from './Totals';
import TransactionsByCountry from './TransactionsByCountry';
import TransactionsByDay from './TransactionsByDay';
import TransactionsByMonth from './TransactionsByMonth';

type AppContextType = {
  company: Company | null,
  setCompany: (company: Company | null) => void,
  allCompanies: Company[] | [],
  setAllCompanies: (companies: Company[] | []) => void,
  totals: Totals | null,
  setTotals: (totals: Totals | null) => void,
  transactionsByMonth: TransactionsByMonth[],
  setTransactionsByMonth: (transactionsByMonth: TransactionsByMonth[] | []) => void,
  transactionsByDay: TransactionsByDay[],
  setTransactionsByDay: (transactionsByDay: TransactionsByDay[] | []) => void,
  transactionsByCountry: TransactionsByCountry[],
  setTransactionsByCountry: (transactionsByCountry: TransactionsByCountry[] | []) => void,
};

export default AppContextType;