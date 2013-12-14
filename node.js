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
      if (i === 0) return this.actions.moveLeft.call(this, i, focus)
      var ids = this.state.children.slice()
      ids.splice(i-1, 0, ids.splice(i, 1)[0])
      this.setChildren(ids, focus, i-1)
    },
    moveDown: function (i, focus) {
      if (i === this.state.children.length-1) return this.actions.moveLeft.call(this, i, focus,  true)
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
    moveLeft: function (i, focus, after) {
      if (!this.props.addAfter) return
      var children = this.state.children.slice()
        , id = children.splice(i, 1)[0]
      this.props[after ? 'addAfter' : 'addBefore'](id, focus)
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

    createBefore: function (i, text) {
      this.addBefore(i, this.newNode(text), true)
    },
    createAfter: function (i, text) {
      this.addAfter(i, this.newNode(text), true)
    },
    remove: function (i, text) {
      var children = this.state.children.slice()
      children.splice(i, 1)
      if (i === 0) {
        this.setChildren(children)
        this.props.setFocus()
        this.addText(text)
        return
      }
      this.setChildren(children, true, i-1)
      this.refs[i-1].addText(text)
    },
  },

  newNode: function (text) {
    return this.props.manager.newNode({data: {text: text}})
  },

  addText: function (text) {
    if (!this.refs.head) return
    this.refs.head.addText(text)
  },

  addAfter: function (i, id, focus) {
    var children = this.state.children.slice()
    if (!id && id !== 0) id = this.props.manager.newNode()
    children.splice(i+1, 0, id)
    this.setChildren(children, focus, i+1, true)
  },

  addBefore: function (i, id, focus) {
    var children = this.state.children.slice()
    if (!id && id !== 0) id = this.props.manager.newNode()
    children.splice(i, 0, id)
    this.setChildren(children, focus, i, true)
  },

  addToEnd: function (id, focus) {
    var children = this.state.children.slice()
    children.push(id)
    this.setChildren(children, focus, children.length - 1)
  },

  setChildren: function (ids, focus, i, start) {
    var st = {children: ids}
    this.setState(st)
    if (focus) {
      if (start) this.props.setFocus(i, true)
      else this.props.setFocus(i)
    }
    if (!this.props.manager) return
    this.props.manager.set(this.props.id, 'children', ids)
  },

  getActions: function () {
    var actions = m({}, this.props.actions)
    actions.goDown = function () {
      if (!this.state.children.length) return this.props.actions.goDown.apply(this, arguments)
      this.props.setFocus(0)
    }.bind(this)
    actions.createAfter = function (text, after) {
      if (!this.state.children.length || after) return this.props.actions.createAfter.apply(this, arguments)
      this.addBefore(0, this.newNode(text), true)
    }.bind(this)
    actions.remove = function (text) {
      console.warn('TODO delete the node from the manager. Its now an orphan')
      if (this.state.children.length) return console.warn('not removing a node w/ children')
      this.props.actions.remove(text)
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
      , trail = this.props.focusTrail
      , focusAtStart = false
    if (trail && trail.length > 0) {
      focus = trail[0]
      trail = trail.slice(1)
      if (focus === -1) {
        trail.push(focus)
        focus = this.state.children.length - 1
      }
      if (focus === true) {
        focusAtStart = true
        trail = []
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
            addBefore: this.addBefore.bind(this, i),

            focusTrail: focus === i && trail,
            setFocus: this.props.setFocus.bind(null, i)
          })
        }.bind(this))
       ))
    }

    var focusEnd = this.props.focusTrail.length === 1 && this.props.focusTrail[0] === true
      , shouldGetFocus = focusEnd || this.props.focusTrail.length === 0 || this.state.children.length === 0
      , headFocus = false
    if (this.props.focusTrail !== false && shouldGetFocus) {
      headFocus = focusAtStart ? 'start' : true
    }

    return (
      React.DOM.li( {className:"tree-node"}, 
        React.DOM.div( {className:"head"}, 
          
            this.props.head(m({
              on: this.props.manager.on.bind(this, this.props.id),
              off: this.props.manager.off.bind(this, this.props.id),
              set: this.props.manager.set.bind(this, this.props.id),

              id: this.props.id,
              ref: 'head',
              setFocus: headFocus,
              onFocus: this.props.setFocus,
              actions: this.getActions(),
            }, this.props.headProps))
          
        ),
        children
      )
    )
  }
})
