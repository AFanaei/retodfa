/*
* * needs special work
* | needs special work
* ( needs special work
 */
function parse(str,start,end){
    if(str==''){
        return {start: start, end: end};
    }else if(str[0]=='0' || str[0]=='1'){
        var temp = getSimpleNode(str[0]);
        if(end){
            end.isEnd=0;
            end.addChild('-1',temp.start);
        }else{
            start=temp.start;
        }
        str.splice(0,1);
        return parse(str,start,temp.end);
    }else if(str[0]=='*'){
        var pre = new Node(true,false);
        var post = new Node(false,true);
        pre.addChild('-1',post);
        post.addChild('-1',pre);
        pre.addChild('-1',start);
        end.isEnd=false;
        end.addChild('-1',post);
        str.splice(0,1);
        return parse(str,pre,post);
    }else if(str[0]=='|'){
        str.splice(0,1);
        var next = parse(str,null,null);
        var pre = new Node(true,false);
        var post = new Node(false,true);
        pre.addChild('-1',start);
        pre.addChild('-1',next.start);
        end.isEnd=false;
        next.end.isEnd=false;
        end.addChild('-1', post);
        next.end.addChild('-1',post);
    }else if(str[0]=='('){
        var i=1;
        var j=0;
        while(j>=0){
            if(str[i]==')'){
                j--;
            }else if(str[i]=='('){
                j++;
            }
            i++;
        }
        var strstr = str.splice(1,i-2);
        var res = parse(strstr,null,null);
        if(end){
            end.isEnd=false;
            end.addChild('-1',res.start);
        }else{
            start=res.start;
        }
        return parse(str,start,res.end);
    }
}
function getSimpleNode(char){
    var start=new Node(true,false);
    var end = new Node(false,true);
    start.addChild(char,end);
    var temp={start: start, end: end};
    return temp;
}
