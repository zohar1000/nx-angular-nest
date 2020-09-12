import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get(url) {
    return this.http.get(this.getFUllUrl(url));
  }

  post(url, data) {
    return this.http.get(this.getFUllUrl(url), data);
  }

  getFUllUrl(url) {
    return `${environment.serverAddress}/${url}`;
  }
}
