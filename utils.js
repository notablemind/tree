
module.exports = {
  toMap: toMap,
  fromMap: fromMap,
  areq: areq,
  cBind: cBind,
  cEqual: cEqual
}

function areq(a, b) {
  if (a.length != b.length) return false
  for (var i=0; i<a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

function cBind(fn) {
  var args = [].slice.call(arguments, 1)
    , f = fn.bind.apply(fn, args)
  f.args = args
  f.orig = fn
  return f
}

function cEqual(f1, f2) {
  if (f1.orig !== f2.orig) return false
  return areq(f1.args, f2.args)
}

function toMap(data) {
  var map = {}
    , children = []
    , cmap
  map[data.id] = {
    children: children
  }
  if (data.data) map[data.id].data = data.data
  if (!data.children) return map
  for (var i=0; i<data.children.length; i++) {
    children.push(data.children[i].id)
    cmap = toMap(data.children[i])
    for (var name in cmap) {
      map[name] = cmap[name]
    }
  }
  return map
}

function fromMap(root, map, hits) {
  var node = map[root]
    , tree = {
        id: root
      }
  hits = hits || {}
  if (hits[root]) throw new Error('Hit a node twice: ' + root)
  hits[root] = true
  if (node.data) tree.data = node.data
  if (!node.children.length) return tree
  tree.children = []
  for (var i=0; i<node.children.length; i++) {
    tree.children.push(fromMap(node.children[i], map, hits))
  }
  return tree
}

