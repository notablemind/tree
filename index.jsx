/** @jsx React.DOM */

var states = require('./states')

///var _ = require('lodash')

var Tree = module.exports = React.createClass({
  getDefaultProps: function () {
    return {
      id: 0,
      tree: [],
      manager: null
    }
  },
  getInitialState: function () {
    return {
      tree: this.props.tree
    }
  },
  componentWillMount: function () {
    if (!this.props.manager) return
    this.props.manager.getTreeFrom(this.props.id, this.gotIds)
  },
  go: function (what, trail) {
    var tree = states[what](trail, this.state.tree)
    // TODO also return info about what to save. Don't want to save the whole
    // tree every time
    if (!tree) return
    this.setState({tree: tree})
    if (!this.props.manager) return
    this.props.manager.saveAt(this.props.id, tree, this.gotIds)
  },
  gotIds: function (ids) {
    this.setState({tree: ids})
  },
  renderOne: function (id, children, trail) {
    var childnodes = false
      , self = this
    if (children && children.length) {
      childnodes = (
        <div className='children'>
          {
            children.map(function (child, i) {
              return self.renderOne(child.id, child.children || [], trail.concat([i]))
            })
          }
        </div>
      )
    }
    return (
      <div className='tree'>
        <div className='head'>
          {
            this.props.head({
              id: id,
              manager: this.props.manager,
              goUp: this.go.bind(this, 'up', trail),
              goDown: this.go.bind(this, 'down', trail),
              goLeft: this.go.bind(this, 'left', trail),
              goRight: this.go.bind(this, 'right', trail)
            })
          }
        </div>
        { childnodes }
      </div>
    )
  },
  render: function () {
    return this.renderOne(this.props.id, this.state.tree, [])
  },
})


