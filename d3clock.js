var d3clock = function(config) {

  /*
  a d3 clock
  with ideas from https://github.com/wout/svg.clock.js
  https://ericbullington.com/blog/2012/10/27/d3-oclock/
  http://www.infocaptor.com/dashboard/d3-javascript-visualization-to-build-world-analog-clocks
  */

  var clockGroup, fields, formatHour, formatMinute, formatSecond, height, pi, render, scaleHours, scaleSecsMins, vis, width;

  var hourOffset = 0;
  var minOffset = 0;
  var secOffset = 0;

  formatSecond = d3.time.format("%S");
  formatMinute = d3.time.format("%M");
  formatHour = d3.time.format("%H");
  width = config.width ? config.width : 1000;
  height = width/2;

  var outerRadius = 0.8 * height/2;
  var offSetX = height/2;
  var offSetY = height/2;

  pi = Math.PI;

  scaleSecsMins = d3.scale.linear().domain([0, 59 + 59 / 60]).range([0, 2 * pi]);
  scaleHours = d3.scale.linear().domain([0, 11 + 59 / 60]).range([0, 2 * pi]);

  fields = function(date) {
    var d, data, hour, minute, second;
    if (date){
      d = new Date(date);
    } else {
      d = new Date();
    }
    second = d.getSeconds() + secOffset;
    minute = d.getMinutes() + minOffset;
    hour = d.getHours() + hourOffset + minute / 60;
    return data = [
      {
        "unit": "hours",
        "text": formatHour(d),
        "numeric": hour
      },
      {
        "unit": "minutes",
        "text": formatMinute(d),
        "numeric": minute
      }, 
      {
        "unit": "seconds",
        "text": formatSecond(d),
        "numeric": second
      }    ];
  };

  var setTZHours = function(hr) {
    if (hr !== undefined)
      hourOffset = hr;
  };  var setTZMins = function(min) {
    if (min !== undefined)
      minOffset = min;
  };
  var setTZSeconds = function(sec) {
    if (sec !== undefined)
      secOffset = sec;
  };

  if (config.TZOffset != undefined) {
    setTZHours(config.TZOffset.hours);
    setTZMins(config.TZOffset.mins);
    setTZSeconds(config.TZOffset.secs);
  }

  var face = 'sbb';
  if (typeof config.face !== 'undefined') {
    face = config.face;
  } 

  //clock faces configuration
  var faces = {
      'sbb':{
          outerRing: {r:outerRadius * 1.05, stroke: 'black', strokeWidth: 2},
          innerRing: {r:outerRadius * 0, fill: 'black'},
          innerMostRing: {r:outerRadius * 0.05/2, fill: 'black'},
          tickUnit: outerRadius * 0.0625/3,
          tickWidth: function(i) {
            return (i%5) ? this.tickUnit : this.tickUnit*3;
          },
          tickHeight: function(i) {
            return (i%5) ? this.tickUnit*3  : this.tickUnit*3*3;
          },
          rotationTranslate: function(i) {
            return "translate("+ (-this.tickWidth(i)/2) +",0)";
          },
          clockHandx: function(d) {
            if (d.unit==="hours"){
              return -this.tickUnit*3*2/2;
            } else if (d.unit==="minutes"){
              return -this.tickUnit*3*1.5/2;
            } else if (d.unit==="seconds") {
              return -this.tickUnit/2;
            }
          },
          clockHandy: function(d) {
            if (d.unit==="hours"){
              return -outerRadius + this.tickUnit*3*3 + this.tickUnit*4;
            } else if (d.unit==="minutes"){
              return -outerRadius + this.tickUnit*3;
            } else if (d.unit==="seconds") {
              return -outerRadius + this.tickUnit*3*3 + this.tickUnit*4;
            }
          },
          clockHandWidth: function(d) {
            if (d.unit === "hours") {
              return this.tickUnit*3*2;
            } else if (d.unit === "minutes") {
              return this.tickUnit*3*1.5;
            } else if (d.unit === "seconds") {
              return this.tickUnit;
            }
          },
          clockHandFill: function(d){
            if (d.unit==="seconds"){
              return "#e00";
            } else {
              return "#333";
            }
          },
          clockHandHeight: function(d){
            if (d.unit === "hours") {
              return (outerRadius - this.tickUnit*3 * 3) * 1.2;
            } else if (d.unit === "minutes") {
              return outerRadius* 1.2;
            } else if (d.unit === "seconds") {
              return (outerRadius - this.tickUnit*3 * 3) * 1.2;
            }
          },
          clockHandAdditional: function(clockHand){
            var that = this;
            clockHand.append("svg:circle").attr("r", function(d, i){
              if (d.unit==="hours"){
                return 0;
              } else if (d.unit==="minutes"){
                return 0;
              } else if (d.unit==="seconds") {
                return that.tickUnit * 4;
              }
            })
            .attr('cy', function(d, i) {
              return -outerRadius + that.tickUnit*3*3 + that.tickUnit*4
            })
            .attr("fill", "#e00");

          },
          easing:'linear'
      },
      'modern':{
          outerRing: {r:outerRadius * 1, stroke: '#999', strokeWidth: 1},
          innerRing: {r:outerRadius * 0.05, fill: 'black'},
          innerMostRing: {r:outerRadius * 0.05/2, fill: 'black'},
          tickUnit: outerRadius * 0.0625/3,
          tickWidth: function(i) {
            return (i%5) ? 0 : this.tickUnit;
          },
          tickHeight: function(i) {
            return (i%5) ? this.tickUnit  : this.tickUnit*3*2;
          },
          rotationTranslate: function(i) {
            return "translate("+ (-this.tickWidth(i)/2) +",0)";
          },
          clockHandWidth: function(d) {
            if (d.unit === "hours") {
              return this.tickUnit*3;
            } else if (d.unit === "minutes") {
              return this.tickUnit*2;
            } else if (d.unit === "seconds") {
              return this.tickUnit;
            }
          },
          clockHandHeight: function(d){
            if (d.unit === "hours") {
              return outerRadius - outerRadius/3 - this.innerRing.r*3;
            } else if (d.unit === "minutes") {
              return outerRadius - (this.innerRing.r*3 + this.tickUnit*4);
            } else if (d.unit === "seconds") {
              return (outerRadius -  (this.innerRing.r*3 + this.tickUnit*4));
            }
          },
          clockHandx: function(d) {
            if (d.unit==="hours"){
              return -this.tickUnit*3/2;
            } else if (d.unit==="minutes"){
              return -this.tickUnit*2/2;
            } else if (d.unit==="seconds") {
              return -this.tickUnit/2;
            }
          },
          clockHandy: function(d) {
            if (d.unit==="hours"){
              return -outerRadius + outerRadius/3 + this.innerRing.r*2;
            } else if (d.unit==="minutes"){
              return -outerRadius + this.innerRing.r*2 + this.tickUnit*4;
            } else if (d.unit==="seconds") {
              return -outerRadius + this.innerRing.r*2 + this.tickUnit*4;
            }
          },
          clockHandFill: function(d){
            if (d.unit==="seconds"){
              return "red";
            } else {
              return "#333";
            }
          },
          clockHandAdditional: function(clockHand){
            return true;
          },
          easing:'exp'

      }
  };


  //create the basic visualization:
  vis = d3.select(config.target).append("svg:svg").attr("width", width).attr("height", height).attr("class","clock");

  clockGroup = vis.append("svg:g").attr("transform", "translate(" + offSetX + "," + offSetY + ")");

  clockGroup.append("svg:circle")
      .attr("r", faces[face].outerRing.r)
      .attr("fill", "none")
      .attr("class", "clock outercircle")
      .attr("stroke", faces[face].outerRing.stroke)
      .attr("stroke-width", faces[face].outerRing.strokeWidth);

  clockGroup.append("svg:circle")
      .attr("r", faces[face].innerRing.r)
      .attr("fill", faces[face].innerRing.fill)
      .attr("class", "clock innercircle");

  clockGroup.append("svg:circle")
      .attr("r", faces[face].innerMostRing.r)
      .attr("fill", faces[face].innerMostRing.fill)
      .attr("class", "clock innermostcircle");


  tickGroup=clockGroup.append("svg:g");
  tickGroup.selectAll("rect.tick")
      .data(d3.range(60))
      .enter().append("svg:rect")
      .attr("class", "tick")
      .attr("x", 0)
      .attr("y", -outerRadius )
      // .attr("width", function(d, i){return (i%5) ? 0 : 1;})
      .attr("width", function(d, i){ return faces[face].tickWidth(i); })
      .attr("height", function(d, i){ return faces[face].tickHeight(i); })
      .attr("transform", function(d, i){
        return "rotate("+(i*6)+"),"+faces[face].rotationTranslate(i);});



  render = function(data) {
    //render / update the clock hands

    var clockHand = clockGroup.selectAll(".clockhand").data(data);
    if (!clockHand[0][0]) {
      //draw the hands if not drawn
      clockHand.remove();
      clockHand.enter().append("svg:g");
      clockHand.attr("class", function(d) {
        return "clockhand " + d.unit;
      }).append("svg:rect").attr("x", function(d, i){
        return faces[face].clockHandx(d);
      })
      .attr("y", function(d, i){
        return faces[face].clockHandy(d);
      })
      .attr("width",function(d,i){
        return faces[face].clockHandWidth(d);
      })
      .attr("fill", function(d,i){
        return faces[face].clockHandFill(d);
      })
      .attr("height",function(d,i){
        return faces[face].clockHandHeight(d);
      });
    } 

    clockHand.transition().duration(1000).ease(faces[face].easing).attr("transform", function(d,i) {
    if (d.unit==="hours"){
        return "rotate("+d.numeric%12 * 30+")";
      } else {
        return "rotate("+d.numeric * 6+")";
      }
    });

    faces[face].clockHandAdditional(clockHand);


  };

  if (config.date) {
    var data = fields(config.date);
    render(data);
  } else {
    setInterval(function() {
      var data = fields();
      return render(data);
    }, 1000);
  }

};