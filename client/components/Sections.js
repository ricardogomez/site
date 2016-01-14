import React, { PropTypes } from 'react'

export default class Sections extends React.Component {
  render () {
    var onClick = this.props.onClick
    var section = (name) => {
      return name === this.props.current
        ? <span key={name}>{name}</span>
        : <a href='#' onClick={() => { onClick(name) }} key={name}>{name}</a>
    }
    return <div id='#sections'>{this.props.names.map(section)}</div>
  }
}

Sections.propTypes = {
  names: PropTypes.array,
  current: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}
