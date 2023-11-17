// ORIGINAL QUERY: 
// SELECT Product.ProductID, Categories.CategoryName, Suppliers.Country
// FROM Order
// JOIN Categories ON Product.CategoryID == Categories.CategoryID
// JOIN Suppliers ON Product.SupplierID == Suppliers.SupplierID
// WHERE Product.Price < 2000


var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.products.getPlanCache().clear()
let results = db.products.find(
    {
        "Price": {$lt: 2000}
    },
    {
        "ProductID": 1,
        "CategoryName": "$categories.CategoryName",
        "Country": "$suppliers.Country"
    }
)
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
