import React, { useEffect } from 'react';
import Header from '../components/Header';
import CompanySelector from '../components/CompanySelector';
import PeriodSelector from '../components/PeriodSelector';
import CompanyCard from '../components/CompanyCard';
import NumberCard from '../components/NumberCard';
import TransactionsCard from '../components/TransactionsCard';
import ProfitLossCard from '../components/ProfitLossCard';
import TransactionsWorldMap from '../components/TransactionsWorldMap';
import { initialAppState } from '../context/AppContext';

import { useAppContext } from '../context/AppContext';
import { fetchCompanies, fetchTotals } from '../requests';
import Company from '../context/types/Company';
import { toast } from '../components/ui/use-toast';
import { Toaster } from "../components/ui/toaster"
import CurrencySelector from '../components/CurrencySelector';
import AutoRefreshSwitch from '../components/AutoRefreshSwitch';
import Totals from '@/context/types/Totals';

function Home() {

  const { company, setCompany, allCompanies, setAllCompanies, totals, setTotals } = useAppContext()

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


  useEffect(()=>{
    if (company !== initialAppState.company && company) {
      fetchTotals('USD', company.id)
        .then((totalsData: Totals[]) => {
          if (totalsData.length) {
            setTotals(totalsData[0]);
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
        <CompanySelector companies={allCompanies} selectHandler={companySelectHandler}/>
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
        <CompanyCard company={company}/>
      </div>

      <div>
        <NumberCard 
          title="Cash going-in" 
          totals={totals} 
          type="credit" 
          currency="USD"
        />
      </div>
      <div>
        <NumberCard 
          title="Cash going-out" 
          totals={totals} type="debit"  
          currency="USD"
        />
      </div>
      <div>
        <NumberCard 
          title="Profit/Loss" 
          totals={totals} 
          type="profit_loss" 
          currency="USD"
          useColors={true}
        />
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