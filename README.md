d3clock
=======

An analog clock implementation in d3.

(https://www.danielpradilla.info/blog/wp-content/uploads/2015/06/Screen-Shot-2015-06-05-at-5.26.54-PM.png)

[Read the post here](http://www.danielpradilla.info/blog/en/a-swiss-railway-clock-in-d3/)

I borrowed some ideas from:
- [https://github.com/wout/svg.clock.js](https://github.com/wout/svg.clock.js)
- [https://ericbullington.com/blog/2012/10/27/d3-oclock/](https://ericbullington.com/blog/2012/10/27/d3-oclock/)
- [http://www.infocaptor.com/dashboard/d3-javascript-visualization-to-build-world-analog-clocks](http://www.infocaptor.com/dashboard/d3-javascript-visualization-to-build-world-analog-clocks)


Usage:

Call d3clock(config) for each clock instance

eg:
```javascript
d3clock({
	target:'#chart1',
	face:'modern',
	width:1000,
	// date:'Mon May 25 2015 10:09:37',
	TZOffset:{
		hours:0
	}
});
```

You can create several instances in a page (for showing multiple time zones, for example)

If you send a date value in the config object, it shows a fixed time (good for testing)


Available faces
----------------

1. sbb: The famous [Swiss Railway Clock](https://en.wikipedia.org/wiki/Swiss_railway_clock)
2. modern: A somewhat modern/minimalist face
3. braun: A [Braun BN0021](http://www.braun-clocks.com/watch/BN0021BKBKG)-ish face