export enum FormPatterns {
  Email = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$',
  Name = '^[a-zA-Z -]+$',
  Password = '^[\\w!@#\\$%\\^*]{2,}$'  //  // also /^[a-zA-Z0-9$_.\-]+$
}
