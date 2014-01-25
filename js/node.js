function Node(isStart,isEnd){
    var childs = {};
    this.isStart = isStart;
    this.isEnd = isEnd;
    this.addChild = function(alpha, node){
        node.isStart = false;
        if(!childs[alpha]){
            childs[alpha]=[];
        }
        childs[alpha].push(node);
    }
    return this;
}