/** @jsx React.DOM */

var _ = require('lodash')
  , states = require('./states')
  , Manager = require('./manager')
  , TreeNode = require('./node')
  , TreeMixin = require('./mixin')

var EmptyHead = React.createClass({
  render: function () {
    return <div>{this.props.id}</div>
  }
})

var Tree = module.exports = React.createClass({
  mixins: [TreeMixin],
  getDefaultProps: function () {
    return {
      className: '',
      manager: new Manager(),
      head: EmptyHead,
      id: null
    }
  },
  render: function () {
    return (
      <ul className={'tree ' + this.props.className}>
        {
          this.state.children.map(function (id, i) {
            return TreeNode({
              id: id,
              key: id,
              index: i,
              ref: i + '',
              head: this.props.head,
              manager: this.props.manager,
              focus: this.state.focus === id,
              addAfter: this.addAfter.bind(this, i),
              moveUp: this.moveUp.bind(this, i),
              moveDown: this.moveDown.bind(this, i),
              moveLeft: this.moveLeft.bind(this, i),
              moveRight: this.moveRight.bind(this, i),
            })
          }.bind(this))
        }
      </ul>
    )
  }
})

