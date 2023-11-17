const  getExecutionTime = (results) => {
    //console.log("getExecutionTime");
    var total_time = 0;
    if ("executionStats" in results) {
        total_time = results["executionStats"]["executionTimeMillis"]
        return total_time
    }
    else {
        for (var i = 0; i < results["stages"].length; i++) {
            let obj = results["stages"][i]["executionTimeMillisEstimate"]
            total_time = obj.add(total_time)
        }
        return total_time.toInt()
    }
}

module.exports = getExecutionTime;