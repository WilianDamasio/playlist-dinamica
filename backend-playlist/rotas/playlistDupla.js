const express = require('express');
const router = express.Router();

const playlistModel = require('../models/playlistModel');

/**
 * @route   POST /api/playlistDupla
 * @desc    Adiciona uma nova música ao FINAL da playlist
 * @access  Public
 */
router.post('/', async (req, res) => {

    try {

        const { nome, artista } = req.body;

        if (!nome || !artista) {
            return res.status(400).json({ mensagem: 'Os Campos "nome" e "artista" são obrigatórios.' })
        }

        const novaMusica = {
            nome,
            artista
        };

        await playlistModel.append(novaMusica);

        res.status(201).json({ mensagem: 'Música adicionada com sucesso!' });

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
router.get('/', async (req, res) => {

    try {

        const playlistComoArray = await playlistModel.getAll();

        res.status(200).json({
            playlist: playlistComoArray,
            total_de_musicas: playlistComoArray.length
        });
        
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
router.delete('/:index', async (req, res) => {

    try {

        const index = parseInt(req.params.index);
        const resultado = await playlistModel.removeAt(index);
        
        if (resultado && resultado.deletedCount > 0) {
            res.status(200).json({
                mensagem: `Música na posição ${index} removida com sucesso.`
            });
            
        } else {

            res.status(404).json({ mensagem: 'Índice inválido ou música não encontrada. Nenhuma música foi removida.' });
        
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

router.post('/insert/:index', async (req, res) => {

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

        const resultado = await playlistModel.insertAt(index, novaMusica);

        if (resultado && resultado.insertedId) {
            res.status(200).json({
                mensagem: `Música inserida com sucesso na posição ${index}.`
            });
        }

    }catch (error) {
        
        console.error(  'Erro ao inserir música na playlist');
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    
    }

});

/**
 * @route   PATCH /api/playlistDupla/move
 * @desc    Move uma música de uma posição para outra
 * @access  Public
 */
router.patch('/move', async (req, res) => {
    try {
        const { from, to } = req.body;

        // Validação de entrada
        if (from === undefined || to === undefined || typeof from !== 'number' || typeof to !== 'number' || from < 0 || to < 0) {
            return res.status(400).json({ mensagem: 'As propriedades "from" e "to" são obrigatórias e devem ser números não-negativos.' });
        }

        const resultado = await playlistModel.move(from, to);

        if (resultado === null) {
             return res.status(404).json({ mensagem: `Música não encontrada na posição de origem ${from}.` });
        }

        if (resultado.modifiedCount > 0) {
            res.status(200).json({ mensagem: `Música movida da posição ${from} para ${to} com sucesso.` });
        } else {
            // Este caso acontece se from === to. O modelo lida com isso.
            res.status(200).json({ mensagem: 'As posições de origem e destino são as mesmas. Nenhuma alteração foi feita.' });
        }

    } catch (error) {
        console.error('Erro ao mover música na playlist:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
});

module.exports = router;