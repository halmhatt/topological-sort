"use strict";

exports.sort = sort;
/**
 * Topological sorting
 * @see http://en.wikipedia.org/wiki/Topological_sorting
 */
var TEMPORARY_MARK = "__TEMPORARY_MARK__";
var PERMANTENT_MARK = "__PERMANTENT_MARK__";

/**
 * Mark item with temporary of permanent mark
 * @param  {Object} item Any object
 * @param  {String} mark Mark to attach to object
 */
function mark(item, mark) {
  item[mark] = true;
}

/**
 * Unmark item with an optional mark
 * @param  {Object} item   Any object
 * @param  {String} [mark] Mark to remove
 */
function unmark(item) {
  var mark = arguments[1] === undefined ? null : arguments[1];
  if (mark === null) {
    delete item[TEMPORARY_MARK];
    delete item[PERMANTENT_MARK];
  }

  delete item[mark];
}

/**
 * Check if item is marked
 * @param  {Object}  item   Any object
 * @param  {String}  [mark] Mark to check for
 * @return {Boolean}        True if item is marked
 */
function isMarked(item) {
  var mark = arguments[1] === undefined ? null : arguments[1];
  if (mark === null) {
    return item[TEMPORARY_MARK] || item[PERMANTENT_MARK];
  }

  return item[mark] === true;
}

/**
 * Sort items according to their dependencies
 * @param  {Object[]}   list               List of items to sort
 * @param  {Function} dependencyFunction   Should return an array of dependencies for the item
 * @param  {Function} identifierFunction   Should return an identifier for the item
 * @return {Object[]}                      Sorted array of items
 */
/*eslint no-unused-vars: 0 , no-use-before-define: 0 */
function sort(list) {
  var dependencyFunction = arguments[1] === undefined ? function (item) {
    return item.dep || item.dependencies || [];
  } : arguments[1];
  var identifierFunction = arguments[2] === undefined ? function (item) {
    return item.name;
  } : arguments[2];


  var sorted = [];

  // Visit function
  function visit(item) {
    if (isMarked(item, TEMPORARY_MARK)) {
      throw new Error("This is not a Direct Acyclic Graph (DAG)");
    } else if (!isMarked(item, PERMANTENT_MARK)) {
      mark(item, TEMPORARY_MARK);

      // Visit all deps that dependency has an edge TO
      /*eslint no-undef: 0 */
      list.filter(function (listItem) {
        var deps = dependencyFunction(item);

        return deps.indexOf(identifierFunction(listItem)) !== -1;
      }).map(function (item) {
        visit(item);
      });

      mark(item, PERMANTENT_MARK);
      unmark(item, TEMPORARY_MARK);
      sorted.unshift(item);
    }
  }

  // While there are unmarked items
  var unmarked = list.filter(function (item) {
    return !isMarked(item);
  });
  while (unmarked.length > 0) {
    (function () {
      var item = unmarked.pop();

      visit(item);

      unmarked = list.filter(function (item) {
        return !isMarked(item);
      });
    })();
  }

  // Remove permanent marks
  /*eslint no-redeclare: 0, semi: 0 */
  for (var _iterator = sorted[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
    var item = _step.value;
    unmark(item);
  }

  // Reverse order because graph is in wrong direction
  return sorted.reverse();
}

