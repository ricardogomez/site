import React, { PropTypes } from 'react'

const BASE = 'http://localhost:8080/'

export default class PageEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.componentWillReceiveProps(props)
  }

  componentWillReceiveProps (props) {
    if (!this.state.value || this.state.name !== props.name) {
      this.state = { name: props.name, value: props.content, dirty: false }
    }
  }

  preview () {
    const { name } = this.props
    var url = (BASE + name).replace('inicio/', '').replace('.md', '')
    return <a href={url} target='_blank'>{url}</a>
  }

  saving () {
    return <label className='button button-clear'>Guardando...</label>
  }

  save () {
    const { name, onSave } = this.props
    return !this.state.dirty ? ''
      : <button className='button button-outline' href='#'
        onClick={() => onSave(name, this.state.value)}>Guardar</button>
  }

  controls () {
    return this.props.saving ? this.saving() : this.save()
  }

  area () {
    // https://facebook.github.io/react/docs/forms.html#controlled-components
    const handleChange = (event) => {
      this.setState({ value: event.target.value, dirty: true })
    }

    if (this.state.value === null) return <label>Cargando...</label>
    return <textarea value={this.state.value} onChange={handleChange} />
  }

  render () {
    const { name } = this.props

    return (
      <div id='editor'>
        <div className='header'>
          <label className='title'>{name}</label>
          {this.preview()}
        </div>
        <div className='area'>{this.area()}</div>
        <div className='controls'>{this.controls()}</div>
      </div>
    )
  }
}

PageEditor.propTypes = {
  content: PropTypes.string,
  name: PropTypes.string,
  saving: PropTypes.bool,
  onSave: PropTypes.func
}
