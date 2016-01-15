import React, { PropTypes } from 'react'

export default class Sections extends React.Component {
  section (name, current, onClick) {
    if (name === current) return <span key={name}>{name}</span>
    else return <a href='#' onClick={() => { onClick(name) }} key={name}>{name}</a>
  }
  render () {
    const { names, current, onClick } = this.props
    return <div id='sections'>{names.map((n) => this.section(n, current, onClick))}</div>
  }
}

Sections.propTypes = {
  names: PropTypes.array,
  current: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}
