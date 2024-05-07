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

function Home() {

  const [companyLoading, setCompanyLoading] = useState(false);
  const [totalsLoading, setTotalsLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsByCountryLoading, setTransactionsByCountryLoading] = useState(false);

  const { 
    company, setCompany, 
    allCompanies, setAllCompanies, 
    totals, setTotals,
    transactions, setTransactions,
    transactionsByCountry, setTransactionsByCountry,
  } = useAppContext()

  const companySelectHandler = (companyId: string) => {
    if (company?.id !== companyId) {
      const selectedCompany = allCompanies.find(company => company.id === companyId) || null;
      if (selectedCompany) {
        setCompany(selectedCompany);
      }
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
    if (company !== initialAppState.company && company) {

      setTotalsLoading(true);
      // fetch Total for the NumberCards
      fetchTotals('USD', company.id)
        .then((totalsData: Totals[]) => {
          if (totalsData.length) {
            setTotals(totalsData[0]);
          }
          setTotalsLoading(false);
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: "Something's wrong. 🐾",
            description: error.message + '. Try reloading the page.',
          })
          setTotalsLoading(false);
        });

      // fetch Transactions by Month for the Transactions Graph
      setTransactionsLoading(true);
      fetchTransactions('USD', company.id)
        .then((trans: Transactions[]) => {
          if (trans.length) {
            setTransactions(trans);
          }
          setTransactionsLoading(false);
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: "Something's wrong. 🐾",
            description: error.message + '. Try reloading the page.',
          })
          setTransactionsLoading(false);
        });

      // fetch Transactions by Country for the Transactions Graph
      setTransactionsByCountryLoading(true);
      fetchTransactions('USD', company.id, 'country')
        .then((trans: TransactionsByCountry[]) => {
          if (trans.length) {
            setTransactionsByCountry(trans);
          }
          setTransactionsByCountryLoading(false);
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: "Something's wrong. 🐾",
            description: error.message + '. Try reloading the page.',
          });
          setTransactionsByCountryLoading(false);
        });

      


    }
  }, [company])





  const data = [
    { country: 'USA', value: 100 },
    { country: 'Canada', value: 50 },
    { country: 'UK', value: 80 },
    // Add more countries and their transaction counts
  ];

  return (
    <div className="grid grid-cols-5 gap-4 px-6">

      <div>
        <CompanySelector 
          companies={allCompanies} 
          selectHandler={companySelectHandler}
        />
      </div>

      <div className="col-span-2">
        <PeriodSelector/>
      </div>

      <div>
        <CurrencySelector/>
      </div>
      <div>
        <AutoRefreshSwitch defaultChecked={false}/>
      </div>


      <div className="col-start-1 col-end-3">
        <CompanyCard 
          company={company}  
          isLoading={companyLoading}
        />
      </div>

      <div>
        <NumberCard 
          title="Cash going-in" 
          totals={totals} 
          type="credit" 
          currency="USD"
          isLoading={totalsLoading}
        />
      </div>
      <div>
        <NumberCard 
          title="Cash going-out" 
          totals={totals} type="debit"  
          currency="USD"
          isLoading={totalsLoading}
        />
      </div>
      <div>
        <NumberCard 
          title="Profit/Loss" 
          totals={totals} 
          type="profit_loss" 
          currency="USD"
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

      <div className="col-span-3">
        <ProfitLossCard 
          transactions={transactions}
          isLoading={transactionsLoading}
        />
      </div>

      <div className="col-span-2">
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