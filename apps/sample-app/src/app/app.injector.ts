import { Injector } from '@angular/core';

export let appInjector!: Injector;
export const setAppInjector = (value) => {
  appInjector = value;
};

export let sharedInjector!: Injector;
export const setSharedInjector = (value) => {
  sharedInjector = value;
};
