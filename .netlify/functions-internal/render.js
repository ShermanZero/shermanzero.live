const { init } = require('../handler.js');

exports.handler = init({
	appDir: "_app",
	assets: new Set(["favicon.png","global.css","res/fonts/dH07_tfV5sRln3Z38OGbaBoL.ttf_0.png","res/fonts/font.bmp","res/fonts/font.ttf","res/fonts/font_24.fnt","res/imgs/circle.png","res/imgs/cw_generic.png","res/imgs/template.png","res/json/alignments.json","res/json/descriptors.json","res/json/questions.json"]),
	_: {
		mime: {".png":"image/png",".css":"text/css",".bmp":"image/bmp",".ttf":"font/ttf",".json":"application/json"},
		entry: {"file":"start-de72a57b.js","js":["start-de72a57b.js","chunks/vendor-b8589598.js"],"css":[]},
		nodes: [
			() => Promise.resolve().then(() => require('../server/nodes/0.js')),
			() => Promise.resolve().then(() => require('../server/nodes/1.js')),
			() => Promise.resolve().then(() => require('../server/nodes/2.js')),
			() => Promise.resolve().then(() => require('../server/nodes/3.js')),
			() => Promise.resolve().then(() => require('../server/nodes/4.js')),
			() => Promise.resolve().then(() => require('../server/nodes/5.js')),
			() => Promise.resolve().then(() => require('../server/nodes/6.js')),
			() => Promise.resolve().then(() => require('../server/nodes/7.js')),
			() => Promise.resolve().then(() => require('../server/nodes/8.js'))
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/downloads\/?$/,
				params: null,
				path: "/downloads",
				shadow: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/portfolio\/?$/,
				params: null,
				path: "/portfolio",
				shadow: null,
				a: [0,4],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/projects\/coworkerquiz\/?$/,
				params: null,
				path: "/projects/coworkerquiz",
				shadow: null,
				a: [0,5],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/projects\/?$/,
				params: null,
				path: "/projects",
				shadow: null,
				a: [0,6],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/upcoming\/?$/,
				params: null,
				path: "/upcoming",
				shadow: null,
				a: [0,7],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/api\/?$/,
				params: null,
				path: "/api",
				shadow: null,
				a: [0,8],
				b: [1]
			}
		]
	}
});
