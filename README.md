# Topological sort

Sort dependencies

```js
import topological from '../index.js';

let items = [
	{name: 'jquery-plugin1', src: 'jquery-plugin-1.2.1.js', dep: ['jquery']},
	{name: 'jquery', src: 'jquery-1.6.2.js', dep: []},
	{name: 'underscore-plugin1', src: 'underscore-plugin.js', dep: ['underscore']},
	{name: 'underscore', src: 'underscore-1.2.2.js', dep: []}
];

let sorted = topological.sort(items);
// sorted:
// [
//		{name: 'underscore', src: 'underscore-1.2.2.js', dep: []},
//		{name: 'underscore-plugin1', src: 'underscore-plugin.js', dep: ['underscore']},
//		{name: 'jquery', src: 'jquery-1.6.2.js', dep: []},
//		{name: 'jquery-plugin1', src: 'jquery-plugin-1.2.1.js', dep: ['jquery']}	
// ]
```

Use your own structure
```js
let items = [
	{id: 'jquery-plugin1', source: 'jquery-plugin1.js', needs: ['jquery']},
	{id: 'jquery', source: 'jquery.js', needs: []}
];

let sorted = topological.sort(
	items, 
	(item) => item.needs || [], 
	(item) => item.id);
```