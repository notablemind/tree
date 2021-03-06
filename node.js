
function m(a, b) {
  for (var n in b) {a[n] = b[n]}
  return a
}

var utils = require('./utils')
  , Managed = require('./managed')
  , d = React.DOM

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
    goLeft: function (i) {
      this.props.killFocus()
      if (i === 0) return this.focusHead()
      this.refs[i-1].focusHead()
    },
    goRight: function (i) {
      this.props.killFocus()
      if (i < this.state.children.length - 1) {
        this.refs[i+1].focusHead(true)
        return 
      }
      if (!this.props.actions) return
      this.props.actions.goDown(true, true)
    },
    goUp: function (i, focus) {
      this.props.killFocus()
      if (i === 0) return this.focusHead()
      this.refs[i-1].focusHead()
    },
    goDown: function (i, focus, start) {
      this.props.killFocus()
      if (i < this.state.children.length - 1) {
        this.refs[i+1].focusHead(start)
        return 
      }
      if (!this.props.actions) return
      this.props.actions.goDown(true, start)
    },

    createBefore: function (i, data) {
      this.newNode(data, function (id) {
        this.addBefore(i, id, true)
      }.bind(this))
    },
    createAfter: function (i, data) {
      this.newNode(data, function (id) {
        this.addAfter(i, id, true)
      }.bind(this))
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

  newNode: function (data, done) {
    this.props.manager.newNode((data ? {data: data} : undefined), done)
  },

  addText: function (text) {
    if (!this.refs.head) return
    this.refs.head.addText(text)
  },

  addAfter: function (i, id, focus) {
    var children = this.state.children.slice()
    // if (!id && id !== 0) id = this.props.manager.newNode()
    children.splice(i+1, 0, id)
    this.setChildren(children, focus, i+1, true)
  },

  addBefore: function (i, id, focus) {
    var children = this.state.children.slice()
    // if (!id && id !== 0) id = this.props.manager.newNode()
    children.splice(i, 0, id)
    this.setChildren(children, focus, i, true)
  },

  addToEnd: function (id, focus) {
    var children = this.state.children.slice()
    children.push(id)
    this.setChildren(children, focus, children.length - 1)
  },

  setChildren: function (ids, focus, i, start) {
    var st = {children: ids, open: true}
      , open = this.state.open
    this.setState(st)
    if (focus) {
      if (start) this.props.setFocus(i, true)
      else this.props.setFocus(i)
    }
    if (!this.props.manager) return
    this.props.manager.set(this.props.id, 'children', ids)
    if (!this.state.open) {
      this.props.manager.set(this.props.id, 'open', true)
    }
  },

  getActions: function () {
    var actions = m({}, this.props.actions)
    actions.goDown = function (focus, start) {
      if (!this.state.children.length || !this.state.open) {
        return this.props.actions.goDown.apply(this, arguments)
      }
      this.refs[0].focusHead(start===true)
    }.bind(this)
    actions.goRight = function (focus, start) {
      if (!this.state.children.length || !this.state.open) {
        return this.props.actions.goRight.apply(this, arguments)
      }
      this.refs[0].focusHead(true)
    }.bind(this)
    actions.createAfter = function (data, after) {
      if ((!this.state.children.length || after) &&
          this.props.actions && this.props.actions.createAfter) {
	      return this.props.actions.createAfter.apply(this, arguments)
      }
      this.newNode(data, function (id) {
        this.addBefore(0, id, true)
      }.bind(this))
    }.bind(this)
    actions.remove = function (text) {
      if (!this.props.actions || !this.props.actions.remove) return
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
           state.open !== this.state.open ||
           props.index !== this.props.index ||
           !utils.areq(props.focusTrail, this.props.focusTrail) ||
           !utils.areq(state.children, this.state.children)
  },

  toggleOpen: function () {
    var open = !this.state.open
    this.setState({open: open})
    this.props.manager.set(this.props.id, 'open', open)
  },

  focusHead: function (start) {
    this.refs.head.focus(start === true)
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
      children = (d.ul( {className:"tree-children"},  
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
            setFocus: this.props.setFocus.bind(null, i),
            killFocus: this.props.killFocus,
          })
        }.bind(this))
       ))
    }

    var focusEnd = this.props.focusTrail.length === 1 && this.props.focusTrail[0] === true
      , shouldGetFocus = focusEnd || this.props.focusTrail.length === 0 || this.state.children.length === 0 || !this.state.open
      , headFocus = false
    if (this.props.focusTrail !== false && shouldGetFocus) {
      headFocus = focusAtStart ? 'start' : true
    }

    var heads = [
      d.div({
        className: "expander",
        onMouseDown: this.toggleOpen,
        style: this.state.children.length ? {} : {visibility: 'hidden'}
      }),
      this.props.head(m({
        on: this.props.manager.on.bind(this.props.manager, this.props.id),
        off: this.props.manager.off.bind(this.props.manager, this.props.id),
        set: this.props.manager.set.bind(this.props.manager, this.props.id),

        id: this.props.id,
        ref: 'head',
        setFocus: headFocus,
        onFocus: this.props.setFocus,
        actions: this.getActions(),
      }, this.props.headProps))
    ]
    var jumpto = d.div({
      className: 'jumpto',
      onMouseDown: this.props.jumpTo
    })
    heads.splice(this.state.children.length ? 0 : 1, 0, jumpto)

    return (
      d.li( {className:"tree-node " + (this.state.open ? 'open' : 'closed')}, 
        d.div( {className:"head"}, 
          heads
        ),
        children
      )
    )
  }
})
