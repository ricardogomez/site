import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'

import App from './components/App.js'
import reducer from './app/reducer'
import actions from './app/actions'
import API from './app/api'

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
  createLogger()// neat middleware that logs actions
)(createStore)

// Store
let store = createStoreWithMiddleware(reducer)
let ConnectedApp = connect((state) => state)(App)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
)

API.getFiles(function (data) {
  store.dispatch(actions.filesFetched(data))
})
