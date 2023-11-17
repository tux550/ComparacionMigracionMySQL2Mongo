// ORIGINAL QUERY: 
// SELECT SuppliersID, SupplierName, Phone FROM Suppliers WHERE SupplierName LIKE '%a'

var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.suppliers.getPlanCache().clear()
let results = db.suppliers.find({
    "SupplierName": { $regex: /.*a$/ }
},
{
    "SuppliersID": 1,
    "SupplierName": 1
})
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
