var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleTime()
    .rangeRound([0, width]);


var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });


var bisectDate = d3.bisector(function(d) { return d.date; }).left;

var click_line = d3.line()
    .x(function(d) { return d[0]; })
    .y(function(d) { return d[1]; });

var path;

var append_circle_coordinate = [0, 0];


function make_x_axis() {
    return d3.svg.axis().scale(x)
        .orient('bottom')
        .ticks(5);
}

d3.tsv("data.tsv", function(d) {
    d.date = parseTime(d.date);
    d.close = +d.close;
    return d;
}, function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.close; }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .append(make_x_axis())
        .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");

    console.log(data);

});


var click_coords = [];



svg.on('click', function() {
    click_coords.push(d3.mouse(this));
    console.log(click_coords);
});

function clearMouseCoordinates() {
    click_coords = [];
}



function drawIt() {
    console.log(click_coords);
    g.append("path")
        .attr("id", "line-path")
        .datum(click_coords)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 5)
        .attr("d", click_line);
}

function reload() {
    d3.select("#line-path").remove();
    clearMouseCoordinates();
}

function mousemove() {

}