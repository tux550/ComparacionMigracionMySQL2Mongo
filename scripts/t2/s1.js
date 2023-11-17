// ORIGINAL QUERY: 
// SELECT CustomerID, CustomerName FROM Customers WHERE Country=’Germany’ AND (City=’Berlin’ OR City=’Muenster’)
var getExecutionTime = require('./getExecutionTime.js')

db = connect("mongodb://localhost:27017/"+db_name);
db.orders.getPlanCache().clear()
let results = db.orders.aggregate([
    {
        "$match" : {
            "$and" : [
                {"customers.Country": "Germany"},
                {
                    "$or": [
                        {"customers.City": "Galati"},
                        {"customers.City": "Muenster"}
                    ]
                }
            ]
        }
    },
    {
        "$group": {
            _id: "$customers.CustomerID",
            "CustomerName": {"$first": "$customers.CustomerName"}
        }
    }
])
/*let results = db.orders.find({
    "customers.Country": "Germany",
    $or: [
      {"customers.City": "Galati"},
      {"customers.City": "Muenster"}
    ]
  },{
    "customers.CustomerID": 1,
    "customers.CustomerName": 1
  })
*/
//printjson(results)
results = results.explain(verbosity="executionStats");
//printjson(results)

printjson( getExecutionTime(results) )
