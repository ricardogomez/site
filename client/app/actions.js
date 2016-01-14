import API from './api'

const ACTIONS = {
  showSection: (name) => {
    return { type: 'showSection', section: name }
  },
  filesFetched: (data) => {
    return { type: 'filesFetched', payload: data }
  },
  requestPage: (name) => {
    return { type: 'requestPage', name: name }
  },
  receivePage: (page) => {
    return { type: 'receivePage', page: page }
  },
  openPage: (name) => {
    return dispatch => {
      dispatch(ACTIONS.requestPage(name))
      API.fetchPage(name, function (page) {
        dispatch(ACTIONS.receivePage(page))
      })
    }
  }
}

export default ACTIONS
