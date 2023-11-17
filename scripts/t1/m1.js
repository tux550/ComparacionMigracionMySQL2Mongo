// ORIGINAL QUERY: 
// SELECT Order.OrderID, Customer.Address, Shippers.ShipperName 
// FROM Order
// JOIN Customer ON Order.CustomerID == Customer.CustomerID
// JOIN Shippers ON Order.ShipperID == Shippers.ShipperID
// WHERE Customer.Country == 'Germany'


var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.orders.getPlanCache().clear()
db.customers.getPlanCache().clear()
db.shippers.getPlanCache().clear()
let results = db.orders.aggregate([
    {
        "$lookup": {
            "from": "customers",
            "localField": "CustomerID",
            "foreignField": "CustomerID",
            "as": "customers_info"
        },
    },
    {
        "$unwind": "$customers_info"
    },
    {
        "$match": {
            "customers_info.Country": "Germany"
        }
    },
    {
        "$lookup": {
            "from": "shippers",
            "localField": "ShipperID",
            "foreignField": "ShipperID",
            "as": "shippers_info"
        },
    },
    {
        "$unwind": "$shippers_info"
    },
    {
        "$project": {
            "OrderID": 1,
            "Address": "$customers_info.Address",
            "ShipperName": "$shippers_info.ShipperName"
        }
    }
])
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
