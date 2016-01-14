import React, { PropTypes } from 'react'

export default class PageEditor extends React.Component {
  // https://facebook.github.io/react/docs/forms.html#controlled-components
  handleChange (event) {
    this.setState({content: event.target.value})
  }

  render () {
    const { name, content } = this.props
    return (
      <div id='editor'>
        <textarea name='ed' onChange={this.handleChange} value={content} />
        <div className='header'>
          <label className='title'>{name}</label>
        </div>
        <div className='controls'>
          <a className='button' href='#'>Save</a>
        </div>
      </div>
    )
  }
}

PageEditor.propTypes = {
  content: PropTypes.string,
  name: PropTypes.string
}
