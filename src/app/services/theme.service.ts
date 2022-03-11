import { Injectable } from '@angular/core';

enum Theme {
  light = 'light',
  dark = 'dark',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  get theme() {
    return (window.localStorage.getItem('theme') as Theme) || Theme.light;
  }

  set theme(theme: Theme) {
    window.localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  constructor() {
    this.applyTheme();
  }

  toggle() {
    this.theme = this.theme === Theme.dark ? Theme.light : Theme.dark;
  }

  private applyTheme() {
    const action = this.theme === Theme.dark ? 'add' : 'remove';
    document.body.classList[action]('theme--dark');
    console.log(`Applyything theme ${this.theme} (${action})`);
  }
}
