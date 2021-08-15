import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';
import dummyData from './dummy-data';
import endpoint from './endpoint';

import './styles.scss';

const useFetch = url => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching');

    setLoading(true);
    setError(null);
    setResponse(null);

    fetch(url)
      .then(response => response.json())
      .then(response => {
        setResponse(response);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return [response, loading, error];
};

const Application = () => {
  // const [characters, setCharacters] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const [response, loading, error] = useFetch(endpoint + '/characters');  
  const characters = (response && response.characters) || []

  // useEffect(() => {
  //   console.log('Fetching');
  //   fetch(`${endpoint}/characters`)
  //     .then(response => response.json())
  //     .then(response => {
  //       console.log({ response });
  //       setCharacters(Object.values(response.characters));
  //     })
  //     .catch(console.error);
  // }, []);

  // useEffect(() => {
  //   console.log('Fetching');
  
  //   setLoading(true);
  //   setError(null);
  //   setCharacters([]);
  
  //   fetch(`${endpoint}/characters`)
  //     .then(response => response.json())
  //     .then(response => {
  //       setCharacters(Object.values(response.characters));
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       setError(error);
  //       setLoading(false);
  //     });
  // }, []);  

  return (
    <div className="Application">      
      <header>
        <p>Response, Loading & error</p>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        {/* <section className="sidebar">
          <CharacterList characters={characters} />
        </section> */}
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
