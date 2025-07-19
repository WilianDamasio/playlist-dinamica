// data-structures/DoublyLinkedList.js

/**
 * Classe DoublyNode: A versão "dupla" do nosso nó.
 * Agora com ponteiros para o próximo E para o anterior.
 */

class DoublyNode {

    /**
     * Construtor da classe DoublyNode.
     * @param {*} dado - O dado a ser armazenado 
     * 
     * */

    constructor(dado) {
        this.dado = dado;
        this.proximo = null;
        this.anterior = null;
    }
}

class DoublyLinkedList {

    /**
     * Construtor da classe DoublyLinkedList.
     */

    constructor() {
        this.cabeca = null;
        this.cauda = null;
        this.tamanho = 0;
    }

    /**
     * Adiciona um novo nó ao final da lista.
     * @param {*} dado - O dado a ser armazenado no novo nó.
     */

    append(dado) {

        const novoNo = new DoublyNode(dado);

        if (this.cabeca === null) {

            this.cabeca = novoNo;
            this.cauda = novoNo;

        } else {

            this.cauda.proximo = novoNo;
            novoNo.anterior = this.cauda;
            this.cauda = novoNo;

        }

        this.tamanho++;

    }

    /**
     * Converte a lista ligada em um array.
     * @returns {Array<*>} Um array com os dados de todos os nós.
     */

    toArray() {
        const arrayResultado = [];
        let noAtual = this.cabeca;
        while (noAtual) {
            arrayResultado.push(noAtual.dado);
            noAtual = noAtual.proximo;
        }
        return arrayResultado;
    }

    /**
     * Remove um nó de um índice específico da lista.
     * @param {index} - Indice do nó que será removido
     * @returns {boolean} - Retorno se foi possivel remover o indice
     * */
    removeAt(index) {

        if (index < 0 || index >= this.tamanho) {
            console.log('Índice inválido para remoção.');
            return null;
        }

        let noRemovido;

        if (index === 0) {

            noRemovido = this.cabeca;
            this.cabeca = this.cabeca.proximo;

            if (this.cabeca) {
                this.cabeca.anterior = null;
            } else {
                this.cauda = null;
            }

        } else if (index === this.tamanho - 1) {

            noRemovido = this.cauda;
            this.cauda = this.cauda.anterior;
            this.cauda.proximo = null;

        } else {

            let noAtual = this.cabeca;
            let contador = 0;

            while (contador < index) {
                noAtual = noAtual.proximo;
                contador++;
            }

            noAtual.anterior.proximo = noAtual.proximo;
            noAtual.proximo.anterior = noAtual.anterior;
            noRemovido = noAtual;

        }

        this.tamanho--;
        return noRemovido.dado;

    }

    /**
     * Insere um novo nó em um índice específico da lista.
     * @param {number} index - A posição onde o novo nó será inserido.
     * @param {*} dado - O dado para o novo nó.
     * @returns {boolean} Retorna true se a inserção foi bem-sucedida, false caso contrário.
     */

    insertAt(index, dado) {
        if (index < 0 || index > this.tamanho) {
            return false;
        }

        const novoNo = new DoublyNode(dado);

        if (index === 0) {
            novoNo.proximo = this.cabeca;

            if (this.cabeca) {
                this.cabeca.anterior = novoNo;
            }

            this.cabeca = novoNo;

        } else if (index === this.tamanho) {

            novoNo.anterior = this.cauda;

            if (this.cauda) {
                this.cauda.proximo = novoNo;
            }

            this.cauda = novoNo;

        } else {

            let noAtual = this.cabeca;
            let contador = 0;

            while (contador < index) {
                noAtual = noAtual.proximo;
                contador++;
            }

            novoNo.proximo = noAtual;
            novoNo.anterior = noAtual.anterior;
            noAtual.anterior.proximo = novoNo;
            noAtual.anterior = novoNo;

        }

        this.tamanho++;
        return true;
    }

}

module.exports = DoublyLinkedList;
