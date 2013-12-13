
var Head = React.createClass({
  render: function () {
    return React.DOM.span({}, [
      this.props.id,
      React.DOM.span({onClick: this.props.moveLeft}, '<'),
      React.DOM.span({onClick: this.props.moveRight}, '>'),
      React.DOM.span({onClick: this.props.moveDown}, 'v'),
      React.DOM.span({onClick: this.props.moveUp}, '^'),
    ])
  }
})

// for focus testing
var InputHead = React.createClass({
  keys: function (e) {
    if (e.keyCode === 9) {
      e.preventDefault()
      if (e.shiftKey) {
        this.props.moveLeft(true)
      } else {
        this.props.moveRight(true)
      }
    }
    if (e.keyCode === 38 && e.shiftKey) {
      e.preventDefault()
      this.props.moveUp(true)
    }
    if (e.keyCode === 40 && e.shiftKey) {
      e.preventDefault()
      this.props.moveDown(true)
    }
  },
  // all about the focus
  componentDidMount: function () {
    if (this.state.focus) {
      this.refs.input.getDOMNode().focus()
    }
  },
  componentDidUpdate: function () {
    if (this.state.focus) {
      this.refs.input.getDOMNode().focus()
    }
  },
  componentWillReceiveProps: function (props, oprops) {
    if (props.focus) this.setState({focus: true})
  },

  componentWillMount: function () {
    if (!this.props.on) return
    this.props.on(this.gotData)
  },

  componentWillUnmount: function () {
    this.props.off(this.gotData)
  },

  gotData: function (data) {
    this.setState({input: data.name})
  },

  inputChange: function (e) {
    this.setState({input:e.target.value})
    this.props.set({name: e.target.value})
  },
  blur: function () {
    this.setState({focus: false})
  },
  focus: function () {
    this.setState({focus: true})
  },

  getInitialState: function () {
    return {
      focus: this.props.focus,
      input: ''
    }
  },

  render: function () {
    return React.DOM.input({
      ref: 'input',
      value: this.state.input,
      className: this.state.focus ? 'focus' : '',
      placeholder: 'feedme',
      onChange: this.inputChange,
      onBlur: this.blur,
      onFocus: this.focus,
      onKeyDown: this.keys
    })
  }
})

function rid() {
  var chars = 'abcdef0123456789'
    , id = ''
  for (var i=0; i<5; i++) {
    id += chars[parseInt(Math.random()*chars.length)]
  }
  return id
}

function rTree(idx, depth) {
  if (depth <= 0) return
  var n = parseInt(Math.random() * 3) + 2
    , children = []
  for (var i=0; i<n; i++) {
    children.push({
      id: rid(), // idx + ':' + i,
      data: {
        name: 'Name of ' + idx + ':' + i
      },
      children: rTree(idx + ':' + i, depth-1)
    })
  }
  return children
}

var tree = require('tree')
  , data = {id: 0, data: 'the top', children: rTree(0, 5)}

React.renderComponent(tree.Tree({
  manager: new tree.Manager(data),
  head: Head,
  id: 0,
}), document.getElementById('place'))

React.renderComponent(tree.Tree({
  manager: new tree.Manager({id: 0, children: rTree(0, 3)}),
  head: InputHead,
  id: 0,
}), document.getElementById('inputs'))

