
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

