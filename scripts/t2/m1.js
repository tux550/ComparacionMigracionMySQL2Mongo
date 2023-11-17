// ORIGINAL QUERY: 
// SELECT Order.OrderID, Customer.Address, Shippers.ShipperName 
// FROM Order
// JOIN Customer ON Order.CustomerID == Customer.CustomerID
// JOIN Shippers ON Order.ShipperID == Shippers.ShipperID
// WHERE Customer.Country == 'Germany'

var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.orders.getPlanCache().clear()
let results = db.orders.find(
    {
        "customers.Country": "Germany" 
    },
    {
        "OrderID": 1,
        "Address": "$customers.Address",
        "ShipperName": "$shippers.ShipperName"
    }
)
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
