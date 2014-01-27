function nfaToDfa(start,endVal){
    endVal=endVal+'';
    var nodes={};
    var visited={};
    var closureStart = getConnections([start]);
    var dfaStart= new Node(getLabel(closureStart),true,false);
    nodes[getLabel(closureStart)]=dfaStart;
    var links =[];
    (function nextNode(cNodes,start){
        if(start.value=='E' || visited[getLabel(cNodes)]){
            return;
        }
        visited[getLabel(cNodes)]=1;
        var newNodes = getConnectionsWithChar(cNodes,'0');
        var labels = getLabel(newNodes);
        if(!nodes[labels]){
            var isEnd=false;
            if(labels.indexOf(endVal)!=-1){
                isEnd=true;
            }
            var nod = new Node(labels,false,isEnd);
            nodes[labels]=nod;
        }
        start.addChild('0',nodes[labels]);
        links = insertInto(links,start.value,labels,'0');
        nextNode(newNodes,nodes[labels]);

        newNodes = getConnectionsWithChar(cNodes,'1');
        labels = getLabel(newNodes);
        if(!nodes[labels]){
            var isEnd=false;
            if(labels.indexOf(endVal)!=-1){
                isEnd=true;
            }
            var nod = new Node(labels,false,isEnd);
            nodes[labels]=nod;
        }
        start.addChild('1',nodes[labels]);
        links = insertInto(links,start.value,labels,'1');
        nextNode(newNodes,nodes[labels]);
    })(closureStart,dfaStart);
    return dfaStart;
}
function insertInto(links,start,end,type){
    for(key in links){
        if(links[key].source==start && links[key].target==end){
            links[key].type=links[key].type+','+type;
            return links;
        }
    }
    links.push({source: start, target: end, type: type});
    return links;
}
function getConnections(startNodes){
    var nodes=[];
    var visited=[];
    for(var key in startNodes){
        if(!startNodes.hasOwnProperty(key)){
            continue;
        }
        if(visited[startNodes[key].value]){
            continue;
        }
        nodes.push(startNodes[key]);
        (function mover(start){
            if(start==null){
                return;
            }
            if(visited[start.value]){
                return;
            }
            visited[start.value]=1;
            for( var key in start.childs){
                if(start.childs.hasOwnProperty(key) && key=='-1'){
                    for(var j=0;j<start.childs[key].length;j++){
                        if(!visited[start.childs[key][j].value]){
                            nodes.push(start.childs[key][j]);
                        }
                        mover(start.childs[key][j]);
                    }
                }
            }
        })(startNodes[key]);
    }
    return nodes;
}
function getConnectionsWithChar(nodes,char){
    var res=[];
    var vals={};
    for( var key in nodes){
        if(nodes.hasOwnProperty(key) && nodes[key].childs[char]){
            for(var j=0;j<nodes[key].childs[char].length;j++){
                if(!vals[nodes[key].childs[char][j].value]){
                    res.push(nodes[key].childs[char][j]);
                    vals[nodes[key].childs[char][j].value]=1;
                }
            }
        }
    }
    return getConnections(res);
}
function getLabel(nodes){
    var vals = [];
    if(nodes.length==0){
        return 'E';
    }
    for(var i=0;i<nodes.length;i++){
        vals.push(parseInt(nodes[i].value));
    }
    for(var i=0;i<vals.length;i++){
        for(var j=i+1;j<vals.length;j++){
            if(vals[j]<vals[i]){
                var tmp=vals[j];
                vals[j]=vals[i];
                vals[i]=tmp;
            }
        }
    }
    return vals.join(',');
}
function simplifyLinksAndNodesDfa(res){
    var j=1;
    var visited={E:'E'};
    for(var i=0;i<res.links.length;i++){
        res.links[i].source=visited[res.links[i].source] || (visited[res.links[i].source]='a'+(j++));
        res.links[i].target=visited[res.links[i].target] || (visited[res.links[i].target]='a'+(j++));
    }
    var nodes=[];
    for(var key in res.nodes){
        nodes[visited[key]]=res.nodes[key];
    }
    return {links:res.links,nodes:nodes};
}