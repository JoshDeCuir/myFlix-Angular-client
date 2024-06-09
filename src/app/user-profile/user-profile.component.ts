import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit{
  userData: any = {};
  favoriteMovies: any = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router
  ){
    this.userData = JSON.parse(localStorage.getItem('user') || '{}');
  }

  ngOnInit(): void {
    this.getfavoriteMovies();
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((resp) => {
      this.userData = {
        ...resp,
        id: resp._id,
        password: this.userData.password,
        email: this.userData.email,
        birthday: this.userData.birthday.split("T")[0],
        token: this.userData.token
      };
      localStorage.setItem('user', JSON.stringify(this.userData));
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err);
    })
  }
  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem('user') || '{}');
  }
  backToMovies(): void {
    this.router.navigate(['movies']);
  }

  getfavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp.filter((movies: any) => {
        return this.userData.favoriteMovies.includes(movies._id);
      })
    }, (err: any) => {
      console.error(err);
    })
  }


  removeFromFavorite(movies: any): void {
    this.fetchApiData.deleteFavoriteMovies(movies.title).subscribe((res: any) => {
      this.userData.favoriteMovies = res.favoriteMovies;
      this.getfavoriteMovies();
    }, (err: any) => {
      console.error(err)
    })
  }
  
  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
  }
}
