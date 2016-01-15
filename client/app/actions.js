import API from './api'

// Action creators
const ACTIONS = {
  showSection: (name) => {
    return { type: 'showSection', section: name }
  },
  filesFetched: (data) => {
    return { type: 'filesFetched', pages: data }
  },
  requestPage: (name) => {
    return { type: 'requestPage', name: name }
  },
  receivePage: (page) => {
    return { type: 'receivePage', page }
  },
  openPage: (name) => {
    return dispatch => {
      dispatch(ACTIONS.requestPage(name))
      API.fetchPage(name, function (page) {
        dispatch(ACTIONS.receivePage(page))
      })
    }
  },
  savePage: (name, content) => {
    return dispatch => {
      dispatch(ACTIONS.savingPage(name))
      API.updatePage(name, content, function (page) {
        dispatch(ACTIONS.pageSaved(page))
      })
    }
  },
  savingPage: (name) => {
    return { type: 'savingPage', name }
  },
  pageSaved: (page) => {
    return { type: 'pageSaved', page }
  }

}

export default ACTIONS
