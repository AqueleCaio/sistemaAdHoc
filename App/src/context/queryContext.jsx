import { createContext, useContext, useState } from 'react';

const QueryContext = createContext();

export function QueryProvider({ children }) {
  const [query, setQuery] = useState(''); // query SQL
  const [result, setResult] = useState({   // resultado da consulta
    rows: [],
    columns: [],
  });

  return (
    <QueryContext.Provider value={{ query, setQuery, result, setResult }}>
      {children}
    </QueryContext.Provider>
  );
}

export function useQuery() {
  return useContext(QueryContext);
}
