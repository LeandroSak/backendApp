
const http = require("./app")
const minimist = require("minimist")
const cluster = require("cluster")
const numCPUs = require("os").cpus().length


const options = { alias: { p: "port" } }
const data = minimist(process.argv.slice(2), options)
//const PORT = data.port || 8080
const PORT = data.port || 8080

const logger = require("./src/logger/logger.js")

if (data.modo== "cluster") {
    if (Number.isInteger(data.i) && data.i > 1) {
        if (cluster.isMaster) {
            for (let i = 0; i < data.i; i++) {
                cluster.fork();
            }
            cluster.on("exit", () => {
                logger.log("info","process ", process.pid, " die")
            })
        } else {
            http.listen(PORT, () => logger.log("info",`Server cluster up and running on port ${PORT}, pid: ${process.pid}`))
        }
    } else {
        if (cluster.isMaster) {
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
            cluster.on("exit", () => {
                console.log("process ", process.pid, " die")
            })
        } else {
            http.listen(PORT, () => logger.log("info",`Server cluster up and running on port ${PORT}, pid: ${process.pid}`))
        }
    }
} else if (data.modo == "fork" || data.modo == undefined) {
    http.listen(PORT, () => logger.log("info",`Server fork up and running on port ${PORT}, pid: ${process.pid}`))
}


