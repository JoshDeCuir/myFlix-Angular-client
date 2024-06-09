import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  isModalVisible = false;
  movies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
    });
  }

  showGenre(genre: any): void {
    this.dialog.open(ModalContentComponent, {
      data: { genre }
    });
  }

  showDirector(director: any): void {
    this.dialog.open(ModalContentComponent, {
      data: { director }
    });
  }

  showDescription(description: string): void {
    this.dialog.open(ModalContentComponent, {
      data: { description }
    });
  }
  

  redirectProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }
}
