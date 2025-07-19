const express = require('express');
const router = express.Router();
const SinglyLinkedList = require('../data-strtuctures/SinglyLinkedList');

const playlist = new SinglyLinkedList();

/**
 * @route   POST /api/playlist
 * @desc    Adiciona uma nova música ao FINAL da playlist
 * @access  Public
 */

router.post('/', (req, res) => {

    try {

        const { nome, artista } = req.body;

        if (!nome || !artista) {
            return res.status(400).json({ mensagem: 'Os Campos "nome" e "artista" são obrigatórios.' })
        }

        const novaMusica = {
            nome,
            artista
        };

        playlist.append(novaMusica);

        console.log('Música adicionada:', novaMusica);
        console.log('Tamanho atual da playlist:', playlist.tamanho);

        res.status(201).json({ mensagem: 'Música adicionada com sucesso!', tamanhoAtual: playlist.tamanho });

    } catch (error) {
        console.error('Erro ao adicionar música:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

});

/**
 * @route   GET /api/playlist
 * @desc    Retorna todas as músicas da playlist
 * @access  Public
 */

router.get('/', (req, res) => {
    try {
        const playlistComoArray = playlist.toArray();

        res.status(200).json({
            playlist: playlistComoArray,
            total_de_musicas: playlist.tamanho
        });

        console.log('Playlist solicitada. Total de músicas:', playlist.tamanho);

    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
        console.error('Erro ao obter a playlist')
    };
});


router.post('/insert/:index', (req, res) => {

    try {

        const index = parseInt(req.params.index);
        const { nome, artista } = req.body;

        if (!nome || !artista) {
            return res.status(400).json({ mensagem: 'Os campos "nome" e "artista" são obrigatórios.' });
        }

        const novaMusica = {
            nome,
            artista
        };

        const inseridoComSucesso = playlist.insertAt(index, novaMusica);

        if (inseridoComSucesso) {

            console.log(`Música "${nome}" inserida na posição ${index}.`);
            res.status(200).json({
                message: `Música inserida com sucesso na posição ${index}.`,
                playlist: playlist.toArray()
            });

        }

    } catch (error) {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
        console.error('Erro ao inserir música na playlist');
    }

});

/**
 * @route   DELETE /api/playlist/:index
 * @desc    Remove uma música de uma posição específica da playlist
 * @access  Public
 */

router.delete('/:index', (req, res) => {

    try {
        const index = parseInt(req.params.index);
        const dadoRemovido = playlist.removeAt(index);

        if (dadoRemovido !== null) {
            console.log(`Música "${dadoRemovido.nome}" removida da posição ${index}.`);
            res.status(200).json({
                message: `Música removida com sucesso da posição ${index}.`,
                playlist: playlist.toArray(),
                musicaRemovida: dadoRemovido,
                tamanhoAtual: playlist.tamanho
            });

        } else {
            res.status(400).json({ message: 'Índice inválido. Nenhuma música foi removida.' });
        }

    } catch (error) {
        console.error('Erro ao remover música da playlist:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
});

module.exports = router;