/*
* @Author: Rikiponzu*
* @Date:   2017-12-13 15:54:49
* @Last Modified by:   Rikiponzu*
* @Last Modified time: 2017-12-13 16:00:18
*/
const express = require('express')
const http = require('http')
const app = express()
const fs = require('fs')
const https = require('https')
const URL = require('url')

const privateKey  = fs.readFileSync('/etc/letsencrypt/live/kirara.fun/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/kirara.fun/cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};


app.all('*', function(req,res,next){
    if(req.protocol === 'https') {
        next();
    }
    else {
      res.writeHead(301,{
          'Location':'https://kirara.fun' + URL.parse( req.url ).path
        });
      res.end();
    }

})

// 跨域设置
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Credentials", true)
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "X-Requested-With")
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
//   res.header("X-Powered-By", ' 3.2.1')
//   res.header("Content-Type", "application/json;charset=utf-8")
//   next()
// })

process.on('uncaughtException', function(err) {
    console.log(err.stack);
});


app.use(express.static('./'));


const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials,app);


const PORT = process.env.PORT || 80
const SSLPORT = process.env.PORT || 443

httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});


//app.listen(port, () => {
//  console.log(`server running @${port}`)
//})

module.exports = app
