
const STATE = {
  sections: ['inicio'],
  currentSection: 'inicio',
  pages: { inicio: [] },
  loading: false,
  saving: false,
  currentPage: '',
  pageContent: ''
}

// Page Reducer
export default function (state = STATE, action) {
  const { page, pages } = action
  switch (action.type) {
    case 'showSection':
      return { ...state, currentSection: action.section }
    case 'filesFetched':
      return { ...state, sections: Object.keys(pages), pages }
    case 'requestPage':
      return { ...state, pageContent: null, currentPage: action.name }
    case 'receivePage':
      return { ...state, pageContent: page.content, currentPage: page.name }
    case 'savingPage':
      return { ...state, saving: true }
    case 'pageSaved':
      return { ...state, saving: false, currentPage: page.name, pageContent: page.content }
    default:
      return state
  }
}
