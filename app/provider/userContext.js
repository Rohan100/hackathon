// UserContext.js
'use client'
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

// Create the context
const MapContext = createContext();

export const useGlobal = () => useContext(MapContext);
// Create the provider component
export const UserProvider = ({ children }) => {

    const [crimeData, setCrimeData] = useState([])
    const [map,setMap] = useState();
    useEffect( () => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/server/data")
                setCrimeData(response.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchData();
    }, [])

    // The value prop will hold the values and functions we want to share
    return (<MapContext.Provider value={{ crimeData, setCrimeData,map,setMap }}>
        {children}
    </MapContext.Provider>
    );
};
