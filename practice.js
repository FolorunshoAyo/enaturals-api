var calPoints = function (ops){
    var results = null;
    var records = [];

    ops.forEach(operation => {
        if(/^[a-zA-Z]+$/.test(operation)){
            switch(operation){
                case "C":
                    records.pop();
                break;
                case "D":
                    console.log(records);
                    records = [...records, ...records.splice((records.length - 1), 1, records[records.length - 1] * 2)];
                break;
                default: 
                throw new Error();    
            }
        }else{
            if(operation === "+"){
                records.push(records[records.length - 1] + records[records.length - 2]);
            }else{
                records.push(Number(operation));
            }
        }
    })

    results = records.reduce((accumulator, record) => {
        accumulator = accumulator + record;
        return accumulator;
    }, 0);

    return results;
}

console.log(calPoints(["5", "2", "C", "D", "+"]));