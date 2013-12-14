/** @jsx React.DOM */

function m(a, b) {
  for (var n in b) {a[n] = b[n]}
  return a
}

var utils = require('./utils')
  , Managed = require('./managed')

var TreeNode = module.exports = React.createClass({
  mixins: [Managed],

  boundActions: function (i) {
    var actions = {}
    for (var name in this.actions) {
      actions[name] = this.actions[name].bind(this, i)
    }
    return actions
  },

  // movement
  actions: {
    moveUp: function (i, focus) {
      if (i === 0) return
      var ids = this.state.children.slice()
      ids.splice(i-1, 0, ids.splice(i, 1)[0])
      this.setChildren(ids, focus, i-1)
    },
    moveDown: function (i, focus) {
      if (i === this.state.children.length-1) return
      var ids = this.state.children.slice()
      ids.splice(i+1, 0, ids.splice(i, 1)[0])
      this.setChildren(ids, focus, i+1)
    },
    moveRight: function (i, focus) {
      if (i === 0) return false
      var children = this.state.children.slice()
        , id = children.splice(i, 1)[0]
      this.refs[i-1].addToEnd(id, focus)
      this.setChildren(children, false)
    },
    moveLeft: function (i, focus) {
      if (!this.props.addAfter) return
      var children = this.state.children.slice()
        , id = children.splice(i, 1)[0]
      this.props.addAfter(id, focus)
      this.setChildren(children)
    },
    goUp: function (i, focus) {
      if (i === 0) return this.props.setFocus()
      this.props.setFocus(i-1, -1)
    },
    goDown: function (i, focus) {
      if (i < this.state.children.length - 1) return this.props.setFocus(i + 1)
      if (!this.props.actions) return
      this.props.actions.goDown(true)
    },

  },

  addAfter: function (i, id, focus) {
    var children = this.state.children.slice()
    if (!id && id !== 0) id = this.props.manager.newId()
    children.splice(i+1, 0, id)
    this.setChildren(children, focus, i+1)
  },

  addToEnd: function (id, focus) {
    var children = this.state.children.slice()
    children.push(id)
    this.setChildren(children, focus, children.length - 1)
  },

  setChildren: function (ids, focus, i) {
    var st = {children: ids}
    this.setState(st)
    if (focus) this.props.setFocus(i)
    if (!this.props.manager) return
    this.props.manager.set('children', this.props.id, ids)
  },

  getActions: function () {
    var actions = m({}, this.props.actions)
    actions.goDown = function () {
      if (!this.state.children.length) return this.props.actions.goDown.apply(this, arguments)
      this.props.setFocus(0)
    }.bind(this)
    return actions
  },

  // component api functions

  getDefaultProps: function () {
    return {
      focusTrail: false,
      setFocus: function () {}
    }
  },

  shouldComponentUpdate: function (props, state) {
    return props.id !== this.props.id ||
           props.index !== this.props.index ||
           !utils.areq(props.focusTrail, this.props.focusTrail) ||
           !utils.areq(state.children, this.state.children)
  },

  render: function () {
    var children = false
      , focus = false
      , trail = false
    if (this.props.focusTrail.length > 0) {
      focus = this.props.focusTrail[0]
      trail = this.props.focusTrail.slice(1)
      if (focus === -1) {
        trail.push(focus)
        focus = this.state.children.length - 1
      }
    }
    if (this.state.children.length) {
      children = (React.DOM.ul(null,  
        this.state.children.map(function (id, i) {
          return TreeNode({
            id: id,
            key: id,
            index: i,
            ref: i + '',

            head: this.props.head,
            manager: this.props.manager,
            headProps: this.props.headProps,

            actions: this.boundActions(i),
            addAfter: this.addAfter.bind(this, i),

            focusTrail: focus === i && trail,
            setFocus: this.props.setFocus.bind(null, i)
          })
        }.bind(this))
       ))
    }

    var onData = this.props.manager.on.bind(this.props.manager, 'data', this.props.id)
      , offData = this.props.manager.off.bind(this.props.manager, 'data', this.props.id)
      , setData = this.props.manager.set.bind(this.props.manager, 'data', this.props.id)

    return (
      React.DOM.li( {className:"tree-node"}, 
        React.DOM.div( {className:"head"}, 
           this.props.focusTrail + ' : ', 
          
            this.props.head(m({
              on: onData,
              off: offData,
              id: this.props.id,
              setFocus: this.props.focusTrail !== false &&
                (this.props.focusTrail.length === 0 ||
                 this.state.children.length === 0),
              onFocus: this.props.setFocus,
              actions: this.getActions(),
              set: setData
            }, this.props.headProps))
          
        ),
        children
      )
    )
  }
})
