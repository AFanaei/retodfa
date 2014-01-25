function Node(isStart,isEnd){
    this.childs = {};
    this.isStart = isStart;
    this.isEnd = isEnd;
    this.addChild = function(alpha, node){
        node.isStart = false;
        if(!this.childs[alpha]){
            this.childs[alpha]=[];
        }
        this.childs[alpha].push(node);
    }
    return this;
}