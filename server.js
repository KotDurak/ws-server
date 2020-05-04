var WebSockerSever = new require('ws');

var clients = []; 
const port = process.argv[2] || 8081;

var webSocketServer = new WebSockerSever.Server({
	port: port
});

webSocketServer.on('connection', function(ws) {
	var id = Math.random();
	clients[id] =  {
		ws:ws
	};
	var data = JSON.stringify({
		message: 'connect', 
		id:  id 	
	});
	clients[id].ws.send(data);
	
	console.log('Новое соединение ' + id);


	ws.on('message', function(message){
		let obj = JSON.parse(message);
		switch (obj.message) {
			case 'connect': 
				clients[id]['idUser'] = obj['idUser'];
				break; 
			case 'message': 
				 for (var i in clients) {
				 	var idUser = parseInt(clients[i].idUser);
			 	    if (obj.users.indexOf(idUser) !== -1) {
			 	    	var message = {
			 	    		message:'message', 
			 	    		data:obj.data
			 	    	};
			 	    	clients[i].ws.send(JSON.stringify(message));
			 	    }
				 }
				 console.log(obj);
				 break;
			default: 
				console.log(message);
				return;
		}

	
	});


	ws.on('close', function() {
		console.log('Connection closed for user: ' + clients[id]['idUser']);
		delete clients[id];
	});

});

