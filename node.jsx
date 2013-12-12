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
              return this.transferPropsTo(TreeNode({
                id: id,
                addAfter: this.addAfter.bind(this, i),
              }))
            }.bind(this))
          }
        </ul>
      )
    }
    var onData = this.props.manager.on.bind(this.props.manager, 'data', this.props.id)
      , setData = this.props.manager.set.bind(this.props.manager, 'data', this.props.id)
    return (
      <li class="tree-node">
        <div class="head">
          {
            this.props.head({
              id: this.props.id,
              listen: onData,
              set: setData
            })
          }
        </div>
        {children}
      </li>
    )
  }
})

