import { useState, useEffect } from 'react';

const useFetch = (requestUrl, settings) => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState([]);
    
    useEffect(() => {
        if (requestUrl) return;
        const myAbortController = new AbortController();

        const fetchData = async () => {
            setStatus('fetching');
            const response = await fetch(
                requestUrl,
                { ...settings, signal: myAbortController.signal }
            );
            const data = await response.json();
            setData(data.hits);
            setStatus('fetched');
        };

        fetchData();
        return () => {
          myAbortController.abort();
        };
    }, [requestUrl, settings]);

    return { status, data };
};

export default useFetch;
