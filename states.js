
module.exports = {
  up: up,
  down: down,
  left: left,
  right: right
}

function follow(tree, id) {
  return tree[id].children
}

function up(trail, tree) {
  trail = trail.slice()
  var idx = trail.pop()
    , children = trail.reduce(follow, tree)
  if (idx === 0) return // not yet supported
  children.splice(idx-1, 0, children.splice(idx, 1)[0])
  return tree
}

function down(trail, tree) {
  trail = trail.slice()
  var idx = trail.pop()
    , children = trail.reduce(follow, tree)
  if (idx === children.length - 1) return // not yet supported
  children.splice(idx+1, 0, children.splice(idx, 1)[0])
  return tree
}

function left(trail, tree) {
  trail = trail.slice()
  var idx = trail.pop()
  if (trail.length === 0) return // cannot go higher; cannot become peer of the main parent
  var next = trail.pop()
    , children = trail.reduce(follow, tree)
  children.splice(next+1, 0, children[next].children.splice(idx, 1)[0])
  return tree
}

function right(trail, tree) {
  trail = trail.slice()
  var idx = trail.pop()
    , children = trail.reduce(follow, tree)
  if (idx === 0) return // not yet supported
  if (!children[idx-1].children) children[idx-1].children = []
  children[idx-1].children.push(children.splice(idx, 1)[0])
  return tree
}

