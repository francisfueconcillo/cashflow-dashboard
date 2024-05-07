import React from 'react';
import Company from '../context/types/Company';

type Props = {
  company: Company | null,
  isLoading: Boolean
}
function CompanyCard({ company, isLoading }:Props) {
  return (
    <div className="flex flex-col p-4 bg-white rounded-xl h-36">
      {
        isLoading
        ? <div className="flex items-center justify-center h-36">
            <p className="text-center text-gray-400">Loading...</p>
          </div>
        : company 
          ? <div>
              <div>
                <h1>{company.name || '-'}</h1>
              </div>
              <div>
                {
                  company.ibans.map((iban, index) => <span key={index}>{iban}</span>)
                }
              </div>
              <div className="pt-6">
                <p>{company?.address || '-'}</p>
              </div>
            </div>
          : <div className="flex items-center justify-center h-36">
              <p className="text-center text-gray-300">No data</p>
            </div>
      }
      
      
    </div>
  );
}

export default CompanyCard;