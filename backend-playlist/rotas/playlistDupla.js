const express = require('express');
const router = express.Router();

const DoublyLinkedList = require('../data-strtuctures/DoublyLinkedList');

const playlistDupla = new DoublyLinkedList();


/**
 * @route   POST /api/playlistDupla
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

        playlistDupla.append(novaMusica);

        console.log('Música adicionada:', novaMusica);
        console.log('Tamanho atual da playlist:', playlistDupla.tamanho);

        res.status(201).json({ mensagem: 'Música adicionada com sucesso!', tamanhoAtual: playlistDupla.tamanho });

    } catch (error) {
        console.error('Erro ao adicionar música:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

})

/**
 * @route   GET /api/playlistDupla
 * @desc    Retorna todas as músicas da playlist
 * @access  Public
 */
router.get('/', (req, res) => {

    try {

        const playlistComoArray = playlistDupla.toArray();

        res.status(200).json({
            playlist: playlistComoArray,
            total_de_musicas: playlistDupla.tamanho
        });

        console.log('Playlist solicitada. Total de músicas:', playlistDupla.tamanho);


    } catch (error) {

        res.status(500).json({ mensagem: 'Erro interno do servidor' });
        console.error('Erro ao obter a playlist');

    }

});


/**
 * @route   DELETE /api/playlistDupla/:index
 * @desc    Remove uma música de uma posição específica da playlist
 * @access  Public
 */ 
router.delete('/:index', (req, res) => {

    try {

        const index = parseInt(req.params.index);
        const dadoRemovido = playlistDupla.removeAt(index);
        
        if (dadoRemovido !== null) {

            console.log(`Música "${dadoRemovido.nome}" removida da posição ${index}.`);

            res.status(200).json({
                message: `Música removida com sucesso da posição ${index}.`,
                playlist: playlistDupla.toArray(),
                musicaRemovida: dadoRemovido,
                tamanhoAtual: playlistDupla.tamanho
            });
            
        } else {

            res.status(400).json({ message: 'Índice inválido. Nenhuma música foi removida.' });
        
        }
        
    } catch (error) {
        
        console.error('Erro ao remover música da playlist');
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    
    }

});

/**
 * @route   POST /api/playlistDupla/insert/:index
 * @desc    Insere uma nova música em uma posição específica da playlist
 * @access  Public
 */ 

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

        const inseridoComSucesso = playlistDupla.insertAt(index, novaMusica);

        if (inseridoComSucesso) {

            console.log(`Música "${nome}" inserida na posição ${index}.`);
            res.status(200).json({
                message: `Música inserida com sucesso na posição ${index}.`,
                playlist: playlistDupla.toArray()
            });

        }

    }catch (error) {
        
        console.error(  'Erro ao inserir música na playlist');
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    
    }

});

module.exports = router;