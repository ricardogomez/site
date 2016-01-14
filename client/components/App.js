import React, { PropTypes } from 'react'

import Sections from './Sections'
import PageList from './PageList'
import PageEditor from './PageEditor'
import actions from '../app/actions'

/**
 * The container component. The only component aware to Redux
 */
export default class App extends React.Component {
  render () {
    const { dispatch, sections, currentSection, pages,
      currentPage, pageContent } = this.props
    function openPage (name) {
      dispatch(actions.openPage(currentSection + '/' + name))
    }
    const editor = currentPage
      ? <PageEditor name={currentPage} content={pageContent} />
      : null

    return (
      <div id='app'>
        <Sections names={sections} current={currentSection}
          onClick={name => dispatch(actions.showSection(name))}/>
        <div id='pages'>
          <PageList pages={pages[currentSection]} currentPage={currentPage}
            onClick={openPage} />
        </div>
        {editor}
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
  dispatch: PropTypes.func.isRequired
}
