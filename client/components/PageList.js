import React, { PropTypes } from 'react'

export default class PageList extends React.Component {
  render () {
    const { onClick, pages, currentPage } = this.props
    var list = pages.map(name => {
      const el = name === currentPage ? <span>{name}</span>
        : <a href='#' onClick={() => { onClick(name) }} >{name}</a>
      return <li key={name} >{el}</li>
    })
    return <ul id='PageList'>{list}</ul>
  }
}

PageList.propTypes = {
  pages: PropTypes.array,
  currentPage: PropTypes.string,
  onClick: PropTypes.func
}
