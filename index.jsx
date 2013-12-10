/** @jsx React.DOM */

var states = require('./states')

function eqar(ar1, ar2) {
  if (ar1.length !== ar2.length) return false
  for (var i=0; i<ar1.length; i++) {
    if (ar1[i] !== ar2[i]) return false
  }
  return true
}

var _ = require('lodash')

var Tree = module.exports = React.createClass({
  getDefaultProps: function () {
    return {
      id: 0,
      tree: [],
      manager: null,
      handle: false
    }
  },
  getInitialState: function () {
    return {
      tree: this.props.tree,
      hovering: false
    }
  },
  shouldComponentUpdate: function (newp, oldp) {
    return newp.id != oldp.id || !_.isEqual(newp.tree, oldp.tree)
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

  hovering: function (id, trail) {
    if (!this.state.hovering) return false
    return eqar(trail.concat([id]), this.state.hovering)
  },

  handleEnter: function (id, trail) {
    this.setState({hovering: trail.concat([id])})
  },

  handleLeave: function (id, trail) {
    this.setState({hovering: false})
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
      <div className={ 'tree ' + (this.hovering(id, trail) ? 'hover' : '') }>
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
          <div onMouseEnter={this.handleEnter.bind(this, id, trail)}
               onMouseLeave={this.handleLeave.bind(this, id, trail)}
               className='move-handle'>
            { this.props.handle }
          </div>
        </div>
        { childnodes }
      </div>
    )
  },

  render: function () {
    return this.renderOne(this.props.id, this.state.tree, [])
  },

})


