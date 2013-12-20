
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
    return {
      children: this.props.initialChildren,
      open: true
    }
  },
  componentWillReceiveProps: function (props) {
    if (props.id === this.props.id) return
    if (!this.props.manager) return
    this.props.manager.off(this.props.id, this.gotData)
    this.props.manager.on(props.id, this.gotData)
  },
  componentWillMount: function () {
    if (!this.props.manager) return
    this.props.manager.on(this.props.id, this.gotData)
  },
  componentWillUnmount: function () {
    if (!this.props.manager) return
    this.props.manager.off(this.props.id, this.gotData)
  },

  gotData: function (data) {
    this.setState({children: data.children, open: !!data.open})
  },

}

