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
import { fetchCompanies } from '../requests';
import Company from '../context/types/Company';
import { toast } from '../components/ui/use-toast';
import { Toaster } from "../components/ui/toaster"
import CurrencySelector from '../components/CurrencySelector';
import AutoRefreshSwitch from '../components/AutoRefreshSwitch';

function Home() {

  const { company, setCompany, allCompanies, setAllCompanies } = useAppContext()

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


  const data = [
    { country: 'USA', value: 100 },
    { country: 'Canada', value: 50 },
    { country: 'UK', value: 80 },
    // Add more countries and their transaction counts
  ];

  return (
    <div className="grid grid-cols-5 gap-4">

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