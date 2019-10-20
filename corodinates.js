function getPathVariableCode(line){
    var codeStr = '  var linePath = [\n';
    var pathArr = line.getPath();
    for (var i = 0; i < pathArr.length; i++){
        codeStr += '    {lat: ' + pathArr.getAt(i).lat() + ', lng: ' + pathArr.getAt(i).lng() + '}' ;
        if (i !== pathArr.length-1) {
            codeStr += ',\n';
        };
    
    };
    
    codeStr += '\n  ];';
    
    //the coordinates path it´s print on the console of the browser
    
    console.log (codeStr);
    console.log(pathArr.length);
    
    };