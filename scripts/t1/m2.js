// ORIGINAL QUERY: 
// SELECT Product.ProductID, Categories.CategoryName, Suppliers.Country
// FROM Order
// JOIN Categories ON Product.CategoryID == Categories.CategoryID
// JOIN Suppliers ON Product.SupplierID == Suppliers.SupplierID
// WHERE Product.Price < 2000


var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.products.getPlanCache().clear()
db.categories.getPlanCache().clear()
db.suppliers.getPlanCache().clear()
let results = db.products.aggregate([
    {
        "$match": {
            "Price": {$lt: 2000}
        }
    },
    {
        "$lookup": {
            "from": "categories",
            "localField": "CategoryID",
            "foreignField": "CategoryID",
            "as": "categories_info"
        },
    },
    {
        "$lookup": {
            "from": "suppliers",
            "localField": "SupplierID",
            "foreignField": "SupplierID",
            "as": "suppliers_info"
        },
    },
    {
        "$unwind": "$categories_info"
    },
    {
        "$unwind": "$suppliers_info"
    },

    {
        "$project": {
            "ProductID": 1,
            "CategoryName": "$categories_info.CategoryName",
            "SupplierCountry": "$suppliers_info.Country"
        }
    }
])
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
