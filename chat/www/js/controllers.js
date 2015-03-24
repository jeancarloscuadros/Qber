angular.module('starter.controllers', ['ionic', 'angular-storage'])
.value('USER',{
  nombre: "",
  correo: "",
  estado: ""
})
 
.controller('loginCtrl', function($scope, $ionicModal,$ionicPopup, $state, $http, UserService, store){
$scope.dataInicio = {};
$scope.dataUsuario = {};
$scope.nuevo = {};

$scope.login = function() {
  // configuration object
  var config = 'http://localhost:5000/api/usuarios/'+ $scope.dataInicio.username;
  
      var usuario = {};
  $http.get(config)
  .success(function(data) {
    if (data && data.email== $scope.dataInicio.username && data.contrasena==$scope.dataInicio.password) {
    
      // succefull login
      console.log('usuario: '+ $scope.dataInicio.username +' validado con contraseña: '+ $scope.dataInicio.password);

          store.set('correo',data.email);
          store.set('estado',data.estado);
          store.set('id',data.id); 
          store.set('nombre',data.nombre);
      $state.go('tab.chats');
    }
    else 
    {

        var alertPopup = $ionicPopup.alert({
        title: 'Error al Iniciar!',
        template: 'Porfavor Revisa tu usuario o contraseña!'
        });

    }

  })
  .error(function(data ){

  });
};
/*
    $scope.inicio = function(){
      console.log('constante: '+ usuarioCone);
      console.log('BIENVENIDO: '+$scope.dataInicio.username);
        $http.get('http://localhost:5000/api/usuarios/'+ $scope.dataInicio.username)
        .success(function(data){
          if(data && data.email== $scope.dataInicio.username && data.contrasena==$scope.dataInicio.password){
          console.log('usuario validado con la base de datos..');
          USER.correo=data.email;
          USER.estado=data.estado;
          USER.id=data.id; 
          USER.nombre=data.nombre;
          console.log('datos del objeto:');
          console.log(USER);
          $state.go('tab.chats');

                }
                else{
        var alertPopup = $ionicPopup.alert({
        title: 'Error al Iniciar!',
        template: 'Porfavor Revisa tu usuario o contraseña!'
        });
                }
  
        })
        .error(function(error){
          console.log(error);
        });

    };
    */

  $scope.agregarUsuario = function(){
    $scope.nuevo.nombre = $scope.dataUsuario.Nombre;
    $scope.nuevo.nombre = $scope.dataUsuario.nombre;
    $scope.nuevo.foto = $scope.dataUsuario.foto;
    $scope.nuevo.email = $scope.dataUsuario.email;
    $scope.nuevo.contrasena = $scope.dataUsuario.contra;
    $scope.nuevo.pin = $scope.dataUsuario.pin;
    $scope.nuevo.estado = "Comenzando a usar Qber";
 
  console.log($scope.nuevo);

    $http({
        method: 'POST',
        url: 'http://localhost:5000/api/usuarios',
        data: $scope.nuevo,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        })
      .success(function(data){
        console.log(data);
        $scope.dataUsuario = {};
        $scope.cerrarModal(1);
      })
      .error(function(err){
        console.log(err);
      });
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/registro.html', {
    id: '1',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal1 = modal;
  });

  $ionicModal.fromTemplateUrl('templates/recuperar.html', {
    id: '2',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal2 = modal;
  });



   $scope.cerrarModal = function(index) {
      if(index == 1) $scope.modal1.hide();
      else $scope.modal2.hide();

    };


  // Open the login modal
  $scope.abrirModal = function(index) {
     if(index == 1) $scope.modal1.show();
      else $scope.modal2.show();
  };

$scope.usuario = [];
$scope.nuevousuario = {};
$scope.nuevo2 = {};
/*--------------  HTTP conexion con el webService  --------------*/
 

    $scope.registrarU = function(){
     //$scope.nuevo2 = per;
     alert('le entro');

    $http.post('http://localhost:5000/api/usuarios', $scope.nuevousuario)
      .success(function(data){
      console.log(data);
      })
      .error(function(per){
        console.log('Error: ' + per);
      });


     // console.log($scope.nuevo2.nombre);
    };

    $scope.validarcorreo = function(){

        $http.get('http://localhost:5000/api/usuarios/' + $scope.nuevousuario.email)
              .success(function(data){

                if(data  == ""){
                  console.log('holisss');
                  //$scope.registrar($scope.nuevousuario);
                }else{
                console.log(data);
                }
              })
              .error(function(data){
                 console.log('Error: ' + data);
              });
    };

})

