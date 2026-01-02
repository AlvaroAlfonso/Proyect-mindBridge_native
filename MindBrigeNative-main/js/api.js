// api.js

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Reemplaza con el nombre de tu archivo JSON
const serviceAccount = require('./api-blog-mindbridge-firebase-adminsdk-fbsvc-7c589f58e6.json');

// Inicializa Firebase Admin SDK (esto solo se hace en el servidor)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const port = 3000;

// Middleware para habilitar CORS y procesar JSON
app.use(cors());
app.use(express.json());

// Endpoint para publicar un nuevo artículo (ruta POST)
app.post('/api/posts', async (req, res) => {
  try {
    const newArticle = req.body;
    const docRef = await db.collection('posts').add(newArticle);
    res.status(201).send({
      message: 'Artículo publicado con éxito',
      id: docRef.id
    });
  } catch (e) {
    console.error("Error al añadir documento: ", e);
    res.status(500).send({
      message: 'Hubo un error al publicar el artículo.',
      error: e.message
    });
  }
});

// Endpoint para obtener todos los artículos (nueva ruta GET)
app.get('/api/posts', async (req, res) => {
    try {
        const postsRef = db.collection('posts');
        const snapshot = await postsRef.get();
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).send(posts);
    } catch (e) {
        console.error("Error al obtener documentos: ", e);
        res.status(500).send({
            message: 'Hubo un error al obtener los artículos.',
            error: e.message
        });
    }
});

// NUEVA RUTA: Endpoint para obtener un solo artículo por su ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id; // Obtenemos el ID de la URL
    const postRef = db.collection('posts').doc(postId);
    const doc = await postRef.get();

    if (!doc.exists) {
      // Si el documento no existe, enviamos un error 404
      res.status(404).send({ message: 'Artículo no encontrado.' });
    } else {
      // Si existe, enviamos los datos del artículo y su ID
      res.status(200).send({ id: doc.id, ...doc.data() });
    }
  } catch (e) {
    console.error("Error al obtener el artículo: ", e);
    res.status(500).send({
      message: 'Hubo un error al obtener el artículo.',
      error: e.message
    });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`API del blog escuchando en http://localhost:${port}`);
});