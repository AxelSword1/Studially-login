//COMANDOS PARA INICIALIZAR TU SERVIDOR NODE.JS
//npm init
//npm install express body-parser firebase@8.10.0
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
require('firebase/firestore');

const app = express();
const port = 3000;

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBZbekqR_TDxJNVqVeyMRf6KktPXCygS6w",
    authDomain: "studially-login.firebaseapp.com",
    projectId: "studially-login",
    storageBucket: "studially-login.appspot.com",
    messagingSenderId: "512714335178",
    appId: "1:512714335178:web:c5ffd3c9b25282f8092533",
    measurementId: "G-P6K6YHMV8Z"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Ruta de archivos estaticos
app.use(express.static("public"));

// Endpoint para el inicio de sesión por correo y contraseña
app.post('/login', (req, res) => {
  const email = req.body.ingresoEmail;
  const password = req.body.ingresoPassword;

  // Autenticar con Firebase
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Éxito de la autenticación
      const user = userCredential.user;
      const uid = user.uid;
      const email = user.email;

      // Guardar registro en Cloud Firestore
      //const firestore = firebase.firestore();
      const usersCollection = firestore.collection('usuarios');

      usersCollection.doc(uid).set({
        email: email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        console.log('Registro de usuario guardado en Firestore');

        // Redireccionar a contactos.html después del login
        //res.redirect('/contactos.html');
        res.redirect(`/contactos.html?email=${email}&uid=${uid}`);
      })
      .catch(error => {
        console.error('Error al guardar el registro en Firestore:', error);
      });
    })
    .catch(error => {
      // Error de autenticación
      res.status(401).send('Error de autenticación: ' + error.message);
    });
});

// Endpoint para el logout
app.post('/logout', (req, res) => {
  firebase.auth().signOut().then(() => {
    // Éxito en el logout
    res.redirect('/'); // Redirige al usuario a index.html después de cerrar sesión
  }).catch((error) => {
    // Error en el logout
    res.status(500).send('Error al cerrar sesión: ' + error.message);
  });
});


/*
// Endpoint para el inicio de sesión con Microsoft
app.post('/login/microsoft', (req, res) => {
  const idToken = req.body.idToken;
  
  // Autenticar con Firebase utilizando el token de acceso de Microsoft
  const credential = firebase.auth.OAuthProvider.credential(null, idToken);
  firebase.auth().signInWithCredential(credential)
      .then(userCredential => {
          // Éxito de la autenticación
          const user = userCredential.user;
          res.status(200).json({ message: 'Inicio de sesión con Microsoft exitoso', user: user.toJSON() });
      })
      .catch(error => {
          // Error de autenticación
          console.error('Error al iniciar sesión con Microsoft:', error);
          res.status(401).json({ error: 'Error al iniciar sesión con Microsoft', details: error.message });
      });
});*/

// Endpoint para la creacion de autenticacion de un usuario en la seccion "registro"
app.post('/registro', (req, res) => {
    const email = req.body.registroEmail;
    const password = req.body.registroPassword;

    // Crear usuario en Firebase
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            // Éxito del registro
            console.log("Usuario creado exitosamente");

            // Redirigir al usuario a la página principal
            res.redirect('/');
        })
        .catch(error => {
            // Error en el registro
            res.status(400).send('Error en el registro: ' + error.message);
        });
  });


//----------------------------------------------------------------
// Endpoint para crear un nuevo contacto
app.post('/crear-contacto', (req, res) => {
  const uid = req.body.uid;
  const nombre = req.body.nombre;
  const telefono = req.body.telefono;

  // Guardar el contacto en la base de datos
  const contactosCollection = firestore.collection('usuarios').doc(uid).collection('contactos');
  const nuevoContactoRef = contactosCollection.doc(); // Genera un ID único para el nuevo contacto
  nuevoContactoRef.set({
      nombre: nombre,
      telefono: telefono
  })
  .then(() => {
      console.log('Contacto creado correctamente');
      res.status(200).send('Contacto creado correctamente');
  })
  .catch(error => {
      console.error('Error al crear el contacto:', error);
      res.status(500).send('Error al crear el contacto');
  });
});

// Endpoint para obtener todos los contactos de un usuario
app.get('/contactos/:uid', (req, res) => {
  const uid = req.params.uid;

  // Obtener todos los contactos del usuario
  const contactosCollection = firestore.collection('usuarios').doc(uid).collection('contactos');
  contactosCollection.get()
  .then(snapshot => {
      const contactos = [];
      snapshot.forEach(doc => {
          contactos.push(doc.data());
      });
      res.status(200).json(contactos);
  })
  .catch(error => {
      console.error('Error al obtener los contactos:', error);
      res.status(500).send('Error al obtener los contactos');
  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
