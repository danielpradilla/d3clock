d3clock
=======

An analog clock implementation in d3.

Usage:

d3clock(config);
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

if you send a date value in the config object, it shows a fixed time (good for testing)


Available faces
----------------

1. sbb: The famous [Swiss Railway Clock](https://en.wikipedia.org/wiki/Swiss_railway_clock)
2. modern: A somewhat modern/minimalist face
