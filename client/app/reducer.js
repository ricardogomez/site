import STATE from './state'

const reducers = {
  showSection: (state, action) => {
    return { ...state, currentSection: action.section }
  },
  filesFetched: (state, action) => {
    const pages = action.payload
    return { ...state, sections: Object.keys(pages), pages }
  },
  openPage: (state, action) => {
    return { ...state, pageContent: null, currentPage: action.name }
  },
  receivePage: (state, action) => {
    return { ...state, pageContent: action.page.content, currentPage: action.page.name }
  }

}

// Reducer
export default function reducer (state = STATE, action) {
  var reducer = reducers[action.type]
  return reducer ? reducer(state, action) : state
}
