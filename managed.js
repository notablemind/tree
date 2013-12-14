
var utils = require('./utils')

module.exports = {
  getDefaultProps: function () {
    return {
      initialChildren: [],
      manager: null,
      id: null
    }
  },
  getInitialState: function () {
    return {children: this.props.initialChildren}
  },
  componentWillReceiveProps: function (props) {
    if (props.id === this.props.id) return
    if (!this.props.manager) return
    this.props.manager.off('children', this.props.id, this.gotChildren)
    this.props.manager.on('children', props.id, this.gotChildren)
  },
  componentWillMount: function () {
    if (!this.props.manager) return
    this.props.manager.on('children', this.props.id, this.gotChildren)
  },
  componentWillUnmount: function () {
    if (!this.props.manager) return
    this.props.manager.off('children', this.props.id, this.gotChildren)
  },

  gotChildren: function (children) {
    this.setState({children: children})
  },

}

