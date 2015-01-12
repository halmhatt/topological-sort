'use strict';

/**
 * Topological sorting
 * @see http://en.wikipedia.org/wiki/Topological_sorting
 */
const TEMPORARY_MARK = '__TEMPORARY_MARK__';
const PERMANTENT_MARK = '__PERMANTENT_MARK__';

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
function unmark(item, mark = null) {
	if(mark === null) {
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
function isMarked(item, mark = null) {
	if(mark === null) {
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
export function sort(
		list,
		dependencyFunction = item => item.dep || item.dependencies || [],
		identifierFunction = item => item.name) {

	let sorted = [];

	// Visit function
	function visit(item) {
		if(isMarked(item, TEMPORARY_MARK)) {
			throw new Error('This is not a Direct Acyclic Graph (DAG)')
		} else if(!isMarked(item, PERMANTENT_MARK)) {
			mark(item, TEMPORARY_MARK);

			// Visit all deps that dependency has an edge TO
			/*eslint no-undef: 0 */
			list.filter((listItem) => {
				let deps = dependencyFunction(item);

				return deps.indexOf(identifierFunction(listItem)) !== -1;
			}).map((item) => {
				visit(item);
			});

			mark(item, PERMANTENT_MARK);
			unmark(item, TEMPORARY_MARK);
			sorted.unshift(item);
		}
	}

	// While there are unmarked items
	let unmarked = list.filter(item => !isMarked(item));
	while(unmarked.length > 0) {
		let item = unmarked.pop();

		visit(item);

		unmarked = list.filter(item => !isMarked(item));
	}

	// Remove permanent marks
	/*eslint no-redeclare: 0, semi: 0 */
	for(let item of sorted) {
		unmark(item);
	}

	// Reverse order because graph is in wrong direction
	return sorted.reverse();
}
