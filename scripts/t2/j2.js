// ORIGINAL QUERY: 
// SELECT OrderDetail.OrderID, Product.ProductName, OrderDetail.Quantity
//  FROM OrderDetail 
//  JOIN Product
//  ON OrderDetail.ProductID == Product.ProductID

var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.orders.getPlanCache().clear()
let results = db.orders.aggregate([
    {
        "$unwind": "$order_details"
    },
    {
        "$project": {
            "OrderID": "$OrderID",
            "OrderDetailID": "$order_details.OrderDetailID",
            "ProductID": "$order_details.ProductID",
            "Quantity": "$order_details.Quantity"
        }
    },
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
            "OrderID": 1,
            "ProductName": "$products_info.ProductName",
            "Quantity": 1
        }
    }
])
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
