var svgWidth = 960;
var svgHeight = 600;

var margin = {
    top: 20, 
    right: 40, 
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper, append SVG group
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data/Parse Data, cast as numbers
d3.csv("data_final.csv", function(healthData) {
    healthData.forEach(function(data) { 
        data.uninsured = +data.uninsured;
        data.costrestrictedCare = +data.costrestrictedCare;
    });

// Create scale functions

var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.uninsured)])
    .range([0, width]);

var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.costrestrictedCare)])
    .range([height, 0]);

// Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append axis to chart
chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);

// Create circles
var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.uninsured))
    .attr("cy", d => yLinearScale(d.costrestrictedCare))
    .attr("r", "12")
    .attr("fill", "gray")
    .attr("opacity", ".3")

// Append text to circles
chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .selectAll("tspan")
        .data(healthData)
        .enter()
        .append("tspan")
            .attr("x", function(d) {
                return xLinearScale(d.uninsured - 0);
            })
            .attr("y", function(d) {
                return yLinearScale(d.costrestrictedCare - 0.2);
            })
            .text(function(d) {
                return d.location
            });
        

// Label axes
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Medical Care Restricted by Cost %");

chartGroup.append("text")
    .attr("transform", `translate(${width /2}, ${height + margin.top +30})`)
    .attr("class", "axisText")
    .text("Uninsured %");
    
// add tooltip
    
var toolTip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

circlesGroup.on("mouseover", function (d) {
    toolTip.style("display", "block")
    toolTip.html(`${d.location}<br>Percent Uninsured: ${d.uninsured}<br>Care Limited by Cost: ${d.costrestrictedCare}`)
        .style("left", d3.select(this).attr("cx" + "px"))
        .style("top", d3.select(this).attr("cy" + "px"))
    .on("mouseout", function(){
        toolTip.style("display", "none")
    })
})


    });

