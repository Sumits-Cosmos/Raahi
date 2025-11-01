import { createContext, useState, useContext } from 'react';


// Create the context
export const CaptainDataContext = createContext();

// Create a provider component
const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState(null);
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCaptain = async (captainData) => {
        setCaptain(captainData);
    }

    const value = {
            captain,
            setCaptain,
            isloading,
            setIsLoading,
            error,
            setError,
            updateCaptain,
    }

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};


export default CaptainContext;