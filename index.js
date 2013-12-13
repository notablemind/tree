/** @jsx React.DOM */

var _ = require('lodash')
  , Manager = require('./manager')
  , TreeNode = require('./node')
  , TreeMixin = require('./mixin')

var EmptyHead = React.createClass({displayName: 'EmptyHead',
  render: function () {
    return React.DOM.div(null, this.props.id)
  }
})

var Tree = module.exports = React.createClass({
  mixins: [TreeMixin],
  getDefaultProps: function () {
    return {
      className: '',
      manager: new Manager(),
      head: EmptyHead,
      headProps: {},
      id: null
    }
  },
  render: function () {
    return (
      React.DOM.ul( {className:'tree ' + this.props.className}, 
        
          this.state.children.map(function (id, i) {
            return TreeNode({
              id: id,
              key: id,
              index: i,
              ref: i + '',
              head: this.props.head,
              headProps: this.props.headProps,
              manager: this.props.manager,
              focus: this.state.focus === id,
              move: this.moves(i),
              addAfter: this.addAfter.bind(this, i),
            })
          }.bind(this))
        
      )
    )
  }
})
