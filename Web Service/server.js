var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Usuario = require('./models/Usuarios.js');
var Chat = require('./models/Mensajes.js');
var Agenda = require('./models/Agendas.js');

mongoose.connect('mongodb://localhost/chat', function(err, res){
	if(err)
		console.log('Error: no se pudo conectar con la Base de Datos');
	else
		console.log('Conexión con la Base de datos exitosa');
});

function permitirCORS(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Headers', "origin, X-Requested-With, content-type, accept");
	next();
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(permitirCORS);

var port = process.env.PORT || 5000;

var router = express.Router();

router.get('/', function(req, res){
	res.json({ message: 'Bienvenido a la API'});
});

router.route('/usuarios')
	.post(function(req, res){

		var user = new Usuario();
		user.nombre = req.body.nombre;
		user.foto = req.body.foto;
		user.email = req.body.email;
		user.contrasena = req.body.contrasena;
		user.pin = req.body.pin;
		user.estado = req.body.estado;

		user.save(function(err){
			if(err)
				res.send(err);
			console.log(user);
			//res.json({ message: 'Usuario Registrado'});
			res.json(user);
		});

	})
	.get(function(req, res){
		Usuario.find(function(err, Usuarios){
			if(err)
				res.send(err);
			res.json(Usuarios);
		});
	})
	.delete(function(req, res){
		Usuario.remove(function(err, users){
			if(err)
				res.send(err);
			res.json(users);
		});
	});
router.route('/usuarios/:correo')
	.get(function(req, res){
		Usuario.findOne({'email': req.params.correo}, function(err, user){
			if(err)
				res.send(err);
			res.json(user);
		});
	})
	.put(function(req, res){
		Usuario.findOne({'email': req.params.correo}, function(err, user){
			if(err)
				res.send(err);

			user.nombre = req.body.nombre;
			user.foto = req.body.foto;
			user.email = req.body.email;
			user.contrasena = req.body.contrasena;
			user.pin = req.body.pin;
			user.estado = req.body.estado;

			user.save(function(err){
				if(err)
					res.send(err);
				res.json(user);
			});
		});
	})
	.delete(function(req, res){
		Usuario.remove({'email': req.params.correo}, function(err, user){
			if(err)
				res.send(err);
			Usuario.find(function(err, users){
				if(err)
					res.send(err);
				res.json(users);
			});
		});
	});

router.route('/chats')
	.post(function(req, res){

		var chat = new Chat();

		chat.remitente = req.body.remitente;
		chat.destinatario = req.body.destinatario;
		chat.mensaje = req.body.mensaje;
		chat.tiempo = Date.now();

		chat.save(function(err, mensajes){
			if(err)
				res.send(err);
			res.json(mensajes);
		});
	})
	.get(function(req, res){
		Chat.find(function(err, msgs){
			if(err)
				res.send(err);
			res.json(msgs);
		});
	});
router.route('/chats/emisor/:remitente')
	.get(function(req, res){
		Chat.find({'remitente': req.params.remitente}, function(err, msgs){
			if(err)
				res.send(err);
			res.json(msgs);
		});
	});
router.route('/chats/receptor/:destinatario')
	.get(function(req, res){
		Chat.find({'destinatario': req.params.destinatario}, function(err, msgs){
			if(err)
				res.send(err);
			res.json(msgs);
		});
	});
router.route('/chats/:emisor/:receptor')
	.get(function(req, res){
		Chat.find({
			'remitente': req.params.emisor,
			'destinatario': req.params.receptor}, function(err, mensajes){
				if(err)
					res.send(err);
				res.json(mensajes);
			});
	});
router.route('/agenda')
	.post(function(req, res){
		var contacto = new Agenda();
		contacto.propietario = req.body.propietario;
		contacto.nombre = req.body.nombre;
		contacto.foto = req.body.foto;
		contacto.correo = req.body.correo;
		contacto.estado = req.body.estado;

		contacto.save(function(err, contactos){
			if(err)
				re.send(err);
			res.json(contactos);
		});
	})
	.get(function(req, res){
		Agenda.find(function(err, contactos){
			if(err)
				res.send(err);
			res.json(contactos);
		});
	})
	.delete(function(req, res){
		Agenda.remove(function(err, contacts){
			if(err)
				res.send(err);
			res.json(contacts);
		});
	});
router.route('/agenda/:usuario')
	.get(function(req, res){
		Agenda.find({'propietario': req.params.usuario}, function(err, contactos){
			if(err)
				res.send(err);
			res.json(contactos);
		});
	})
	.delete(function(req, res){
		Agenda.remove({'propietario': req.params.usuario}, function(err, contactos){
			if(err)
				res.send(err);
			res.json(contactos);
		});
	});
router.route('/agenda/:propietario/:contacto')
	.delete(function(req, res){
		Agenda.remove({'propietario': req.params.propietario, 'correo':req.params.contacto}, function(err, contacts){
			if(err)
				res.send(err);
			res.json(contacts);
		});
	});

app.use('/api', router);

app.listen(port);
console.log('Conexión establecida por el puerto '+port);