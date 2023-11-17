// ORIGINAL QUERY: 
// SELECT Product.ProductID, Categories.CategoryName 
//  FROM Prodcut
//  JOIN Categories
//  ON Product.CategoryID == Categories.CategoryID

var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.products.getPlanCache().clear()
let results = db.products.find({},
    {
            "ProductID": 1,
            "CategoryName": "$categories.CategoryName"
    }
)
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
