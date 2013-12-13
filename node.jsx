/** @jsx React.DOM */

var TreeMixin = require('./mixin')

var TreeNode = module.exports = React.createClass({
  mixins: [TreeMixin],

  render: function () {
    var children = false
    if (this.state.children.length) {
      children = (
        <ul>
          {
            this.state.children.map(function (id, i) {
              return TreeNode({
                ref: i + '',
                id: id,
                key: id,
                index: i,
                head: this.props.head,
                manager: this.props.manager,
                focus: this.state.focus === i,
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
    var onData = this.props.manager.on.bind(this.props.manager, 'data', this.props.id)
      , setData = this.props.manager.set.bind(this.props.manager, 'data', this.props.id)
    return (
      <li className="tree-node">
        <div className="head">
          {
            this.props.head({
              id: this.props.id,
              listen: onData,
              focus: this.props.focus,
              moveUp: this.props.moveUp,
              moveDown: this.props.moveDown,
              moveLeft: this.props.moveLeft,
              moveRight: this.props.moveRight,
              set: setData
            })
          }
        </div>
        {children}
      </li>
    )
  }
})

