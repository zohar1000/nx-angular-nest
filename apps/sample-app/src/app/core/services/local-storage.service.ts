import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  static readonly PAGE_SIZE = 'page_size';

  getItem(name) {
    const item = localStorage.getItem(name);
    return item ? item : null;
  }

  getJsonItem(name) {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  }

  setItem(name, item) {
    localStorage.setItem(name, item);
  }

  setJsonItem(name, item) {
    localStorage.setItem(name, JSON.stringify(item));
  }

  deleteItem(name) {
    localStorage.removeItem(name);
  }

  clear() {
    localStorage.clear();
  }
}
