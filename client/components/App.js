import React, { PropTypes } from 'react'

import Sections from './Sections'
import PageList from './PageList'
import PageEditor from './PageEditor'
import actions from '../app/actions'

/**
 * The container component. The only component aware to Redux
 */
export default class App extends React.Component {
  editor () {
    const { dispatch, currentPage, pageContent, saving } = this.props
    function save (name, content) { dispatch(actions.savePage(name, content)) }
    return (
      <PageEditor name={currentPage} content={pageContent} saving={saving}
        onSave={save} />
    )
  }

  render () {
    const { dispatch, sections, currentSection, pages, currentPage } = this.props
    function handlePageClick (name) {
      dispatch(actions.openPage(currentSection + '/' + name))
    }

    return (
      <div id='app'>
        <Sections names={sections} current={currentSection}
          onClick={name => dispatch(actions.showSection(name))}/>
        <div id='pages'>
          <PageList pages={pages[currentSection]} currentPage={currentPage}
            onClick={handlePageClick} />
        </div>
        {currentPage ? this.editor() : null }
        <div id='images'>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  sections: PropTypes.array,
  pages: PropTypes.object,
  currentSection: PropTypes.string.isRequired,
  currentPage: PropTypes.string,
  pageContent: PropTypes.string,
  saving: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
}
