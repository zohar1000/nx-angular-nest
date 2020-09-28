import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get(url) {
    return this.http.get(this.getFUllUrl(url));
  }

  post(url, data) {
    return this.http.post(this.getFUllUrl(url), data);
  }

  put(url, data) {
    return this.http.put(this.getFUllUrl(url), data);
  }

  patch(url, data) {
    return this.http.patch(this.getFUllUrl(url), data);
  }

  delete(url) {
    return this.http.delete(this.getFUllUrl(url));
  }

  getFUllUrl(url) {
    return `${environment.serverAddress}/${url}`;
  }
}
