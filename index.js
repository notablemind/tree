
var _ = require('lodash')
  , Manager = require('manager')

  , TreeNode = require('./node')

var EmptyHead = React.createClass({
  render: function () {
    return React.DOM.div({}, [this.props.id])
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
  killFocus: function () {
    if (this.state.focusTrail !== false) {
      this.setState({focusTrail: false})
    }
  },
  render: function () {
    return React.DOM.ul({className: 'tree ' + this.props.className}, [
      TreeNode({
        id: this.props.id,
        head: this.props.head,
        manager: this.props.manager,
        headProps: this.props.headProps,
        focusTrail: this.state.focusTrail,
        setFocus: this.setFocus,
        killFocus: this.killFocus
      })
    ])
  }
})

