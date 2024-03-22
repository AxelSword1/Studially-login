// Importar Firebase SDK
import firebase from "firebase/app";
import "firebase/auth";

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

// Exportar firebase para que esté disponible en otros archivos
export default firebase;