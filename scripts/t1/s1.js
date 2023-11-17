// ORIGINAL QUERY: 
// SELECT CustomerID, CustomerName FROM Customers WHERE Country=’Germany’ AND (City=’Berlin’ OR City=’Muenster’)
var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.customers.getPlanCache().clear()
let results = db.customers.find({
    "Country": "Germany",
    $or: [
        {"City": "Galati"},
        {"City": "Muenster"}
    ]
},
{
    "CustomerID": 1,
    "CustomerName": 1
})
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
