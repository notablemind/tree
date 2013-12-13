
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

  setChildren: function (ids) {
    this.setState({children: ids})
    this.props.manager.set('children', this.props.id, ids)
  },
  moveUp: function (i) {
    var ids = this.state.children.slice()
    ids.splice(i-1, 0, ids.splice(i, 1)[0])
    this.setChildren(ids)
  },
  moveDown: function (i) {
    var ids = this.state.children.slice()
    ids.splice(i+1, 0, ids.splice(i, 1)[0])
    this.setChildren(ids)
  },
  moveRight: function (i) {
    if (i === 0) return false
    var children = this.state.children.slice()
      , id = children.splice(i, 1)[0]
    this.refs[i-1].addToEnd(id)
    this.setChildren(children)
  },
  moveLeft: function (i) {
    if (!this.props.addAfter) return
    var children = this.state.children.slice()
      , id = children.splice(i, 1)[0]
    this.props.addAfter(id)
    this.setChildren(children)
  },
  addAfter: function (i, id) {
    var children = this.state.children.slice()
    children.splice(i+1, 0, id)
    this.setChildren(children)
  },
  addToEnd: function (id) {
    var children = this.state.children.slice()
    children.push(id)
    this.setChildren(children)
  },

  getDefaultProps: function () {
    return {
      initialChildren: []
    }
  },
  getInitialState: function () {
    return {children: this.props.initialChildren}
  },
  gotChildren: function (children) {
    this.setState({children: children})
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
           !utils.areq(state.children, this.state.children)
  },
}

