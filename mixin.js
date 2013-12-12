
var utils = require('./utils')

function areq(a, b) {
  if (a.length != b.length) return false
  for (var i=0; i<a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

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
  getDefaultProps: function () {
    return {
      initialChildren: []
    }
  },
  getInitialState: function () {
    return {children: this.props.initialChildren}
  },
  gotChildren: function (err, children) {
    if (err) return console.error('failed to get children')
    this.setState({children: children})
  },
  componentWillMount: function () {
    if (!this.manager) return
    this.manager.getChildren(this.props.id, this.gotChildren)
  },
  shouldComponentUpdate: function (props, state) {
    return props.id !== this.props.id || !areq(state.children, this.state.children)
  },
}

