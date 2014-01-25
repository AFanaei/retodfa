function drawVisual(links){
    var nodes = {};

// Compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
    });

    var width = 960,
        height = 500;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(80)
        .charge(-300)
        .on("tick", tick)
        .start();


    var svg = d3.select("#automata").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("defs").selectAll("marker")
        .data(["zero","one","epsilon"])
        .enter().append("marker")
        .attr("id", function(d) { return d; })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", "1.4em")
        .attr("refY", -3)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    var path = svg.append("g").selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", "link ")
        .attr("marker-end", function(d) {
            var str="epsilon";
            if(d.type==1){
                str="one";
            }else if(d.type==0){
                str="zero";
            }
            return "url(#" + str + ")";
        });

    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
        .enter().append("circle")
        .attr("r", "1em")
        .call(force.drag);

    var text = svg.append("g").selectAll("text")
        .data(force.nodes())
        .enter().append("text")
        .attr("x", "-.5em")
        .attr("y", ".35em")
        .text(function(d) { return d.name; });

    var linktext = svg.append("g").selectAll("text").data(force.links());
    linktext.enter()
        .append("text")
        .attr("y", ".35em")
        .attr("x", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.type; });

// Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
        path.attr("d", linkArc);
        circle.attr("transform", transform);
        text.attr("transform", transform);
        linktext.attr("transform", function(d) {
            return "translate(" + (d.source.x + d.target.x) / 2 + ","
                + (d.source.y + d.target.y) / 2 + ")"; });
    }

    function linkArc(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }
}