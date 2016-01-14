import React, { PropTypes } from 'react'

// React component
export default class Counter extends React.Component {
  render () {
    const { value, onIncreaseClick, onDecreaseClick } = this.props
    return (
      <div>
        <span>El valor es: {value}</span>
        <button onClick={onIncreaseClick}>Increase</button>
        <button onClick={onDecreaseClick}>Bajar</button>
      </div>
    )
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncreaseClick: PropTypes.func.isRequired,
  onDecreaseClick: PropTypes.func.isRequired
}
