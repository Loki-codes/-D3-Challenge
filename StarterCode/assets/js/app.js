// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 105,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "income";
var chosenYAxis = "age"
// function used for updating x-scale var upon click on axis label
function xScale(df, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(df, d => d[chosenXAxis]) * 0.8,
        d3.max(df, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}
function yScale(df, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(df, d => d[chosenYAxis]), d3.max(df, d => d[chosenYAxis])])
        .range([height, 0]);

    return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}
function renderYAxes(newYScale, yAxis) {
    var leftaxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftaxis);

    return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCirclesx(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}
function renderCirclesy(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}
function renderAbr(circleLabels, newXScale, chosenXAxis) {

    circleLabels.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));

    return circleLabels;
}
function renderAbry(circleLabels, newYScale, chosenYAxis) {

    circleLabels.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis]));

    return circleLabels;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        // .offset([80, -60])
        .html(function (d) {
            return (`<strong>${d.state}</strong> <br> ${chosenXAxis} ${d[chosenXAxis]}<br> ${chosenYAxis} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);


    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (df, err) {
    if (err) throw err;

    // parse data
    df.forEach(function (data) {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesityLow = +data.obesityLow;
        data.obesity = +data.obesity;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.obesityLow = +data.obesityLow;
        data.smokesHigh = +data.smokesHigh;
    });
    console.log(df[0].healthcare)
    // xLinearScale function above csv import
    var xLinearScale = xScale(df, chosenXAxis);

    // Create y scale function
    var yLinearScale = yScale(df, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftaxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftaxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(df)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("opacity", ".5");

    var circleLabels = chartGroup.selectAll(null).data(df).enter().append("text");

    circleLabels
        .attr("x", function (d) {
            return xLinearScale(d[chosenXAxis]);
        })
        .attr("y", function (d) {
            return yLinearScale(d[chosenYAxis]);
        })
        .text(function (d) {
            return d.abbr;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "black");

    // Create group for two x-axis labels
    var labelsGroupx = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var labelsGroupy = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2));

    var incomeLabel = labelsGroupx.append("text")
        .attr("id", "xlabel")
        .attr("x", -40)
        .attr("y", 20)
        .attr("value", "income") // value to grab for event listener
        .classed("active", true)
        .text("Yearly Income");

    var healthcareLabel = labelsGroupx.append("text")
        .attr("id", "xlabel")
        .attr("x", -40)
        .attr("y", 40)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("inactive", true)
        .text("Health Care Access");
    var obesityLabel = labelsGroupx.append("text")
        .attr("id", "xlabel")
        .attr("x", -40)
        .attr("y", 60)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Rate of Obesity");
    var smokesLabel = labelsGroupx.append("text")
        .attr("id", "xlabel")
        .attr("x", -40)
        .attr("y", 80)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Rate of Smoking");

    // append y axis
    var ageLabelY = labelsGroupy.append("text")
        .attr("id", "ylabel")
        // .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Average Age");

    var incomeLabelY = labelsGroupy.append("text")
        .attr("id", "ylabel")
        // .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 35)
        .attr("x", 0 - (height / 2) - 50)
        .attr("value", "income") // value to grab for event listener
        .classed("active", true)
        .text("Yearly Income");
    var healthcareLabely = labelsGroupy.append("text")
        .attr("id", "ylabel")
        // .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 55)
        .attr("x", 0 - (height / 2) - 55)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Health Care Access");
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroupx.selectAll("#xlabel")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(df, chosenXAxis);

                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesGroup = renderCirclesx(circlesGroup, xLinearScale, chosenXAxis);
                circleLabels = renderAbr(circleLabels, xLinearScale, chosenXAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenXAxis === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);

                } else if (chosenXAxis === "healthcare") {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "obesity") {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        }
        );
    labelsGroupy.selectAll("#ylabel")
        .on("click", function () {
            // get value of selection
            var valuey = d3.select(this).attr("value");
            if (valuey !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = valuey;

                // console.log(chosenXAxis)

                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(df, chosenYAxis);

                // updates x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesGroup = renderCirclesy(circlesGroup, yLinearScale, chosenYAxis);
                circleLabels = renderAbry(circleLabels, yLinearScale, chosenYAxis);

                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                // changes classes to change bold text
                if (chosenYAxis === "age") {
                    ageLabelY
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabelY
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabely
                        .classed("active", false)
                        .classed("inactive", true);

                    // changes classes to change bold text
                } else if (chosenYAxis === "income") {
                    ageLabelY
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabelY
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabely
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabely
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        }

        );

}).catch(function (error) {
    console.log(error);
});
