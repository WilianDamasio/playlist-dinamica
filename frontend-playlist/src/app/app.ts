import { Component, ChangeDetectorRef } from '@angular/core';
// Imports necessários
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class AppComponent {
  // Lista de músicas que será exibida na tela
  playlist: any[] = [];
  // Objeto para os formulários de adição/inserção
  novaMusica = { nome: '', artista: '' };
  indiceParaInserir: number = 0; //
  // URL da nossa API
  private apiUrl = 'http://localhost:3000/api/playlistDupla';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    // Ao iniciar o componente, busca a playlist inicial
    this.carregarPlaylist();
  }

  // Método para buscar a playlist no backend
  carregarPlaylist() {
    this.http.get<{ playlist: any[] }>(this.apiUrl).subscribe({
      next: (response) => {
        console.log("Playlist carregada com sucesso", response)
        this.playlist = response.playlist;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar a playlist', err)
    });
  }

  // Método para adicionar música no final
  adicionarMusica() {
    this.http.post(this.apiUrl, this.novaMusica).subscribe({
      next: () => {
        this.carregarPlaylist(); // Recarrega a lista após adicionar
        this.novaMusica = { nome: '', artista: '' }; // Limpa o formulário
      },
      error: (err) => console.error('Erro ao adicionar música', err)
    });
  }

  // Método para remover uma música
  removerMusica(index: number) {
    this.http.delete(`${this.apiUrl}/${index}`).subscribe({
      next: () => {
        this.carregarPlaylist(); // Recarrega a lista após remover
      },
      error: (err) => console.error('Erro ao remover música', err)
    });
  }

  // Método para inserir em uma posição
  inserirMusica() {
    const url = `${this.apiUrl}/insert/${this.indiceParaInserir}`;
    this.http.post(url, this.novaMusica).subscribe({
      next: () => {
        this.carregarPlaylist();
        this.novaMusica = { nome: '', artista: '' };
        this.indiceParaInserir = 0;
      },
      error: (err) => console.error('Erro ao inserir música', err)
    });
  }

  // Método para mover uma música na playlist (arrastar e soltar)
  moverMusica(event: CdkDragDrop<any[]>) {
    const fromIndex = event.previousIndex;
    const toIndex = event.currentIndex;

    // Não faz nada se o item for solto no mesmo lugar
    if (fromIndex === toIndex) {
      return;
    }

    // Atualiza a ordem da lista na interface para uma resposta visual imediata (UI Otimista)
    moveItemInArray(this.playlist, fromIndex, toIndex);
    this.cdr.detectChanges();

    const url = `${this.apiUrl}/move`;
    const body = { from: fromIndex, to: toIndex };

    this.http.patch(url, body).subscribe({
      next: () => console.log(`Música movida de ${fromIndex} para ${toIndex}`),
      error: (err) => {
        console.error('Erro ao mover música', err);
        // Em caso de erro, recarrega a playlist do servidor para reverter a mudança visual.
        this.carregarPlaylist();
      }
    });
  }
}