
var utils = require('./utils')

module.exports = {

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
      this.setChildren(ids, focus, ids[i-1])
    },
    moveDown: function (i, focus) {
      if (i === this.state.children.length-1) return
      var ids = this.state.children.slice()
      ids.splice(i+1, 0, ids.splice(i, 1)[0])
      this.setChildren(ids, focus, ids[i+1])
    },
    moveRight: function (i, focus) {
      if (i === 0) return false
      var children = this.state.children.slice()
        , id = children.splice(i, 1)[0]
      this.refs[i-1].addToEnd(id, focus)
      this.setChildren(children)
    },
    moveLeft: function (i, focus) {
      if (!this.props.addAfter) return
      var children = this.state.children.slice()
        , id = children.splice(i, 1)[0]
      this.props.addAfter(id, focus)
      this.setChildren(children)
    },
    goUp: function (i, focus, node) {
      node.setState({focus: false})
      if (i === 0) return this.setState({focus: true})
      this.setState({focus: this.state.children[i-1]})
    },
    goDown: function (i, focus, node) {
      if (node.state.children.length > 0) {
        return node.setState({focus: node.state.children[0]})
      }
      node.setState({focus: false})
      if (i < this.state.children.length - 1) return this.setState({focus: this.state.children[i+1]})
      this.actions.goDown(true, this)
      // this.setState({focus: this.state.children[i-1]})
    },

  },

  addAfter: function (i, id, focus) {
    var children = this.state.children.slice()
    if (!id && id !== 0) id = this.props.manager.newId()
    children.splice(i+1, 0, id)
    this.setChildren(children, focus, id)
  },

  addToEnd: function (id, focus) {
    var children = this.state.children.slice()
    children.push(id)
    this.setChildren(children, focus, id)
  },

  gotChildren: function (children) {
    this.setState({children: children})
  },

  setChildren: function (ids, focus, i) {
    var st = {children: ids}
    if (focus) st.focus = i
    this.setState(st)
    if (!this.props.manager) return
    this.props.manager.set('children', this.props.id, ids)
  },

  // component api functions

  getDefaultProps: function () {
    return {
      initialChildren: [],
      manager: null,
      focus: false
    }
  },

  getInitialState: function () {
    return {
      children: this.props.initialChildren,
      focus: false
    }
  },

  componentWillReceiveProps: function (nprops) {
    if (nprops.id !== this.props.id) {
      if (!this.props.manager) return
      this.props.manager.off('children', this.props.id, this.gotChildren)
      this.props.manager.on('children', nprops.id, this.gotChildren)
    }
  },

  componentWillMount: function () {
    if (!this.props.manager) return
    this.props.manager.on('children', this.props.id, this.gotChildren)
  },

  componentWillUnmount: function () {
    if (!this.props.manager) return
    this.props.manager.off('children', this.props.id, this.gotChildren)
  },

  shouldComponentUpdate: function (props, state) {
    return props.id !== this.props.id ||
           props.index !== this.props.index ||
           props.focus !== this.props.focus ||
           state.focus !== this.state.focus ||
           !utils.areq(state.children, this.state.children)
  },

}

