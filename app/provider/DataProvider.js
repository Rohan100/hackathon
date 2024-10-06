// App.js (or pages/_app.js in Next.js)
'use client'
import React from 'react';
import { UserProvider } from './userContext';  // Adjust the path based on your structure

function DataProvider({ children }) {

  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}

export default DataProvider;
