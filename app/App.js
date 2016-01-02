import React, { PropTypes } from 'react'

import Sections from './components/Sections'
import { showSection } from './actions'

/**
 * The container component. The only component aware to Redux
 */
export default class App extends React.Component {
  render () {
    const { dispatch, sections, currentSection } = this.props
    return (
      <div id='app'>
        <Sections names={sections} current={currentSection}
          onClick={name => dispatch(showSection(name))}/>
        <div id='pages'>
        </div>
        <div id='editor'>
        </div>
        <div id='images'>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  sections: PropTypes.array.isRequired,
  currentSection: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}
