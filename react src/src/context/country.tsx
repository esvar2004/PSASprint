import React, { createContext, useContext, useState } from "react";

const CountryContext = createContext<any>(null);

export const useCountry = () => {
  return useContext(CountryContext);
};

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("India");

  return (
    <CountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
      {children}
    </CountryContext.Provider>
  );
};
