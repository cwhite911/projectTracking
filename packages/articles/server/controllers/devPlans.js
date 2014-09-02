'use strict';

var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({target:'http://taskrunner/corpubw/'}); 
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader("Access-Control-Allow-Origin", "*");
  proxyReq.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
});

proxy.listen(8000);






// var http = require('http');

// var options = {
//   host: 'www.nodejitsu.com',
//   path: '/',
//   port: '1338',
//   //This is the only line that is new. `headers` is an object with the headers to request
//   headers: {'custom': 'Custom Header Demo works'}
// };

// function callback (response) {
//   var str = ''
//   response.on('data', function (chunk) {
//     str += chunk;
//   });

//   response.on('end', function () {
//   	console.log(req.data);
//     console.log(str);
//   });
// }

// var req = http.request(options, callback);
// req.end();

























// var host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';
// var port = process.env.PORT || 8080;

// var cors_proxy = require('cors-anywhere');
// cors_proxy.createServer({
//     requireHeader: ['origin', 'x-requested-with'],
//     removeHeaders: ['cookie', 'cookie2']
// }).listen(port, host, function() {
//     console.log('Running CORS Anywhere on ' + host + ':' + port);
// });



// var http = require('http');
// var proxy = http.createServer(function(req, res){
// 	res.writeHead(200, 
// 		{
// 			'Content-Type':'application/json',
// 			'head': 'taskrunner'
// 		}
// 	);
// });

// proxy.listen(1337, '127.0.0.1', function(){
// 	http.get("http://taskrunner/corpubw/GH-5-2011", function(res) {
//   		console.log("Got response: " + res.statusCode);
//   		console.log(res.ondata);
// 	}).on('error', function(e) {
//   		console.log("Got error: " + e.message);
// 	});
// });

// proxy.close();


// var proxy = require('express-http-proxy');

// var app = require('express')();

// app.use('/proxy', proxy('www.google.com', {
//   forwardPath: function(req, res) {
//     return require('url').parse(req.url).path;
//   },
//   intercept: function(data, req, res, callback) {
//        data = JSON.parse(data.toString('utf8'));
//        console.log(data);
//        callback(null, JSON.stringify(data.obj));
//   }
// }));

// var http = require('http');
// var net = require('net');
// var url = require('url');

// // Create an HTTP tunneling proxy
// var proxy = http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('okay');
// });
// proxy.on('connect', function(req, cltSocket, head) {
//   // connect to an origin server
//   var srvUrl = url.parse('http://' + req.url);
//   var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, function() {
//     cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
//                     'Proxy-agent: Node-Proxy\r\n' +
//                     '\r\n');
//     srvSocket.write(head);
//     srvSocket.pipe(cltSocket);
//     cltSocket.pipe(srvSocket);
//   });
// });

// // now that proxy is running
// proxy.listen(1337, '127.0.0.1', function() {

//   // make a request to a tunneling proxy
//   var options = {
//     port: 1337,
//     hostname: '127.0.0.1',
//     method: 'CONNECT',
//     path: '10.6.5.253:80/corpubw'
//   };

//   var req = http.request(options);
//   req.end();

//   req.on('connect', function(res, socket, head) {
//     console.log('got connected!');
//     console.log(res);
//     // make a request over an HTTP tunnel
//     socket.write('GET / HTTP/1.1\r\n' +
//                  'Host: 10.6.5.253:80\r\n' +
//                  'Connection: close\r\n' +
//                  '\r\n');
//     socket.on('data', function(chunk) {
//       console.log(chunk.toString());
//     });
//     socket.on('end', function() {
//       proxy.close();
//     });
//   });
// });