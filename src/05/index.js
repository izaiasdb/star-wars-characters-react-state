import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';
import dummyData from './dummy-data';
import endpoint from './endpoint';

import './styles.scss';

const initialState = {
  result: null,
  loading: true,
  error: null, 
}

const fetchReducer = (state, action) => {
  if (action.type === 'LOADING') {
    return {
      result: null,
      loading: true,
      error: null,
    };
  }

  if (action.type === 'RESPONSE_COMPLETE') {
    return {
      result: action.payload.result,
      loading: false,
      error: null,
    };
  }

  if (action.type === 'ERROR') {
    return {
      result: null,
      loading: false,
      error: action.payload.error,
    };
  }

  return state;
};

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
  // const [response, setResponse] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  React.useEffect(() => {
    // setLoading(true);
    // setError(null);
    // setResponse(null);
    dispatch({ type: 'LOADING' });
  
    const fetchUrl = async() => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        // setResponse(data);
        dispatch({
          type: 'RESPONSE_COMPLETE',
          payload: { result: data },
        });
      } catch (error) {
        // setError(error);
        dispatch({ type: 'ERROR', payload: { error } });        
      } 
      // }finally {
      //   setLoading(false);
      // }
    }

    fetchUrl();
  }, []);

  return [state.result, state.loading, state.error];
};

const Application = () => {
  // const [response, loading, error] = useFetch(endpoint + '/characters');  
  // const characters = (response && response.characters) || []
  const [result, loading, error] = useFetch(endpoint + '/characters');  // I guess that is result instead of response
  const characters = (result && result.characters) || []  

  return (
    <div className="Application">      
      <header>
        <p>Refctoring to a Custom Reducer</p>
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
