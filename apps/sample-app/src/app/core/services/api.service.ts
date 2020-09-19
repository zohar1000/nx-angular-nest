import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get(url) {
    return this.http.get(this.getFUllUrl(url)).pipe(delay(500));
    // return this.http.get(this.getFUllUrl(url));
  }

  post(url, data) {
    // return this.http.post(this.getFUllUrl(url), data);
    return of({ isSuccess: true, data: { a: 1 }}).pipe(delay(500));
  }

  put(url, data) {
    // return this.http.put(this.getFUllUrl(url), data);
    return of({ isSuccess: true, data: { a: 1 }}).pipe(delay(500));
  }

  patch(url, data) {
    return this.http.patch(this.getFUllUrl(url), data);
  }

  delete(url, data) {
    return this.http.delete(this.getFUllUrl(url));
  }

  getFUllUrl(url) {
    return `${environment.serverAddress}/${url}`;
  }
}
