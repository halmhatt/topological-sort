import assert from 'assert';
import dependencySort from '../index.js';

let items = [
	{name: 'jquery-plugin1', src: 'jquery-plugin-1.2.1.js', dep: ['jquery']},
	{name: 'jquery', src: 'jquery-1.6.2.js', dep: []},
	{name: 'underscore-plugin1', src: 'underscore-plugin.js', dep: ['underscore']},
	{name: 'underscore', src: 'underscore-1.2.2.js', dep: []},
];

describe('dependency-sort', () => {
	it('should sort items correctly', () => {
		let sorted = dependencySort.sort(items);

		let names = ['underscore', 'underscore-plugin1', 'jquery', 'jquery-plugin1'];

		for(let i = 0; i < sorted.length; i++) {
			let dep = sorted[i];
			assert.equal(dep.name, names[i], 'Names should match');
		}
	});

	it('should work with user defined compare function', () => {
		let items = [
			{id: 'jquery-plugin1', src: 'jquery-plugin-1.2.1.js', needs: ['jquery']},
			{id: 'jquery', src: 'jquery-1.6.2.js', needs: []},
			{id: 'underscore-plugin1', src: 'underscore-plugin.js', needs: ['underscore']},
			{id: 'underscore', src: 'underscore-1.2.2.js', needs: []},
		];

		// The order should atleast list underscore before underscore plugin
		// and jquery before jquery plugin
		let sorted = dependencySort.sort(
			items, 
			item => item.needs, 
			item => item.id
		);

		let names = ['underscore', 'underscore-plugin1', 'jquery', 'jquery-plugin1'];

		for(let i = 0; i < sorted.length; i++) {
			let dep = sorted[i];
			assert.equal(dep.id, names[i], 'Names should match');
		}
	});
});