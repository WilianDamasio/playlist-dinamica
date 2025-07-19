const { getDB } = require('../config/database');

const COLLECTION_NAME = 'musicas_playlist';

const PlayListModel = {

    /**
     * Obtém todas as músicas da playlist, ordenadas.
     * Comparação com Lista Ligada: Equivalente a percorrer a lista do 'head' ao 'tail'.
     * O `.sort({order: 1})` garante a sequência, simulando os ponteiros 'next'.
     */
    async getAll() {
        try {
            const playlist = await getDB().collection(COLLECTION_NAME).find().sort({order:1}).toArray();
            return playlist;
        } catch (error) {
            console.error('Erro ao obter a playlist:', error);
            throw error;
        }
    },

    /**
     * Adiciona uma nova música ao final da "lista".
     * Comparação com Lista Ligada: Encontrar o último nó (tail) e adicionar um novo nó após ele.
     * @param {object} dadosDaMusica - O objeto com nome e artista.
     */
    async append(dadosDaMusica) {
        const collection = getDB().collection(COLLECTION_NAME);

        // 1. Encontra a música com o maior valor de 'order' (o "tail" da lista) para saber qual será o próximo.
        const ultimaMusica = await collection.find({}).sort({ order: -1 }).limit(1).toArray();

        // 2. Define a ordem da nova música. Se a lista estiver vazia, começa em 0 (o "head").
        const proximaOrdem = ultimaMusica.length > 0 ? ultimaMusica[0].order + 1 : 0;

        // 3. Cria o documento completo da nova música, incluindo o campo 'order'.
        const novoDocumento = { ...dadosDaMusica, order: proximaOrdem };
        
        // 4. Insere o novo documento no banco de dados.
        return collection.insertOne(novoDocumento);
    },

    /**
     * Remove uma música em uma posição (order) específica.
     * @param {number} order - A posição da música a ser removida.
     * Comparação com Lista Ligada: Remove um nó e reajusta os ponteiros dos nós subsequentes.
     */
    async removeAt(order) {
        const collection = getDB().collection(COLLECTION_NAME);

        // 1. Remove o documento na ordem especificada (o "nó" a ser removido).
        const result = await collection.deleteOne({ order: order });

        if (result.deletedCount === 0) {
            return null; // Indica que nenhuma música foi encontrada/removida.
        }

        // 2. Decrementa a ordem de todas as músicas posteriores para "preencher a lacuna",
        //    simulando o reajuste dos ponteiros/índices dos nós subsequentes.
        await collection.updateMany(
            { order: { $gt: order } }, // $gt = "greater than" (maior que)
            { $inc: { order: -1 } }
        );

        return result;
    },

    /**
     * Insere uma música em uma posição (order) específica.
     * @param {number} order - A posição onde a música será inserida.
     * @param {object} dadosDaMusica - O objeto com nome e artista.
     * Comparação com Lista Ligada: "Abre espaço" na lista e insere um novo nó.
     */
    async insertAt(order, dadosDaMusica) {
        const collection = getDB().collection(COLLECTION_NAME);

        // 1. Incrementa a ordem de todas as músicas a partir da posição de inserção para "abrir espaço".
        //    Isso simula o deslocamento dos nós subsequentes para a direita.
        await collection.updateMany(
            { order: { $gte: order } }, // $gte = "greater than or equal" (maior ou igual a)
            { $inc: { order: 1 } }
        );

        // 2. Insere a nova música na posição correta (o novo "nó" na lacuna criada).
        const novoDocumento = { ...dadosDaMusica, order: order };
        return collection.insertOne(novoDocumento);
    },

    /**
     * Move uma música de uma posição para outra.
     * @param {number} fromOrder - A posição original da música.
     * @param {number} toOrder - A nova posição da música.
     * Comparação com Lista Ligada: Equivalente a remover um nó e inseri-lo em outra posição,
     * reajustando todos os ponteiros/índices intermediários.
     */
    async move(fromOrder, toOrder) {
        const collection = getDB().collection(COLLECTION_NAME);

        // Validação básica: se as posições são iguais, não há nada a fazer.
        if (fromOrder === toOrder) {
            return { modifiedCount: 0 };
        }

        // Encontra a música que será movida.
        const songToMove = await collection.findOne({ order: fromOrder });
        if (!songToMove) {
            return null; // Música não encontrada na posição de origem.
        }

        // Se a música está se movendo para uma posição mais alta na lista (ex: de 5 para 2)
        if (fromOrder > toOrder) {
            // "Abre espaço" incrementando a ordem das músicas entre a nova e a antiga posição.
            await collection.updateMany(
                { order: { $gte: toOrder, $lt: fromOrder } },
                { $inc: { order: 1 } }
            );
        }
        // Se a música está se movendo para uma posição mais baixa na lista (ex: de 2 para 5)
        else { // fromOrder < toOrder
            // "Preenche o buraco" decrementando a ordem das músicas entre a antiga e a nova posição.
            await collection.updateMany(
                { order: { $gt: fromOrder, $lte: toOrder } },
                { $inc: { order: -1 } }
            );
        }

        // Finalmente, atualiza a música movida para sua nova posição.
        const result = await collection.updateOne(
            { _id: songToMove._id },
            { $set: { order: toOrder } }
        );

        return result;
    }
}

module.exports = PlayListModel;
