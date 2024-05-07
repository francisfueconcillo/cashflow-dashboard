import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';


import countries from './countries.geo.json';
import './style.css';
import coordinates from './coordinates';

const getCoordinateFromCountryCode = (countryCode) => {

  const countryLocation = coordinates.filter((item => item.code === countryCode ));

  if (countryLocation.length) {
    return [countryLocation[0].long, countryLocation[0].lat]
  } else {
    return [0, 0]
  }
  
}


const TransactionsWorldMap = ({ transactions, isLoading }) => {
  const initialMarkers = [];
  const [markers, setMarkers] = useState(initialMarkers)

  useEffect(()=>{

    if (transactions.length) {
      const newMarkers = transactions.map((trans) => ({
        value: trans.transaction_count,
        coordinates: getCoordinateFromCountryCode(trans.country),
      }))
      setMarkers(newMarkers);
    }
  }, [transactions])

  return (
    <div  className='flex flex-col p-4 bg-white rounded-xl'>
      <h3>Transactions (by Country)</h3>

      {
        isLoading
        ? <div className="flex items-center justify-center h-36">
            <p className="text-center text-gray-400">Loading...</p>
          </div>
        : transactions.length 
          ? <div>
              <ComposableMap style={{ width: "700", height: "300" }}>
                <Geographies geography={countries}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="white"
                    stroke="gray"
                  />
                    ))
                  }
                </Geographies>

                {
                  markers.map(mark => {
                    console.log(mark)
                    return <Marker coordinates={mark.coordinates}>
                      <circle r={mark.value/100} fill="#F00"  fill-opacity="0.5" />
                    </Marker>
                  }
                    
                  )
                }
              </ComposableMap>
            </div>
          : <div className="flex items-center justify-center h-36">
              <p className="text-center text-gray-300">No data</p>
            </div>
      }

    </div>
    
  );
};


export default TransactionsWorldMap;
