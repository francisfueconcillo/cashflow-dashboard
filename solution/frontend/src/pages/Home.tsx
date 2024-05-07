import React, { useEffect, useState} from 'react';
import CompanySelector from '../components/CompanySelector';
import PeriodSelector from '../components/PeriodSelector';
import CompanyCard from '../components/CompanyCard';
import NumberCard from '../components/NumberCard';
import TransactionsCard from '../components/TransactionsCard';
import ProfitLossCard from '../components/ProfitLossCard';
import TransactionsWorldMap from '../components/TransactionsWorldMap';
import { initialAppState } from '../context/AppContext';

import { useAppContext } from '../context/AppContext';
import { fetchCompanies, fetchTotals, fetchTransactions } from '../requests';
import Company from '../context/types/Company';
import { toast } from '../components/ui/use-toast';
import { Toaster } from "../components/ui/toaster"
import CurrencySelector from '../components/CurrencySelector';
import AutoRefreshSwitch from '../components/AutoRefreshSwitch';
import Totals from '../context/types/Totals';
import Transactions from '../context/types/Transactions';
import TransactionsByCountry from '../context/types/TransactionsByCountry';
import AppConfig from '../appConfig';
import { addDays, format } from "date-fns"


function Home() {
  const [companyLoading, setCompanyLoading] = useState(false);
  const [totalsLoading, setTotalsLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsByCountryLoading, setTransactionsByCountryLoading] = useState(false);

  const [currency, setCurrency] = useState('USD');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const [fromDateRange, setFromDateRange] = useState(new Date(2018, 0, 1))
  const [toDateRange, setToDateRange] = useState(new Date())

  const { 
    company, setCompany, 
    allCompanies, setAllCompanies, 
    totals, setTotals,
    transactions, setTransactions,
    transactionsByCountry, setTransactionsByCountry,
  } = useAppContext()


  const handleFromDateChange = (from: Date | undefined) => {
    if (from) setFromDateRange(from);
  }

  const handleToDateChange = (to: Date | undefined) => {
    if (to) setToDateRange(to);
  }

  const companySelectHandler = (companyId: string) => {
    if (company?.id !== companyId) {
      const selectedCompany = allCompanies.find(company => company.id === companyId) || null;
      if (selectedCompany) {
        setCompany(selectedCompany);
      }
    }
  }

  const changeCurrencyHandler = (newCurrency: string) => {
    setCurrency(newCurrency);
    setAutoRefresh(false);
  };

  const fetchData = (showLoading?: boolean) => {
    if (company) {
      if (showLoading) setTotalsLoading(true);
      // fetch Total for the NumberCards
      fetchTotals(currency, company.id, fromDateRange, toDateRange)
        .then((totalsData: Totals[]) => {
          if (totalsData.length) {
            setTotals(totalsData[0]);
          } else {
            setTotals(null);
          }

          if (showLoading) setTotalsLoading(false);
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: "Something's wrong. 🐾",
            description: error.message + '. Try reloading the page.',
          })
          setTotals(null);
          if (showLoading) setTotalsLoading(false);

        });

      // fetch Transactions by Month for the Transactions Graph
      if (showLoading) setTransactionsLoading(true);
      fetchTransactions(currency, company.id, fromDateRange, toDateRange, 'month')
        .then((trans: Transactions[]) => {
          if (trans.length) {
            setTransactions(trans);
          } else {
            setTransactions([]);
          }
          if (showLoading) setTransactionsLoading(false);

        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: "Something's wrong. 🐾",
            description: error.message + '. Try reloading the page.',
          })
          setTransactions([]);
          if (showLoading) setTransactionsLoading(false);
        });

      // fetch Transactions by Country for the Transactions Graph
      if (showLoading) setTransactionsByCountryLoading(true);
      fetchTransactions(currency, company.id, fromDateRange, toDateRange, 'country')
        .then((trans: TransactionsByCountry[]) => {
          if (trans.length) {
            setTransactionsByCountry(trans);
          } else {
            setTransactionsByCountry([]);
          }
          if (showLoading) setTransactionsByCountryLoading(false);
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: "Something's wrong. 🐾",
            description: error.message + '. Try reloading the page.',
          });
          setTransactionsByCountry([]);
          if (showLoading) setTransactionsByCountryLoading(false);
        });
    }
  }


  useEffect(() => {
    if (allCompanies === initialAppState.allCompanies) {
      setCompanyLoading(true);
      fetchCompanies()
        .then((companies: Company[]) => {
          if (companies.length) {
            setAllCompanies(companies);
          }
          setCompanyLoading(false);
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: "Something's wrong. 🐾",
            description: error.message + '. Try reloading the page.',
          })
          setCompanyLoading(false);
        });
    }
  }, [allCompanies])


  useEffect(()=>{
    if (company !== initialAppState.company) {
      fetchData(true);
    }
  }, [company, currency, fromDateRange, toDateRange])



  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (autoRefresh) {
      fetchData(false);
      intervalId = setInterval(fetchData, AppConfig.AUTO_REFRESH_INTERVAL);
    }

    return () => {
      // Clean up interval when component unmounts or auto-refresh is turned off
      clearInterval(intervalId);
    };
  }, [autoRefresh]); // Re-run effect when autoRefresh state changes


  return (
    <div className="grid grid-cols-5 gap-4 p-6 ">

      <div className="col-span-5 xl:col-span-1">
        <CompanySelector 
          companies={allCompanies} 
          selectHandler={companySelectHandler}
        />
      </div>

      <div className="col-span-5 xl:col-span-2">
        <PeriodSelector 
          fromDate={fromDateRange}
          toDate={toDateRange}
          setFromDateRange={handleFromDateChange}
          setToDateRange={handleToDateChange}
        />
      </div>

      <div className="col-span-3 xl:col-span-1">
        <CurrencySelector 
          currency={currency} 
          changeHandler={changeCurrencyHandler}
        />
      </div>
      <div className="col-span-2 xl:col-span-1">
        <AutoRefreshSwitch 
          checked={autoRefresh}
          changeHandler={(value: boolean) => setAutoRefresh(value)}
        />
      </div>


      <div className="col-span-5 xl:col-start-1 xl:col-end-3">
        <CompanyCard 
          company={company}  
          isLoading={companyLoading}
        />
      </div>

      <div className="col-span-5 xl:col-span-1">
        <NumberCard 
          title="Cash going-in" 
          totals={totals} 
          type="credit" 
          currency={currency}
          isLoading={totalsLoading}
        />
      </div>
      <div className="col-span-5 xl:col-span-1">
        <NumberCard 
          title="Cash going-out" 
          totals={totals} type="debit"  
          currency={currency}
          isLoading={totalsLoading}
        />
      </div>
      <div className="col-span-5 xl:col-span-1">
        <NumberCard 
          title="Profit/Loss" 
          totals={totals} 
          type="profit_loss" 
          currency={currency}
          useColors={true}
          isLoading={totalsLoading}
        />
      </div>
      <div className="col-span-5">
        <TransactionsCard 
          transactions={transactions} type="month" 
          isLoading={transactionsLoading}
        />
      </div>

      <div className="col-span-5 xl:col-span-3">
        <ProfitLossCard 
          transactions={transactions}
          isLoading={transactionsLoading}
        />
      </div>

      <div className="col-span-5 xl:col-span-2">
        <TransactionsWorldMap 
          transactions={transactionsByCountry}
          isLoading={transactionsByCountryLoading}
        />
      </div>
      <Toaster />
    </div>
  )

}

export default Home;