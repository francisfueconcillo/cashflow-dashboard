import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';


import countries from './countries.geo.json'

import './style.css'


const TransactionsWorldMap = () => {
  const markerCoordinates = [-74.006, 40.7128]; // Example latitude and longitude (New York City)

  const markerCoordinates2 = [45.943161, 24.96676] // RO
  

  return (
    <div  className='flex p-4'>
      <h3>Transactions (by Country)</h3>
      <ComposableMap style={{ width: "700", height: "400" }}>
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
        <Marker coordinates={markerCoordinates}>
          <circle r={8} fill="#F00"  fill-opacity="0.5" />
        </Marker>

        <Marker coordinates={markerCoordinates2}>
          <circle r={24} fill="#F00" fill-opacity="0.5" />
        </Marker>
      </ComposableMap>

    </div>
    
  );
};


export default TransactionsWorldMap;
