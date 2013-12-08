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
    this.props.manager.getTreeFrom(this.props.id, function (ids) {
      this.setState({tree: ids})
    }.bind(this))
  },
  /*
  save: function (children) {
    this.setState({children: children})
    this.props.manager.setChildren(this.props.id, children, function (ids) {
      this.setState({children: ids})
    }.bind(this))
  },
  moveUp: function (idx) {
    if (idx === 0) return console.warn('Moving up and out not yet implemented')
    var children = this.state.children
    children.splice(idx-1, 0, children.splice(idx, 1))
    this.save(children)
  },
  moveDown: function (idx) {
    if (idx === this.children.length - 1) return console.warn('Moving down and out not yet implemented')
    var children = this.state.children
    children.splice(idx + 1, 0, children.splice(idx, 1))
    this.save(children)
  }
  indent: function (idx) {

  },
  addChild: function (idx, start) {
    var children = this.state.children
    if (start) {
      children.unshift(idx)
    } else {
      children.push(idx)
    }
    this.save(children)
  },
  */
  go: function (what, trail) {
    var tree = states[what](trail, this.state.tree)
    // todo also return info about what to save. Don't want to save the whole
    // tree every time
    if (tree) this.setState({tree: tree})
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


