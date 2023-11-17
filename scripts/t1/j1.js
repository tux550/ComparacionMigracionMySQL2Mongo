// ORIGINAL QUERY: 
// SELECT Product.ProductID, Categories.CategoryName 
//  FROM Prodcut
//  JOIN Categories
//  ON Product.CategoryID == Categories.CategoryID

var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.products.getPlanCache().clear()
db.categories.getPlanCache().clear()
let results = db.products.aggregate([
    {
        "$lookup": {
            "from": "categories",
            "localField": "CategoryID",
            "foreignField": "CategoryID",
            "as": "categories_info"
        },
    },
    {
        "$unwind": "$categories_info"
    },
    {
        "$project": {
            "ProductID": 1,
            "CategoryName": "$categories_info.CategoryName"
        }
    }
])
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
