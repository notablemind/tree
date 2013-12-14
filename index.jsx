/** @jsx React.DOM */

var _ = require('lodash')
  , Manager = require('manager')

  , TreeNode = require('./node')

var EmptyHead = React.createClass({
  render: function () {
    return <div>{this.props.id}</div>
  }
})

var Tree = module.exports = React.createClass({
  getDefaultProps: function () {
    return {
      className: '',
      head: EmptyHead,
      manager: null,
      headProps: {},
      id: null
    }
  },
  getInitialState: function () {
    return {
      focusTrail: false
    }
  },
  setFocus: function () {
    this.setState({focusTrail: [].slice.call(arguments)})
  },
  render: function () {
    return (
      <ul className={'tree ' + this.props.className}>
        {
          TreeNode({
            id: this.props.id,
            head: this.props.head,
            manager: this.props.manager,
            headProps: this.props.headProps,
            focusTrail: this.state.focusTrail,
            setFocus: this.setFocus
          })
        }
      </ul>
    )
  }
})

