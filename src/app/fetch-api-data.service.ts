import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Declaring the API URL that will provide data for the client app
const apiUrl = 'https://movieapi-ba6f568c0d4b.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  /**
   * @constructor
   * @param {HttpClient} http - For making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Making the API call for the user registration endpoint.
   * @param {any} userDetails - User details for registration.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call for the user login endpoint.
   * @param {any} userDetails - User details for login.
   * @returns {Observable<any>} - Observable for the API response.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call for the Get All Movies endpoint.
   * @returns {Observable<any>} - Observable for the API response.
   */
  getAllMovies(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    //const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call for the Get One Movie endpoint.
   * @param {string} title - One movie title.
   * @returns {Observable<any>} - Observable for the API response.
   */
  getOneMovie(title: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call for the Get Director endpoint.
   * @param {string} name - Director's name.
   * @returns {Observable<any>} - Observable for the API response.
   */
  getDirector(name: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return this.http.get(apiUrl + 'movies/directors/' + name, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call for the Get Genre endpoint.
   * @param {string} name - Genre name.
   * @returns {Observable<any>} - Observable for the API response.
   */
  getGenre(name: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return this.http.get(apiUrl + 'movies/genre/' + name, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call for the Get User endpoint.
   * @returns {Observable<any>} - Observable for the API response.
   */
  getUser(username:string ): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call for the Get Favourite Movies for a user endpoint.
   * @param {string} username - User's username for getting favorite movies.
   * @returns {Observable<any>} - Observable for the API response.
   */
  getFavoriteMovies(username: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call for the Add a Movie to Favourite Movies endpoint.
   * @param {any} movie - Movie for adding to favorite movies.
   * @returns {Observable<any>} - Observable for the API response.
   */
  addFavoriteMovie(movieId: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http.post(apiUrl + 'users/' + user._id + '/addFavoriteMovie/' + movieId, null, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

    /**
   * Making the API call for the Delete a Movie to Favourite Movies endpoint.
   * @param {any} movie - Movie for deleting from favorite movies.
   * @returns {Observable<any>} - Observable for the API response.
   */
    removeFavoriteMovie(movieId: any): Observable<any> {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return this.http.post(apiUrl + 'users/' + user._id + '/removeFavoriteMovie/' + movieId, null, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + user.token
        })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }

  /**
   * Making the API call for the Edit User endpoint.
   * @param {any} userDetails - User details for updating user information.
   * @returns {Observable<any>} - Observable for the API response.
   */
  editUser(userDetails: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return this.http.put(apiUrl + 'users/' + user.username, userDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Making the API call for the Delete User endpoint.
   * @returns {Observable<any>} - Observable for the API response.
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // check that user is not blank / null

    return this.http.delete(apiUrl + 'users/' + user._id, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.token
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Non-typed response extraction.
   * @param {Object} res - API response.
   * @returns {any} - Extracted response data.
   */
  private extractResponseData(res: Object): any {
    return res || {};
  }

  /**
   * Handling of HTTP errors.
   * @param {HttpErrorResponse} error - HTTP error response.
   * @returns {any} - Error details.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(
      'Something bad happened; please try again later.'
    );
  }
}
