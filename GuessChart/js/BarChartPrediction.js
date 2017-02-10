var svg = d3.select(".chart"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.5),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr('class', 'bar_group')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//Adding a toolTip
var toolTip = svg.append('g')
    .attr('class', 'toolTip')
    .style('display', 'none');

toolTip.append('rect')
    .attr('width', 30)
    .attr('height', 20)
    .attr('fill', 'white')
    .style('opacity', 0.5);

toolTip.append('text')
    .attr('x', 15)
    .attr('dy', '1.2em')
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold');


//Initial cursor pos 
var initial_pos = 0;

function dragstarted(d) {
    initial_pos = d3.event.y;
    console.log("Drag started");
    console.log(d3.mouse(this));
}

function dragged(d) {
    console.log("Dragging");

    if (d3.event.y >= 0 && d3.event.y <= height) {
        cursor_pos = d3.event.y;
    }

    d3.select(this)
        .attr('cy', cursor_pos);

    var cursor_height = height - cursor_pos;

    if (d3.select(this).attr('class') == 'dragrect male') {
        d3.select('.male')
            .attr('y', height - cursor_height)
            .attr('height', cursor_height);

        d3.select('.female')
            .attr('y', cursor_height)
            .attr('height', height - cursor_height);

        //Fixing the drag circle of female
        d3.select('.dragrect .female')
            .attr('cy', cursor_height);

        toolTip.attr('y', height - cursor_height)
            .attr('x', d3.event.x)
            .style('display', 'inline');

        toolTip.select('text')
            .text(y(cursor_height));


    } else if (d3.select(this).attr('class') == 'dragrect female') {
        d3.select('.female')
            .attr('y', height - cursor_height)
            .attr('height', cursor_height);

        d3.select('.male')
            .attr('y', cursor_height)
            .attr('height', height - cursor_height);

        //Fixing the drag circle of male
        d3.select('.dragrect .male')
            .attr('cy', cursor_height);
    }
}

function dragend(d) {
    console.log("Dragging DONE");
    console.log("Dragging done");
}



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
        .attr('r', 10)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragend)
        );

});