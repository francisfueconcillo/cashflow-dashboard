import React from 'react';
import Header from './components/Header';
import CompanySelector from './components/CompanySelector';
import PeriodSelector from './components/PeriodSelector';
import CompanyCard from './components/CompanyCard';
import NumberCard from './components/NumberCard';
import TransactionsCard from './components/TransactionsCard';
import ProfitLossCard from './components/ProfitLossCard';
import TransactionsWorldMap from './components/TransactionWorldMap';

function App() {

  const companySelectHandler = () => {}

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-5">
        <Header/>
      </div>

      <div>
        <CompanySelector companies={[]} selectHandler={companySelectHandler}/>
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
    </div>
  );
}

export default App;
