import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';
import dummyData from './dummy-data';
import endpoint from './endpoint';

import './styles.scss';

// const useFetch = url => {
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     console.log('Fetching');

//     setLoading(true);
//     setError(null);
//     setResponse(null);

//     fetch(url)
//       .then(response => response.json())
//       .then(response => {
//         setResponse(response);
//         setLoading(false);
//       })
//       .catch(error => {
//         setError(error);
//         setLoading(false);
//       });
//   }, [url]);

//   return [response, loading, error];
// };

const useFetch = url => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    setResponse(null);
  
    const fetchUrl = async() => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        setResponse(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUrl();
  }, []);

  return [response, loading, error];
};

const Application = () => {
  const [response, loading, error] = useFetch(endpoint + '/characters');  
  const characters = (response && response.characters) || []

  return (
    <div className="Application">      
      <header>
        <p>Refctoring to a Custom Hook</p>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {loading ? (
            <p className="loading">Loading…</p>
          ) : (
            <CharacterList characters={characters} />
          )}
          {error && <p className="error">{error.message}</p>}
        </section>        
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
