
/*
var Head = React.createClass({
  render: function () {
    return React.DOM.span({}, [
      this.props.id,
      React.DOM.span({onClick: this.props.goLeft}, '<'),
      React.DOM.span({onClick: this.props.goRight}, '>'),
      React.DOM.span({onClick: this.props.goDown}, 'v'),
      React.DOM.span({onClick: this.props.goUp}, '^'),
    ])
  }
})
*/

function rTree(idx, depth) {
  if (depth <= 0) return
  var n = parseInt(Math.random() * 3) + 2
    , children = []
  for (var i=0; i<n; i++) {
    children.push({
      id: idx + ':' + i,
      data: {
        name: 'Name of ' + idx + ':' + i
      },
      children: rTree(idx + ':' + i, depth-1)
    })
  }
  return children
}

var tree = require('tree')

React.renderComponent(tree.Tree({
  manager: new tree.Manager(rTree(0, 5)),
  id: 0,
  tree: rTree(0, 5),
/*
  manager: {
    getTreeFrom: function (id, done) {return done(data);}
  }
*/
}), document.getElementById('place'))

