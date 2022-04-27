const { init } = require('../handler.js');

exports.handler = init({
	appDir: "_app",
	assets: new Set(["global.css","pngs/04262022_amethyst.jpg","svgs/circle_check.svg","svgs/circle_x.svg","svgs/favicon.svg","svgs/nav/api.svg","svgs/nav/downloads.svg","svgs/nav/hamburger_menu.svg","svgs/nav/portfolio.svg","svgs/nav/projects.svg","svgs/nav/socials.svg","svgs/nav/upcoming.svg"]),
	_: {
		mime: {".css":"text/css",".jpg":"image/jpeg",".svg":"image/svg+xml"},
		entry: {"file":"start-9c1d7c68.js","js":["start-9c1d7c68.js","chunks/vendor-43dc4268.js"],"css":[]},
		nodes: [
			() => Promise.resolve().then(() => require('../server/nodes/0.js')),
			() => Promise.resolve().then(() => require('../server/nodes/1.js')),
			() => Promise.resolve().then(() => require('../server/nodes/2.js')),
			() => Promise.resolve().then(() => require('../server/nodes/3.js')),
			() => Promise.resolve().then(() => require('../server/nodes/4.js')),
			() => Promise.resolve().then(() => require('../server/nodes/5.js')),
			() => Promise.resolve().then(() => require('../server/nodes/6.js')),
			() => Promise.resolve().then(() => require('../server/nodes/7.js')),
			() => Promise.resolve().then(() => require('../server/nodes/8.js')),
			() => Promise.resolve().then(() => require('../server/nodes/9.js')),
			() => Promise.resolve().then(() => require('../server/nodes/10.js'))
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
				pattern: /^\/invitation\/?$/,
				params: null,
				path: "/invitation",
				shadow: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/downloads\/?$/,
				params: null,
				path: "/downloads",
				shadow: null,
				a: [0,4],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/portfolio\/?$/,
				params: null,
				path: "/portfolio",
				shadow: null,
				a: [0,5],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/projects\/coworkerquiz\/?$/,
				params: null,
				path: "/projects/coworkerquiz",
				shadow: null,
				a: [0,6],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/projects\/?$/,
				params: null,
				path: "/projects",
				shadow: null,
				a: [0,7],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/upcoming\/?$/,
				params: null,
				path: "/upcoming",
				shadow: null,
				a: [0,8],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/linzy\/?$/,
				params: null,
				path: "/linzy",
				shadow: null,
				a: [0,9],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/api\/?$/,
				params: null,
				path: "/api",
				shadow: null,
				a: [0,10],
				b: [1]
			}
		]
	}
});
