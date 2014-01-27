function drawVisual(links,node,str){
    var nodes = {};
    for(var key in node){
        var obj={};
        obj.name=key+'';
        if(node[key]==101){
            obj.isStartA=1;
        }
        if(node[key]==11){
            obj.isEndA=1;
        }
        nodes[key]=obj;
    }

//Compute the distinct nodes from the links.
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
        .charge(-600)
        .on("tick", tick)
        .start();


    var svg = d3.select("#"+str).append("svg")
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
        .attr("class",function(d){
            var str="";
            if(d.isStartA){
                str+="start "
            }
            if(d.isEndA){
                str+="end ";
            }
            return str;
        })
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
        .attr("class","link-text")
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
        var x1 = d.source.x,
            y1 = d.source.y,
            x2 = d.target.x,
            y2 = d.target.y,
            dx = x2 - x1,
            dy = y2 - y1,
            dr = Math.sqrt(dx * dx + dy * dy),

        // Defaults for normal edge.
            drx = dr,
            dry = dr,
            xRotation = 0, // degrees
            largeArc = 0, // 1 or 0
            sweep = 1; // 1 or 0

        // Self edge.
        if ( x1 === x2 && y1 === y2 ) {
            // Fiddle with this angle to get loop oriented.
            xRotation = -45;

            // Needs to be 1.
            largeArc = 1;

            // Change sweep to change orientation of loop.
            //sweep = 0;

            // Make drx and dry different to get an ellipse
            // instead of a circle.
            drx = 30;
            dry = 20;

            // For whatever reason the arc collapses to a point if the beginning
            // and ending points of the arc are the same, so kludge it.
            x2 = x2 + 1;
            y2 = y2 + 1;
        }

        return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
    }

    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }
}