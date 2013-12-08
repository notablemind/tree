
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("tree/index.js", Function("exports, require, module",
"/** @jsx React.DOM */\n\
\n\
var states = require('./states')\n\
\n\
///var _ = require('lodash')\n\
\n\
var Tree = module.exports = React.createClass({\n\
  getDefaultProps: function () {\n\
    return {\n\
      id: 0,\n\
      tree: [],\n\
      manager: null\n\
    }\n\
  },\n\
  getInitialState: function () {\n\
    return {\n\
      tree: this.props.tree\n\
    }\n\
  },\n\
  componentWillMount: function () {\n\
    this.props.manager.getTreeFrom(this.props.id, function (ids) {\n\
      this.setState({tree: ids})\n\
    }.bind(this))\n\
  },\n\
  /*\n\
  save: function (children) {\n\
    this.setState({children: children})\n\
    this.props.manager.setChildren(this.props.id, children, function (ids) {\n\
      this.setState({children: ids})\n\
    }.bind(this))\n\
  },\n\
  moveUp: function (idx) {\n\
    if (idx === 0) return console.warn('Moving up and out not yet implemented')\n\
    var children = this.state.children\n\
    children.splice(idx-1, 0, children.splice(idx, 1))\n\
    this.save(children)\n\
  },\n\
  moveDown: function (idx) {\n\
    if (idx === this.children.length - 1) return console.warn('Moving down and out not yet implemented')\n\
    var children = this.state.children\n\
    children.splice(idx + 1, 0, children.splice(idx, 1))\n\
    this.save(children)\n\
  }\n\
  indent: function (idx) {\n\
\n\
  },\n\
  addChild: function (idx, start) {\n\
    var children = this.state.children\n\
    if (start) {\n\
      children.unshift(idx)\n\
    } else {\n\
      children.push(idx)\n\
    }\n\
    this.save(children)\n\
  },\n\
  */\n\
  go: function (what, trail) {\n\
    var tree = states[what](trail, this.state.tree)\n\
    // todo also return info about what to save. Don't want to save the whole\n\
    // tree every time\n\
    if (tree) this.setState({tree: tree})\n\
  },\n\
  renderOne: function (id, children, trail) {\n\
    var childnodes = false\n\
      , self = this\n\
    if (children && children.length) {\n\
      childnodes = (\n\
        React.DOM.div( {className:\"children\"}, \n\
          \n\
            children.map(function (child, i) {\n\
              return self.renderOne(child.id, child.children || [], trail.concat([i]))\n\
            })\n\
          \n\
        )\n\
      )\n\
    }\n\
    return (\n\
      React.DOM.div( {className:\"tree\"}, \n\
        React.DOM.div( {className:\"head\"}, \n\
          \n\
            this.props.head({\n\
              id: id,\n\
              manager: this.props.manager,\n\
              goUp: this.go.bind(this, 'up', trail),\n\
              goDown: this.go.bind(this, 'down', trail),\n\
              goLeft: this.go.bind(this, 'left', trail),\n\
              goRight: this.go.bind(this, 'right', trail)\n\
            })\n\
          \n\
        ),\n\
         childnodes \n\
      )\n\
    )\n\
  },\n\
  render: function () {\n\
    return this.renderOne(this.props.id, this.state.tree, [])\n\
  },\n\
})\n\
//@ sourceURL=tree/index.js"
));
require.register("tree/states.js", Function("exports, require, module",
"\n\
module.exports = {\n\
  up: up,\n\
  down: down,\n\
  left: left,\n\
  right: right\n\
}\n\
\n\
function follow(tree, id) {\n\
  return tree[id].children\n\
}\n\
\n\
function up(trail, tree) {\n\
  trail = trail.slice()\n\
  var idx = trail.pop()\n\
    , children = trail.reduce(follow, tree)\n\
  if (idx === 0) return // not yet supported\n\
  children.splice(idx-1, 0, children.splice(idx, 1)[0])\n\
  return tree\n\
}\n\
\n\
function down(trail, tree) {\n\
  trail = trail.slice()\n\
  var idx = trail.pop()\n\
    , children = trail.reduce(follow, tree)\n\
  if (idx === children.length - 1) return // not yet supported\n\
  children.splice(idx+1, 0, children.splice(idx, 1)[0])\n\
  return tree\n\
}\n\
\n\
function left(trail, tree) {\n\
  trail = trail.slice()\n\
  var idx = trail.pop()\n\
  if (trail.length === 0) return // cannot go higher; cannot become peer of the main parent\n\
  var next = trail.pop()\n\
    , children = trail.reduce(follow, tree)\n\
  children.splice(next+1, 0, children[next].children.splice(idx, 1)[0])\n\
  return tree\n\
}\n\
\n\
function right(trail, tree) {\n\
  trail = trail.slice()\n\
  var idx = trail.pop()\n\
    , children = trail.reduce(follow, tree)\n\
  if (idx === 0) return // not yet supported\n\
  if (!children[idx-1].children) children[idx-1].children = []\n\
  children[idx-1].children.push(children.splice(idx, 1)[0])\n\
  return tree\n\
}\n\
//@ sourceURL=tree/states.js"
));
require.alias("tree/index.js", "tree/index.js");