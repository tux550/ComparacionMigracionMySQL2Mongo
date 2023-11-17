// ORIGINAL QUERY: 
// SELECT SuppliersID, SupplierName, Phone FROM Suppliers WHERE SupplierName LIKE '%a'
var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.products.getPlanCache().clear()
let results = db.products.aggregate([
    {
        "$match" : {
            "suppliers.SupplierName": {"$regex": /.*a$/}
        }
        
    },
    {
        "$group": {
            _id: "$suppliers.SupplierID",
            "SupplierName": {"$first": "$suppliers.SupplierName"}
        }
    }
])
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
