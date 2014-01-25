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
        var newStr = str.split('');
        newStr.splice(0,1);
        str = newStr.join('');
        return parse(str,start,temp.end);
    }else if(str[0]=='*'){
        var pre = new Node(true,false);
        var post = new Node(false,true);
        pre.addChild('-1',post);
        post.addChild('-1',pre);
        pre.addChild('-1',start);
        end.isEnd=false;
        end.addChild('-1',post);
        var newStr = str.split('');
        newStr.splice(0,1);
        str = newStr.join('');
        return parse(str,pre,post);
    }else if(str[0]=='|'){
        var newStr = str.split('');
        newStr.splice(0,1);
        str = newStr.join('');
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
        var newStr = str.split('');
        var strstr = newStr.splice(1,i-2);
        str = newStr.join('');
        strstr = strstr.join('');
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
