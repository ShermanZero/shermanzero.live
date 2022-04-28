const { init } = require('../serverless.js');

exports.handler = init({
	appDir: "_app",
	assets: new Set(["global.css","pngs/04262022_amethyst.jpg","pngs/04272022_food01.jpg","pngs/04272022_food02.jpg","pngs/04272022_sameday_samebullshit.png","svgs/chevron-right.svg","svgs/circle_check.svg","svgs/circle_x.svg","svgs/favicon.svg","svgs/nav/api.svg","svgs/nav/downloads.svg","svgs/nav/hamburger_menu.svg","svgs/nav/portfolio.svg","svgs/nav/projects.svg","svgs/nav/socials.svg","svgs/nav/upcoming.svg"]),
	mimeTypes: {".css":"text/css",".jpg":"image/jpeg",".png":"image/png",".svg":"image/svg+xml"},
	_: {
		entry: {"file":"start-fc959c8b.js","js":["start-fc959c8b.js","chunks/index-518a10ef.js"],"css":[]},
		nodes: [
			() => Promise.resolve().then(() => require('../server/nodes/0.js')),
			() => Promise.resolve().then(() => require('../server/nodes/1.js')),
			() => Promise.resolve().then(() => require('../server/nodes/4.js')),
			() => Promise.resolve().then(() => require('../server/nodes/2.js')),
			() => Promise.resolve().then(() => require('../server/nodes/3.js')),
			() => Promise.resolve().then(() => require('../server/nodes/5.js')),
			() => Promise.resolve().then(() => require('../server/nodes/6.js')),
			() => Promise.resolve().then(() => require('../server/nodes/7.js')),
			() => Promise.resolve().then(() => require('../server/nodes/9.js')),
			() => Promise.resolve().then(() => require('../server/nodes/10.js')),
			() => Promise.resolve().then(() => require('../server/nodes/8.js'))
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				id: "api",
				pattern: /^\/api\/?$/,
				names: [],
				types: [],
				path: "/api",
				shadow: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				id: "downloads",
				pattern: /^\/downloads\/?$/,
				names: [],
				types: [],
				path: "/downloads",
				shadow: null,
				a: [0,4],
				b: [1]
			},
			{
				type: 'page',
				id: "invitation",
				pattern: /^\/invitation\/?$/,
				names: [],
				types: [],
				path: "/invitation",
				shadow: null,
				a: [0,5],
				b: [1]
			},
			{
				type: 'page',
				id: "linzy",
				pattern: /^\/linzy\/?$/,
				names: [],
				types: [],
				path: "/linzy",
				shadow: null,
				a: [0,6],
				b: [1]
			},
			{
				type: 'page',
				id: "portfolio",
				pattern: /^\/portfolio\/?$/,
				names: [],
				types: [],
				path: "/portfolio",
				shadow: null,
				a: [0,7],
				b: [1]
			},
			{
				type: 'page',
				id: "projects",
				pattern: /^\/projects\/?$/,
				names: [],
				types: [],
				path: "/projects",
				shadow: null,
				a: [0,8],
				b: [1]
			},
			{
				type: 'page',
				id: "upcoming",
				pattern: /^\/upcoming\/?$/,
				names: [],
				types: [],
				path: "/upcoming",
				shadow: null,
				a: [0,9],
				b: [1]
			},
			{
				type: 'page',
				id: "projects/coworkerquiz",
				pattern: /^\/projects\/coworkerquiz\/?$/,
				names: [],
				types: [],
				path: "/projects/coworkerquiz",
				shadow: null,
				a: [0,10],
				b: [1]
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
});
