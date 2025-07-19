// data-structures/SingleLinkedList.js

/**
 * Classe Node: Representa um nó na lista ligada.
 */
class Node {

    /**
     * Construtor da classe Node.
     * @param {*} data - O dado a ser armazenado no nó.
     */
    
    constructor(data) {
        this.data = data;
        this.proximo = null;
    }
}

    /**
     * Adiciona um novo nó ao final da lista.
     * @param {*} dado - O dado a ser armazenado no novo nó.
     */
class SingleLinkedList {
    constructor() {
        this.cabeca = null;
        this.tamanho = 0;
    }

     /**
     * Adiciona um novo nó ao final da lista.
     * @param {*} dado - O dado a ser armazenado no novo nó.
     */
    append(dado) {
        const novoNo  = new Node(dado);
        if (this.cabeca === null) {
            this.cabeca = novoNo ;
        } else {
            let atual = this.cabeca;
            while (atual.proximo) {
                atual = atual.proximo;
            }
            atual.proximo = novoNo;
        }
        this.tamanho++;
    }

     /**
     * Converte a lista ligada em um array.
     * @returns {Array<*>} Um array com os dados de todos os nós.
     */

    toArray() {
        const arrayResultado = [];
        let noatual = this.cabeca;
        while (noatual) {
            arrayResultado.push(noatual.data);
            noatual = noatual.proximo;
        }
        return arrayResultado;
    }

     /**
     * Insere um novo nó em um índice específico da lista.
     * @param {number} index - A posição onde o novo nó será inserido.
     * @param {*} dado - O dado para o novo nó.
     * @returns {boolean} Retorna true se a inserção foi bem-sucedida, false caso contrário.
     */

    insertAt(index, dado){
        if (index < 0 || index > this.tamanho) {
            return false;
        }

        const novoNo = new Node(dado);
        
        if (index === 0) {
            novoNo.proximo = this.cabeca;
            this.cabeca = novoNo;
        }else{
            let noAtual = this.cabeca;
            let noAnterior;
            let contador = 0;

            while (contador < index) {
                noAnterior = noAtual;
                noAtual = noAtual.proximo;
                contador++;
            }

            noAnterior.proximo = novoNo;
            novoNo.proximo = noAtual;

        }

        this.tamanho++;
        return true;
    }
    
     /**
     * Remove um nó de um índice específico da lista.
     * @param {number} index - A posição do nó a ser removido.
     * @returns {*|null} Retorna o dado do nó removido ou null se o índice for inválido.
     */

     removeAt(index) {

        if (index < 0 || index >= this.tamanho) {
            console.log('Índice inválido para remoção.');
            return null;
        }

        let noRemovido;

        if (index === 0) {

            noRemovido = this.cabeca;
            this.cabeca = this.cabeca.proximo

        }else if(index === this.tamanho - 1){
            
            let noAtual = this.cabeca;
            let noAnterior;

            while(noAtual.proximo){
                noAnterior = noAtual;
                noAtual = noAtual.proximo;
            }

            noAnterior.proximo = null;
            noRemovido = noAtual;

        }else{

            let noAnterior;
            let noAtual = this.cabeça;
            let contador = 0;

            while(contador < index){
                noAnterior = noAtual;
                noAtual = noAtual.proximo;
                contador++;
            }

            noAnterior.proximo = noAtual.proximo;
            noRemovido = noAtual;

        }

        this.tamanho--;
        return noRemovido.data;
    }
}

module.exports = SingleLinkedList;

