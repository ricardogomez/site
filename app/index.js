import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

import App from './App.js'
import reducer from './reducers'

// Store
let store = createStore(reducer)
let ConnectedApp = connect((state) => state)(App)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
)
