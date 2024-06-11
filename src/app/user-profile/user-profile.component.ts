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

  ngOnInit(): void {}

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
    }, (err: any) => {
      console.error(err);
    })
  }
  
  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe(() => {
      this.logout();
    }, (err: any) => {
      console.error(err);
    })
  }

  backToMovies(): void {
    this.router.navigate(['movies']);
  }

  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");
  }
}
