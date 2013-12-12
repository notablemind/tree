
module.exports = {
  toMap: toMap,
  fromMap: fromMap,
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

