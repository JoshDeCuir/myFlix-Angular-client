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
      
      let user = JSON.parse(localStorage.getItem('user') || '');
      resp.forEach((movie: any) => {
        movie.isFavorite = user.favoriteMovies.includes(movie._id);
      });

      this.movies = resp;
    });
  }

  showGenre(genre: any): void {
    this.dialog.open(ModalContentComponent, {
      data: { genre }
    });
  }

  modifyFavoriteMovies(movieId: any): void {
    let user = JSON.parse(localStorage.getItem('user') || '');
    let icon = document.getElementById(`${movieId}-favorite-icon`);

    if (user.favoriteMovies.includes(movieId)) {
        this.fetchApiData.removeFavoriteMovie(movieId).subscribe(function () {
            icon?.setAttribute('fontIcon', 'favorite_border');

            user.favoriteMovies = user.favoriteMovies.filter((favoriteMovieId: any) => favoriteMovieId !== movieId);
            localStorage.setItem('user', JSON.stringify(user));
        }, err => {
            console.error(err)
        })
    } else {
        this.fetchApiData.addFavoriteMovie(movieId).subscribe(function () {
            icon?.setAttribute('fontIcon', 'favorite');

            user.favoriteMovies.push(movieId);
            localStorage.setItem('user', JSON.stringify(user));
        }, err => {
            console.error(err)
        })
    }
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