.controller('ContactsCtrl', function($scope, $http, $ionicModal, Agenda, historialChat, store) {

  $scope.contactos = [];
  $scope.nuevoContacto = {};
  $scope.nuevo = {};
  $scope.destinatario = {};
  $scope.mensajefinal = {};
/*--------------  HTTP conexion con el webService  --------------*/
    console.log('cargando contactos del service');


    $http.get('http://localhost:5000/api/agenda/'+store.get('correo'))

        .success(function(listaContactos){
          console.log(listaContactos);
          $scope.contactos = listaContactos;        
        })
        .error(function(error){
          console.log(error);
        });

    $scope.agregar = function(user){
      if(user !== null){
        console.log('si ta registrado');
        console.log(user);
        var contacto = {};
        contacto.nombre = user.nombre;
        contacto.correo = user.email;
        contacto.estado  = user.estado;
        contacto.imagen = user.foto;
        Agenda.agregar(contacto);
        $scope.nuevoContacto = {};
        $scope.cerrarModal(3);
        location.reload(true); 

      }
      else{
        console.log('no esta registrado');
        alert('No se encuentra ningun usuario con el correo');
      }
    };
    $scope.borrarC = function(user){
      Agenda.eliminarContacto(user);
      location.reload(true);
    };

    $scope.buscarCorreo = function(){
        $http.get('http://localhost:5000/api/usuarios/'+$scope.nuevoContacto.correo)
              .success(function(data){
                  $scope.agregar(data);
              })
              .error(function(data){
                 console.log('Error: ' + data);
              });
    };
   
  /*-------------------   Final conexion webService  --------------------*/
  $ionicModal.fromTemplateUrl('templates/agregaContacto.html', {
    id: '3',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
      $scope.modal3 = modal;
  });

   $ionicModal.fromTemplateUrl('templates/NuevoChat.html', {
    id: '4',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) { 
    $scope.modal4 = modal;
  });

  $scope.abrirModal = function(index){
      if(index == 3) $scope.modal3.show();
      else $scope.modal4.show();
    };

    $scope.abrirChat = function(destinatario){


      console.log(destinatario);
      $scope.modal4.show();
      $scope.destinatario.nombre = destinatario.nombre;
      $scope.destinatario.correo = destinatario.correo;
      $scope.destinatario.propietario = destinatario.propietario;
   
    };

  $scope.cerrarModal = function(index){
      if(index == 3) $scope.modal3.hide();
      else $scope.modal4.hide();
  };

  $scope.ejecutar = function(){
    console.log('ejecutando', $scope.contactos);
    $timeout(function(){
      $scope.modalNU.hide();
    },1000);
  };


  $scope.UnirMensaje = function(datos,texto){
    $scope.mensajefinal.remitente = datos.propietario;
    $scope.mensajefinal.destinatario = datos.correo;
    $scope.mensajefinal.mensaje = texto;
   
    $scope.TextoMsj = 'SE BORRA';

    historialChat.subirMensaje($scope.mensajefinal);
  };
})


.controller('ChatsCtrl', function($scope, historialChat, $http) {
  $http.get('http://localhost:5000/api/chats')
          .success(function(convers){
            $scope.chats = convers;
          })
          .error(function(err){
            console.log(err);
          });

  console.log('Cargo:');
  console.log($scope.chats);
})

.controller('ChatDetailCtrl', function($scope, $stateParams) {
  //$scope.correo = Chats.get($stateParams.destinatario);
//$scope.correo = Chats.listarMensajes($stateParams.);


})

.controller('perfilCtrl', function($scope, $http, store) {
           $scope.foto = 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg';
             $scope.status = store.get('estado');
             $scope.nombre = store.get('nombre');
             $scope.settings ={enableFriends: true};
                    
})

.controller('configuracionCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.settings = { enableFriends: true };
})
.controller('configuracionCtrl', function($scope, $state, store) {
  $scope.settings = { enableFriends: true };
    
      $scope.cerrarsesion = function(usuarioc){
      console.log('cerrando sesion..');
      store.remove('nombre');
      store.remove('correo');
      store.remove('estado');
      store.remove('id');
      location.reload(true);
      $state.go('inicio');
    };
});

