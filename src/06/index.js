import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import isFunction from 'lodash/isFunction'

import CharacterList from './CharacterList';
import dummyData from './dummy-data';
import endpoint from './endpoint';

import './styles.scss';

//const fetchReducer = (state, action) => {
const reducer = (state, action) => {  
  if (action.type === 'LOADING') {
    return {
      characters: [],
      loading: true,
      error: null,
    };
  }

  if (action.type === 'RESPONSE_COMPLETE') {
    return {
      characters: action.payload.characters,
      loading: false,
      error: null,
    };
  }

  if (action.type === 'ERROR') {
    return {
      characters: [],
      loading: false,
      error: action.payload.error,
    };
  }

  return state;
};

const fetchCharacters = dispatch => {
  dispatch({ type: 'LOADING' });

  fetch(endpoint + '/characters')
    .then(response => response.json())
    .then(response => {
      dispatch({
        type: 'RESPONSE_COMPLETE',
        payload: {
          characters: response.characters,
        },
      });
    })
    .catch(error => dispatch({ type: error, payload: { error } }));
};

const initialState = {
  characters: [],
  loading: true,
  error: null, 
}

/*
const useFetch = url => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  React.useEffect(() => {
    dispatch({ type: 'LOADING' });
  
    const fetchUrl = async() => {
      try {
        const response = await fetch(url)
        const data = await response.json()
        dispatch({
          type: 'RESPONSE_COMPLETE',
          payload: { result: data },
        });
      } catch (error) {
        dispatch({ type: 'ERROR', payload: { error } });        
      } 
    }

    fetchUrl();
  }, []);

  return [state.result, state.loading, state.error];
}; */

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // const enhancedDispatch = action => {
  //   if (isFunction(action)) {
  //     console.log('It is a thunk');
  //     action(dispatch);
  //   } else {
  //     dispatch(action);
  //   }
  // };

  const enhancedDispatch = React.useCallback(
    action => {
      if (isFunction(action)) {
        console.log('It is a thunk');
        action(dispatch);
      } else {
        dispatch(action);
      }
    }, 
    [dispatch]
  );

  // return [state, dispatch];
  return [state, enhancedDispatch];  
};

const Application = () => {
  //const [result, loading, error] = useFetch(endpoint + '/characters');  // I guess that is result instead of response
  //const characters = (result && result.characters) || []  
  //const [state, dispatch] = useReducer(fetchReducer, initialState);
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  const { characters}  = state;

  useEffect(()=> {
    dispatch(() => {})
  }, []);

  return (
    <div className="Application">      
      <header>
        <p>UseThunkReducer Hook - Dispatching, Reducers & Hooks</p>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {/* {loading ? (
            <p className="loading">Loading…</p>
          ) : ( */}
            <CharacterList characters={characters} />
            {/* <button onClick={() => {}}>Fetch Characters</button> */}
            <button onClick={() => dispatch(fetchCharacters)}>
              Fetch Characters
            </button>
          {/* )}
          {error && <p className="error">{error.message}</p>} */}
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
