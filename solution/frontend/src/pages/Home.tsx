import React, { useEffect } from 'react';
import Header from '../components/Header';
import CompanySelector from '../components/CompanySelector';
import PeriodSelector from '../components/PeriodSelector';
import CompanyCard from '../components/CompanyCard';
import NumberCard from '../components/NumberCard';
import TransactionsCard from '../components/TransactionsCard';
import ProfitLossCard from '../components/ProfitLossCard';
import TransactionsWorldMap from '../components/TransactionWorldMap';
import { AppProvider, initialAppState } from '../context/AppContext';

import { useAppContext } from '../context/AppContext';
import { fetchCompanies } from '../requests';
import Company from '../context/types/Company';
import { toast } from '../components/ui/use-toast';
import { Toaster } from "../components/ui/toaster"

function Home() {

  const { allCompanies, setAllCompanies } = useAppContext()

  const companySelectHandler = () => {}


  useEffect(() => {
    if (allCompanies === initialAppState.allCompanies) {
      fetchCompanies()
        .then((companies: Company[]) => {
          if (companies.length) {
            setAllCompanies(companies);
          }
        })
        .catch(error => {
          toast({
            variant: "destructive",
            title: "Something's wrong. 🐾",
            description: error.message + '. Try reloading the page.',
          })
        });
    }
  }, [allCompanies])

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-5">
        <Header/>
      </div>

      <div>
        <CompanySelector companies={allCompanies} selectHandler={companySelectHandler}/>
      </div>

      <div>
        <PeriodSelector/>
      </div>

      <div className="col-start-1 col-end-3">
        <CompanyCard/>
      </div>

      <div>
        <NumberCard title="Cash going-in" value={100000} currency="USD"/>
      </div>
      <div>
        <NumberCard title="Cash going-out" value={23000} currency="USD"/>
      </div>
      <div>
        <NumberCard title="Profit/Loss" value={77000} currency="USD"/>
      </div>
      <div className="col-span-5">
        <TransactionsCard/>
      </div>

      <div className="col-span-2">
        <ProfitLossCard/>
      </div>

      <div className="col-span-3">
        <TransactionsWorldMap/>
      </div>
      <Toaster />
    </div>
  )

}

export default Home;