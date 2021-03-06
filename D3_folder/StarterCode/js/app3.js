var svgWidth = 600;
var svgHeight = 600;

var margin = {
  top: 30,
  right: 40,
  bottom: 160,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;



var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";

function xScale(cData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(cData, d => d[chosenXAxis]) * 0.8,
      d3.max(cData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  
  return xAxis;
}
  
  // function used for updating circles group with a transition to
  // new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  
  return circlesGroup;
}
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "age") {
    var label = "Age:";
  }
  else {
    var label = "Smokes:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


d3.csv("data/data.csv").then(function(cData) {
    

  cData.forEach(function(data) {
    data.age = +data.age;
    data.poverty = +data.poverty;
    data.smokes = +data.smokes;
  });
    
  // xLinearScale function above csv import
  var xLinearScale = xScale(cData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(cData, d => d.poverty)])
    .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
 
  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(cData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", 8)
    .attr("fill", "blue")
    .attr("opacity", ".5");







    
 // Create group for  2 x- axis labels
 var labelsGroup = chartGroup.append("g")
 .attr("transform", `translate(${width / 2}, ${height + 20})`);

var ageLabel = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 100)
 .attr("value", "age") // value to grab for event listener
 .classed("active", true)
 .text("Age");

var smokesLabel = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 40)
 .attr("value", "smokes") // value to grab for event listener
 .classed("inactive", true)
 .text("Smokes");

// append y axis
chartGroup.append("text")
 .attr("transform", "rotate(-90)")
 .attr("y", 0 - margin.left)
 .attr("x", 0 - (height / 2))
 .attr("dy", "1em")
 .classed("axis-text", true)
 .text("Poverty");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text")
 .on("click", function() {
   // get value of selection
   var value = d3.select(this).attr("value");
   if (value !== chosenXAxis) {

     // replaces chosenXAxis with value
     chosenXAxis = value;

     // console.log(chosenXAxis)

     // functions here found above csv import
     // updates x scale for new data
     xLinearScale = xScale(cData, chosenXAxis);

     // updates x axis with transition
     xAxis = renderAxes(xLinearScale, xAxis);

     // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

     // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

     // changes classes to change bold text
     if (chosenXAxis === "smokes") {
       smokesLabel
         .classed("active", true)
         .classed("inactive", false);
       ageLabel
         .classed("active", false)
         .classed("inactive", true);
     }
     else {
       smokesLabel
         .classed("active", false)
         .classed("inactive", true);
       ageLabel
         .classed("active", true)
         .classed("inactive", false);
     }
   }
 });  

});
