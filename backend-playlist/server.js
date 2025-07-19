// backend-playlist/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const playlistRouter = require('./rotas/playlist');

const app = express();
// Usaremos uma porta diferente para evitar conflito com o outro projeto
const PORT = process.env.PORT || 3001; 

// Middlewares essenciais
app.use(cors());
app.use(express.json()); // Para o backend entender corpos de requisição em JSON

// Montando as rotas da playlist sob o prefixo /api/playlist
app.use('/api/playlist', playlistRouter);

app.listen(PORT, () => {
    console.log(`--- Servidor da Playlist Dinâmica rodando na porta ${PORT} ---`);
});