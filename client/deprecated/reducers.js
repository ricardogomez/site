function set (state, override) { return Object.assign({}, state, override) }

// Initial state
let STATE = {
  sections: ['inicio'],
  currentSection: 'inicio',
  pages: { inicio: [] },
  currentFile: null,
  fileContent: null
}

var Reducers = {
  showSection: (state, action) => {
    return set(state, { currentSection: action.section })
  },
  filesFetched: (state, action) => {
    return set(state, {
      sections: Object.keys(action.payload.pages),
      pages: action.payload.pages
    })
  }
}

// Reducer
export default function reducer (state = STATE, action) {
  console.log('Action', action)
  var reducer = Reducers[action.type]
  if (!reducer) return state
  return reducer(state, action)
}
