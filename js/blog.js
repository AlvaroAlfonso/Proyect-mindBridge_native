// Archivo: auth.js
// Este archivo maneja la autenticación y la lógica de publicación del blog.

// Importar los módulos de Firebase que vamos a necesitar
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    collection,
    addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Tu configuración de Firebase - Asegúrate de que esta es la correcta.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
    apiKey: "AIzaSyAKYdKA9MJt61W2KqKsSbKW-Ksl5C3ip54",
    authDomain: "api-blog-mindbridge.firebaseapp.com",
    projectId: "api-blog-mindbridge",
    storageBucket: "api-blog-mindbridge.firebasestorage.app",
    messagingSenderId: "677174771204",
    appId: "1:677174771204:web:6f053ffc4e321b1bd8bf51",
    measurementId: "G-PLKP5LLJBM"
};

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inicializa la aplicación de Firebase y los servicios necesarios
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Lógica de autenticación del usuario
async function authenticateUser() {
    try {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
        console.log("Usuario autenticado. Listo para escribir en la base de datos.");
    } catch (e) {
        console.error("Error al autenticar usuario:", e);
        // Aquí podrías mostrar un mensaje al usuario si la autenticación falla
    }
}

// Esperar a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // Referencias a elementos del DOM para el formulario de autenticación
    const authForm = document.getElementById('auth-form');
    const formTitle = document.getElementById('form-title');
    const registerFields = document.getElementById('register-fields');
    const passwordRepeatField = document.getElementById('password-repeat-field');
    const termsCheckboxContainer = document.getElementById('terms-checkbox-container');
    const authButton = document.getElementById('auth-button');
    const formToggleLink = document.getElementById('form-toggle-link');
    const visitorCheckboxContainer = document.getElementById('visitor-checkbox-container');
    const userTypeSelect = document.getElementById('user-type');
    const messageContainerAuth = document.getElementById('message-container');

    // Referencias a elementos del DOM para el formulario de publicación
    const form = document.getElementById('new-post-form');
    const messageContainerPost = document.getElementById('message-container-post'); // Nuevo ID para evitar conflictos
    const loadingSpinner = document.getElementById('loading-spinner');

    // Función para mostrar mensajes al usuario en el formulario de autenticación
    const showMessageAuth = (message, isError = false) => {
        messageContainerAuth.innerHTML = `<p class="p-3 rounded-lg text-sm font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">${message}</p>`;
    };
    
    // Función para mostrar mensajes en el formulario de publicación
    function showMessagePost(message, type) {
        messageContainerPost.textContent = message;
        messageContainerPost.className = `mensaje-container ${type}`;
        messageContainerPost.style.display = 'block';
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none'; // Ocultar spinner después de mostrar mensaje
        }
    }

    let isRegistering = true; 

    // Lógica de autenticación:
    if (authForm) {
        formToggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isRegistering = !isRegistering;
            if (isRegistering) {
                formTitle.textContent = 'Registro';
                authButton.textContent = 'Registrarse';
                registerFields.style.display = 'block';
                passwordRepeatField.style.display = 'block';
                termsCheckboxContainer.style.display = 'block';
                formToggleLink.innerHTML = '¿Ya tienes una cuenta? <span class="color-principal cursor-pointer font-bold">Iniciar Sesión</span>';
                visitorCheckboxContainer.style.display = userTypeSelect.value === 'visitante' ? 'block' : 'none';
            } else {
                formTitle.textContent = 'Iniciar Sesión';
                authButton.textContent = 'Ingresar';
                registerFields.style.display = 'none';
                passwordRepeatField.style.display = 'none';
                termsCheckboxContainer.style.display = 'none';
                formToggleLink.innerHTML = '¿Aún no tienes una cuenta? <span class="color-principal cursor-pointer font-bold">Regístrate</span>';
                visitorCheckboxContainer.style.display = 'none';
            }
            messageContainerAuth.innerHTML = '';
        });

        
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageContainerAuth.innerHTML = '';

            const email = authForm.email.value;
            const password = authForm.password.value;
            const passwordRepeat = authForm['password-repeat'] ? authForm['password-repeat'].value : null;

            if (isRegistering) {
                if (password !== passwordRepeat) {
                    showMessageAuth('Las contraseñas no coinciden.', true);
                    return;
                }

                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    const userProfile = {
                        uid: user.uid,
                        fullName: authForm['full-name'].value,
                        phoneNumber: authForm['phone-number'].value,
                        userType: authForm['user-type'].value,
                        age: authForm.age.value,
                        gender: authForm.gender.value,
                        occupation: authForm.occupation.value,
                        motivation: authForm.motivation.value,
                        email: user.email,
                        createdAt: new Date()
                    };

                    await setDoc(doc(db, "users", user.uid), userProfile);
                    showMessageAuth('¡Registro exitoso! Ya puedes iniciar sesión.');
                } catch (error) {
                    console.error("Error durante el registro:", error);
                    if (error.code === 'auth/email-already-in-use') {
                        showMessageAuth('El correo electrónico ya está en uso. Intenta iniciar sesión.', true);
                    } else if (error.code === 'auth/weak-password') {
                        showMessageAuth('La contraseña es demasiado débil. Debe tener al menos 6 caracteres.', true);
                    } else {
                        showMessageAuth(`Error al registrarse: ${error.message}`, true);
                    }
                }

            } else {
                try {
                    await signInWithEmailAndPassword(auth, email, password);
                    showMessageAuth('¡Inicio de sesión exitoso! Serás redirigido...');
                    window.location.href = '/dashboard.html'; 
                } catch (error) {
                    console.error("Error durante el login:", error);
                    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                        showMessageAuth('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.', true);
                    } else {
                        showMessageAuth(`Error al iniciar sesión: ${error.message}`, true);
                    }
                }
            }
        });
    }

    // Lógica de publicación:
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageContainerPost.style.display = 'none';
            loadingSpinner.style.display = 'block';

            const title = form.elements['post-title'].value;
            const author = form.elements['post-author'].value;
            const imageUrl = form.elements['post-image-url'].value;
            const excerpt = form.elements['post-excerpt'].value;
            const content = form.elements['post-content'].value;
            const category = form.elements['post-category'].value;

            const newArticle = {
                title,
                author,
                imageUrl,
                excerpt,
                content,
                category,
                createdAt: new Date(),
                userId: auth.currentUser ? auth.currentUser.uid : null // Guardamos el UID del usuario
            };

            try {
                // Aquí vamos a usar Firestore en lugar de la llamada a la API local
                const docRef = await addDoc(collection(db, "posts"), newArticle);
                showMessagePost('Artículo publicado exitosamente.', 'success');
                form.reset();
            } catch (e) {
                console.error("Error al publicar artículo:", e);
                showMessagePost('Hubo un error al publicar el artículo.', 'error');
            }
        });
    }

    // Observador para verificar el estado de autenticación (mantener la sesión)
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Usuario autenticado:", user.uid);
            // Podrías redirigir al usuario aquí si lo necesitas
        } else {
            console.log("No hay usuario autenticado.");
        }
    });

    // Autenticar al usuario al cargar la página
    authenticateUser();
});
