/** @jsx React.DOM */

var _ = require('lodash')
  , states = require('./states')
  , Manager = require('./manager')
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
              head: this.props.head,
              addAfter: this.addAfter.bind(this, i),
              manager: this.props.manager
            })
          }.bind(this))
        }
      </ul>
    )
  }
})

