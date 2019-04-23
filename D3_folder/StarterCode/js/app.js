var svgWidth = 600;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom -10;



var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


/* var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`); */

// Step 3:
// Import data from the csv file
// =================================
d3.csv("data/data.csv", function(error, censusData) {
  if (error) throw error;


  var xScale = d3.scale.linear()
    .domain([
    	d3.min([0,d3.min(censusData,function (d) { return d.poverty })]),
    	d3.max([0,d3.max(censusData,function (d) { return d.poverty })])
    	])
    .range([0,width])
  var yScale = d3.scale.linear()
    .domain([
    	d3.min([0,d3.min(censusData,function (d) { return d.age })]),
    	d3.max([0,d3.max(censusData,function (d) { return d.age })])
    	])
    .range([height,0])

    var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .tickFormat(formatPercent)
	  .ticks(5)
    .orient('bottom')
    
    var yAxis = d3.svg.axis()
	  .scale(yScale)
	  .tickFormat(formatPercent)
	  .ticks(5)
    .orient('left')
    
    var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d.poverty) })
      .attr('cy',function (d) { return yScale(d.age) })
      .attr('r','10')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale(i) })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',20)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',10)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return d.id +
                           '\nReturn: ' + formatPercent(d.age) +
                           '\nStd. Dev.: ' + formatPercent(d.poverty) })
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y',-10)
      .attr('x',width)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Annualized Standard Deviation')
  // Y-axis
  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Annualized Return')
})