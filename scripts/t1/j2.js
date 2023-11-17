// ORIGINAL QUERY: 
// SELECT OrderDetail.OrderID, Product.ProductName, OrderDetail.Quantity
//  FROM OrderDetail 
//  JOIN Product
//  ON OrderDetail.ProductID == Product.ProductID

var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.order_details.getPlanCache().clear()
db.products.getPlanCache().clear()
let results = db.order_details.aggregate([
    {
        "$lookup": {
            "from": "products",
            "localField": "ProductID",
            "foreignField": "ProductID",
            "as": "products_info"
        },
    },
    {
        "$unwind": "$products_info"
    },
    {
        "$project": {
            "OrderID": "$OrderID",
            "Quantity": "$Quantity",
            "ProductName": "$products_info.ProductName"
        }
    }
])
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
