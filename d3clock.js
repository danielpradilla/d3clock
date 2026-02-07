var d3clock = function(config) {

  /*
  D3 Clock
  by: Daniel Pradilla <info@danielpradilla.info>
  blog: http://danielpradilla.info

  With ideas from 
  https://github.com/wout/svg.clock.js
  https://ericbullington.com/blog/2012/10/27/d3-oclock/
  http://www.infocaptor.com/dashboard/d3-javascript-visualization-to-build-world-analog-clocks
  */

  var clockGroup, fields, height, render, tickGroup, vis, width;

  var hourOffset = 0;
  var minOffset = 0;
  var secOffset = 0;

  width = config.width ? config.width : 1000;
  height = width/2;

  var outerRadius = 0.8 * height/2;
  var offSetX = height/2;
  var offSetY = height/2;

  var normalizeModulo = function(value, modulo) {
    return ((value % modulo) + modulo) % modulo;
  };

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
        "numeric": hour
      },
      {
        "unit": "minutes",
        "numeric": minute
      }, 
      {
        "unit": "seconds",
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

  var romanNumerals = ['I','II','III','IIII','V','VI','VII','VIII','IX','X','XI','XII'];

  //clock faces configuration
  var faces = {
      'sbb':{
          outerRing: {r:outerRadius * 1.05, stroke: 'black', strokeWidth: 2},
          secondsRing: {r:outerRadius * 0, fill: 'black'},
          secondsInnermostRing: {r:outerRadius * 0, fill: 'black'},
          tickUnit: outerRadius * 0.0625/3,
          tickWidth: function(i) {
            return (i%5) ? this.tickUnit : this.tickUnit*3;
          },
          tickHeight: function(i) {
            return (i%5) ? this.tickUnit*3  : this.tickUnit*3*3;
          },
          tickFill: function(i) {
            return 'black';
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
	            clockHand.each(function(d){
	              var handGroup = d3.select(this);
	              var cap = handGroup.selectAll("circle.sbb-second-cap")
	                .data(d.unit === "seconds" ? [d] : []);

	              var capEnter = cap.enter()
	                .append("svg:circle")
	                .attr("class", "sbb-second-cap");

	              capEnter.merge(cap)
	                .attr("r", that.tickUnit * 4)
	                .attr("cy", -outerRadius + that.tickUnit*3*3 + that.tickUnit*4)
	                .attr("fill", "#e00");

	              cap.exit().remove();
	            });
	          },
          clockGroupAdditional: function(clockGroup) {
            return true;
          },
	          easing:d3.easeLinear
      },
      'modern':{
          outerRing: {r:outerRadius * 1, stroke: '#999', strokeWidth: 1},
          secondsRing: {r:outerRadius * 0.05, fill: 'black'},
          secondsInnermostRing: {r:outerRadius * 0.05/2, fill: 'black'},
          tickUnit: outerRadius * 0.0625/3,
          tickWidth: function(i) {
            return (i%5) ? 0 : this.tickUnit;
          },
          tickHeight: function(i) {
            return (i%5) ? this.tickUnit  : this.tickUnit*3*2;
          },
          tickFill: function(i) {
            return 'black';
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
              return outerRadius - outerRadius/3 - this.secondsRing.r*3;
            } else if (d.unit === "minutes") {
              return outerRadius - (this.secondsRing.r*3 + this.tickUnit*4);
            } else if (d.unit === "seconds") {
              return (outerRadius -  (this.secondsRing.r*3 + this.tickUnit*4));
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
              return -outerRadius + outerRadius/3 + this.secondsRing.r*3;
            } else if (d.unit==="minutes"){
              return -outerRadius + this.secondsRing.r*3 + this.tickUnit*4;
            } else if (d.unit==="seconds") {
              return -outerRadius + this.secondsRing.r*2 + this.tickUnit*4;
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
          clockGroupAdditional: function(clockGroup) {
            return true;
          },
	          easing:d3.easeExp

      },
      'braun':{
          outerRing: {r:outerRadius * 1.02, stroke: '#999', strokeWidth: 1},
          secondsRing: {r:outerRadius * 0.04, fill: '#F6C52E'},
          secondsInnermostRing: {r:outerRadius * 0.05/5, fill: 'black'},
          tickUnit: outerRadius * 0.0625/3,
          tickWidth: function(i) {
            return (i%5) ? this.tickUnit/3 : this.tickUnit;
          },
          tickHeight: function(i) {
            return (i%5) ? this.tickUnit*3*1.5  : this.tickUnit*3*1.5;
          },
          tickFill: function(i) {
            return (i%5) ? '#999' : 'black';
          },
          tickText: {
            fontSize: (width * 14 / 500),
            fontFamily:'Helvetica, Arial, sans-serif',
            fn: function(i){
              return ((i%5) ? '' : (i/5 > 0) ? i/5: 12);
            }
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
              return outerRadius - outerRadius/3 - this.secondsRing.r*3;
            } else if (d.unit === "minutes") {
              return outerRadius - (this.secondsRing.r*3 + this.tickUnit*4);
            } else if (d.unit === "seconds") {
              return (outerRadius - this.tickUnit*4);
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
              return -outerRadius + outerRadius/3 + this.secondsRing.r*3;
            } else if (d.unit==="minutes"){
              return -outerRadius + this.secondsRing.r*3 + this.tickUnit*4;
            } else if (d.unit==="seconds") {
              return -outerRadius + this.secondsRing.r*3 + this.tickUnit*4 ;
            }
          },
          clockHandFill: function(d){
            if (d.unit==="seconds"){
              return "#F6C52E";
            } else if (d.unit==="minutes") {
              return "#333";
            } else {
              return "#666";
            }
          },
          clockHandAdditional: function(clockHand){
            return true;
          },
          clockGroupAdditional: function(clockGroup) {
            return true;
          },
	          easing:d3.easeCircle

      },
      'classic':{
          outerRing: {r:outerRadius * 1, fill: 'black', stroke: '#000', strokeWidth: 1},
          secondsRing: {r:outerRadius * 0.04, fill: 'black'},
          secondsInnermostRing: {r:outerRadius * 0.05/5, fill: 'black'},
          tickUnit: outerRadius * 0.0625/3,
          tickWidth: function(i) {
            return (i%5) ? this.tickUnit/3 : this.tickUnit*3;
          },
          tickHeight: function(i) {
            return (i%5) ? this.tickUnit*3*1.5  : this.tickUnit*3*1.5;
          },
          tickFill: function(i) {
            return (i%5) ? '#999' : 'black';
          },
          tickTextRotated: {
            fontSize: (width * 14 / 500),
            fontFamily:'Georgia, serif',
            fn: function(i){
              return ((i%5) ? '' : (i/5 > 0) ? romanNumerals[i/5 - 1]: romanNumerals[12-1]);
            }
          },
          tickTextX: function(i){ 
            if (this.tickTextRotated.fn(i).length>1) {
              return -this.tickTextRotated.fontSize + 1.5*this.tickTextRotated.fontSize/this.tickTextRotated.fn(i).length;
            } else {
              return 0;
            }
          },
          rotationTranslate: function(i) {
            return "translate("+ (-this.tickWidth(i)/2) +",0)";
          },
          clockHandWidth: function(d) {
            if (d.unit === "hours") {
              return this.tickUnit*2;
            } else if (d.unit === "minutes") {
              return this.tickUnit*2;
            } else if (d.unit === "seconds") {
              return this.tickUnit/2;
            }
          },
          clockHandHeight: function(d){
            if (d.unit === "hours") {
              return outerRadius - outerRadius/3 - this.secondsRing.r*3;
            } else if (d.unit === "minutes") {
              return outerRadius - (this.secondsRing.r*3 + this.tickUnit*4);
            } else if (d.unit === "seconds") {
              return (outerRadius - this.tickUnit*4);
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
              return -outerRadius + outerRadius/3 + this.secondsRing.r*3;
            } else if (d.unit==="minutes"){
              return -outerRadius + this.secondsRing.r*3 + this.tickUnit*4;
            } else if (d.unit==="seconds") {
              return -outerRadius + this.secondsRing.r*3 + this.tickUnit*4 ;
            }
          },
          clockHandFill: function(d){
            if (d.unit==="seconds"){
              return "black";
            } else if (d.unit==="minutes") {
              return "black";
            } else {
              return "black";
            }
          },
          clockHandAdditional: function(clockHand){
            return true;
          },
          clockGroupAdditional: function(clockGroup) {
            clockGroup.append("svg:circle")
              .attr('r', this.outerRing.r - this.tickUnit*4)
              .attr("fill", "none")
              .attr("stroke", "#000").attr("stroke-width","1px");

          },
	          easing:d3.easeExp

      }

  };

  if (!faces[face]) {
    face = 'sbb';
  }
  var faceObj = faces[face];

  var secondDisplayValue = function(secondValue) {
    var normalizedSecond = normalizeModulo(Math.floor(secondValue), 60);
    if (face !== 'sbb') {
      return normalizedSecond;
    }
    if (normalizedSecond >= 58) {
      return 60;
    }
    return normalizedSecond * (60 / 58);
  };

  //create the basic visualization:
  vis = d3.select(config.target).append("svg:svg").attr("width", width).attr("height", height).attr("class","clock");

  clockGroup = vis.append("svg:g").attr("transform", "translate(" + offSetX + "," + offSetY + ")");

  //create the outer circle of the clock face
  clockGroup.append("svg:circle")
      .attr("r", faceObj.outerRing.r)
      .attr("fill", "none")
      .attr("class", "clock outercircle")
      .attr("stroke", faceObj.outerRing.stroke)
      .attr("stroke-width", faceObj.outerRing.strokeWidth);

  faceObj.clockGroupAdditional(clockGroup);

  var tickData = d3.range(60).map(function(i) {
    return {
      i: i,
      tickTextValue: faceObj.tickText ? '' + faceObj.tickText.fn(i) : '',
      tickTextRotatedValue: faceObj.tickTextRotated ? '' + faceObj.tickTextRotated.fn(i) : ''
    };
  });

  //create the minutes and hours ticks
  tickGroup=clockGroup.append("svg:g")
      .selectAll(".tick")
      .data(tickData)
      .enter();

  tickGroup.append("svg:rect")
      .attr("class", "tick")
      .attr("x", 0)
      .attr("y", -outerRadius )
      // .attr("width", function(d, i){return (i%5) ? 0 : 1;})
      .attr("width", function(d){ return faceObj.tickWidth(d.i); })
      .attr("height", function(d){ return faceObj.tickHeight(d.i); })
      .attr("fill", function(d){ return faceObj.tickFill(d.i);})
      .attr("transform", function(d){
        return "rotate("+(d.i*6)+"),"+faceObj.rotationTranslate(d.i);}
      );

  if (faceObj.tickText){
    var radian = function(i) {return 6*i*(Math.PI/180) - (90 * Math.PI/180); }
    tickGroup
        .append("text")
        .attr("class", "tick")
        .attr("x", function(d){
          var xPos = Math.cos(radian(d.i));
          var pos = Math.round(100*xPos); //>0, <0, 0
          var labelLength = d.tickTextValue.length;
          if (pos>0){
            return (outerRadius - faceObj.tickHeight(d.i) - faceObj.tickText.fontSize )*xPos;
          } else if (pos<0) {
            return (outerRadius - faceObj.tickText.fontSize/1.2 )*xPos;
          } else {
            return -faceObj.tickText.fontSize*labelLength/2 + labelLength * faceObj.tickText.fontSize/5  ;
          }
        })
        .attr("y", function(d){
          var yPos = Math.sin(radian(d.i));
          var pos = Math.round(100*yPos);
          if (pos>0){
            return (outerRadius - faceObj.tickText.fontSize )*yPos;
          } else if (pos<0) {
            return (outerRadius - faceObj.tickHeight(d.i) - faceObj.tickText.fontSize )*yPos;
          } else {
            return faceObj.tickText.fontSize/3  ;          
          }
        })

        .attr("font-family", faceObj.tickText.fontFamily)
        .attr("font-size", faceObj.tickText.fontSize)
        .text(function(d){return d.tickTextValue;});
  }

  if (faceObj.tickTextRotated){
    tickGroup
        .append("text")
        .attr("class", "tick")
        .attr("x", function(d) {return faceObj.tickTextX(d.i);})
        .attr("y", function(d) {return -outerRadius + faceObj.tickHeight(d.i)*2.5;})
        .attr("font-family", faceObj.tickTextRotated.fontFamily)
        .attr("font-size", faceObj.tickTextRotated.fontSize)
        .text(function(d){return d.tickTextRotatedValue;})
        .attr("transform", function(d){
          return "rotate("+(d.i*6)+"),"+faceObj.rotationTranslate(d.i);}
        );
  }



  var clockHands = null;
  var intervalId = null;
  var destroyed = false;

  var ensureHands = function(data) {
    if (clockHands) {
      return;
    }

    clockHands = clockGroup.selectAll(".clockhand")
      .data(data, function(d) { return d.unit; });

    var clockHandsEnter = clockHands.enter()
      .append("svg:g")
      .attr("class", function(d) {
        return "clockhand " + d.unit;
      });

    clockHandsEnter.append("svg:rect")
      .attr("x", function(d){
        return faceObj.clockHandx(d);
      })
      .attr("y", function(d){
        return faceObj.clockHandy(d);
      })
      .attr("width", function(d){
        return faceObj.clockHandWidth(d);
      })
      .attr("fill", function(d){
        return faceObj.clockHandFill(d);
      })
      .attr("height", function(d){
        return faceObj.clockHandHeight(d);
      });

    faceObj.clockHandAdditional(clockHandsEnter);
    clockHands.exit().remove();
    clockHands = clockGroup.selectAll(".clockhand");

    clockGroup.selectAll("circle.innercircle")
      .data([0])
      .enter()
      .append("svg:circle")
      .attr("r", faceObj.secondsRing.r)
      .attr("fill", faceObj.secondsRing.fill)
      .attr("class", "clock innercircle");

    clockGroup.selectAll("circle.innermostcircle")
      .data([0])
      .enter()
      .append("svg:circle")
      .attr("r", faceObj.secondsInnermostRing.r)
      .attr("fill", faceObj.secondsInnermostRing.fill)
      .attr("class", "clock innermostcircle");
  };

  render = function(data) {
    if (destroyed) {
      return;
    }

    ensureHands(data);
    clockHands = clockGroup.selectAll(".clockhand")
      .data(data, function(d) { return d.unit; });

    clockHands.interrupt().transition().duration(900).ease(faceObj.easing).attr("transform", function(d) {
      if (d.unit==="hours"){
        return "rotate("+d.numeric%12 * 30+")";
      } else if (d.unit==="minutes") {
        return "rotate("+normalizeModulo(d.numeric, 60) * 6+")";
      } else {
        return "rotate("+secondDisplayValue(d.numeric) * 6+")";
      }
    });
  };

  if (config.date) {
    render(fields(config.date));
  } else {
    intervalId = setInterval(function() {
      return render(fields());
    }, 1000);
  }

  return {
    destroy: function() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      destroyed = true;
      if (vis) {
        vis.remove();
        vis = null;
      }
    }
  };
};
