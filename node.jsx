/** @jsx React.DOM */

function m(a, b) {
  for (var n in b) {a[n] = b[n]}
  return a
}

var TreeMixin = require('./mixin')

var TreeNode = module.exports = React.createClass({
  mixins: [TreeMixin],

  render: function () {
    var children = false
    if (this.state.children.length) {
      children = (<ul> {
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
            actions: this.boundActions(i),
            addAfter: this.addAfter.bind(this, i),
          })
        }.bind(this))
      } </ul>)
    }

    var onData = this.props.manager.on.bind(this.props.manager, 'data', this.props.id)
      , offData = this.props.manager.off.bind(this.props.manager, 'data', this.props.id)
      , setData = this.props.manager.set.bind(this.props.manager, 'data', this.props.id)

    return (
      <li className="tree-node">
        <div className="head">
          {
            this.props.head(m({
              on: onData,
              off: offData,
              id: this.props.id,
              focus: this.props.focus,
              actions: this.props.actions,
              set: setData
            }, this.props.headProps))
          }
        </div>
        {children}
      </li>
    )
  }
})

