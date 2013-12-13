
var utils = require('./utils')

module.exports = {
  addAfter: function (i, nid) {
    if (!nid) nid = utils.genId()
    var children = this.state.children.slice()
    children.splice(i, 0, nid)
    this.setState({children: children})
    this.manager.setChildren(this.props.id, children, function (children) {
      this.setState({children: children})
    })
  },

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

  addAfter: function (i, id, focus) {
    var children = this.state.children.slice()
    children.splice(i+1, 0, id)
    this.setChildren(children, focus, id)
  },
  addToEnd: function (id, focus) {
    var children = this.state.children.slice()
    children.push(id)
    this.setChildren(children, focus, id)
  },

  getDefaultProps: function () {
    return {
      initialChildren: [],
      focus: false
    }
  },
  getInitialState: function () {
    return {
      children: this.props.initialChildren,
      focus: false
    }
  },
  gotChildren: function (children) {
    this.setState({children: children})
  },

  setChildren: function (ids, focus, i) {
    var st = {children: ids}
    if (focus) st.focus = i
    this.setState(st)
    this.props.manager.set('children', this.props.id, ids)
  },

  componentWillReceiveProps: function (nprops) {
    if (nprops.id !== this.props.id) {
      this.props.manager.off('children', this.props.id, this.gotChildren)
      this.props.manager.on('children', nprops.id, this.gotChildren)
    }
  },

  componentWillMount: function () {
    if (!this.props.manager) return
    this.props.manager.on('children', this.props.id, this.gotChildren)
  },

  componentWillUnmount: function () {
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

