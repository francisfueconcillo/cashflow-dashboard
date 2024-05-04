import Company from './Company';
import Totals from './Totals';
import TransactionsByCountry from './TransactionsByCountry';
import Transactions from './Transactions';

type AppContextType = {
  company: Company | null,
  setCompany: (company: Company | null) => void,
  allCompanies: Company[] | [],
  setAllCompanies: (companies: Company[] | []) => void,
  totals: Totals | null,
  setTotals: (totals: Totals | null) => void,
  transactions: Transactions[] | [],
  setTransactions: (transactions: Transactions[] | []) => void,
  transactionsByCountry: TransactionsByCountry[],
  setTransactionsByCountry: (transactionsByCountry: TransactionsByCountry[] | []) => void,
};

export default AppContextType;