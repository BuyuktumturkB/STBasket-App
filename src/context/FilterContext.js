import React, {createContext, useContext, useState} from 'react';

const FilterContext = createContext();

export const FilterProvider = ({children}) => {
  const replaceUnderScoreWithSpace = data => {
    if (typeof data === 'string') {
      let formattedData = data.replace(/_/g, ' ');
      formattedData = formattedData.replace(/\b\w/g, char =>
        char.toUpperCase(),
      );
      return formattedData;
    }
    return data;
  };
  return (
    <FilterContext.Provider
      value={{
        replaceUnderScoreWithSpace,
      }}>
      {children}
    </FilterContext.Provider>
  );
};
export const useFilter = () => useContext(FilterContext);
