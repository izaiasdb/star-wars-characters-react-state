import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import isFunction from 'lodash/isFunction'

import CharacterList from './CharacterList';
import CharacterView from './CharacterView';
import dummyData from './dummy-data';
import endpoint from './endpoint';

import './styles.scss';

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

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  return [state, enhancedDispatch];  
};

const Application = () => {
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  const { characters}  = state;

  useEffect(()=> {
    dispatch(() => {})
  }, []);

  return (
    <div className="Application">      
      <header>
        <p>Routing & Thunks</p>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
            <CharacterList characters={characters} />
            <button onClick={() => dispatch(fetchCharacters)}>
              Fetch Characters
            </button>
        </section>     
        <section className="CharacterView">
          <Route path="/characters/:id" component={CharacterView} />
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
