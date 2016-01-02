import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

import App from './App.js'

// Initial state
let initial = {
  sections: ['inicio', 'websamigas', 'conferencias',
  'paraleer', 'mislibros', 'premios', 'biografia',
  'encuentros', 'matematicas', 'contacto', 'elsahara'],
  count: 0
}

// Action
const increaseAction = {type: 'increase'}
const decreaseAction = {type: 'decrease'}

// Reducer
function counter (state = initial, action) {
  let count = state.count
  switch (action.type) {
    case 'increase':
      return {count: count + 1}
    case 'decrease':
      return {count: count - 1}
    default:
      return state
  }
}

// Store
let store = createStore(counter)

// Map Redux state to component props
function mapStateToProps (state) {
  return {
    value: state.count
  }
}

// Map Redux actions to component props
function mapDispatchToProps (dispatch) {
  return {
    onIncreaseClick: () => dispatch(increaseAction),
    onDecreaseClick: () => dispatch(decreaseAction)
  }
}
let ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

let ConnectedApp = connect((state) => state)(App)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
)
