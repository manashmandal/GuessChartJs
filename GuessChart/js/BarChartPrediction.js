var svg = d3.select(".chart"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.5),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr('class', 'bar_group')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", function(d) {
    console.log(d);
    d.percentage = +d.percentage;
    return d;
}, function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) { return d.gender; }));
    y.domain([0, 1]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10, "%"))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");


    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", function(d) {
            return "bar " + d.gender;
        })
        .attr("x", function(d) { return x(d.gender); })
        .attr("y", function(d) { return y(d.percentage); })
        .attr("width", x.bandwidth())
        .on('click', function(d, i) {
            console.log("rectangle was clicked")
        })
        .attr("height", function(d) { return height - y(d.percentage); });


    g.append('g')
        .attr('class', 'dragrect');

    //Dragging rectangles
    g.select('.dragrect')
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', function(d) {
            return "dragrect " + d.gender;
        })
        .attr('cx', function(d) { return x.bandwidth() / 2 + x(d.gender); })
        .attr('cy', function(d) { return height - y(d.percentage); })
        .on('click', function(d, i) {
            console.log("Circle was clicked")
        })
        .attr('r', 10);


});





// d3.select('g').on('click', function() {
//     console.log(d3.mouse(this));
// });