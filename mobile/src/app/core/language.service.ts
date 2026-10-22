import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly language = signal<'en' | 'th'>('en');

  toggle(): void {
    const next = this.language() === 'en' ? 'th' : 'en';
    this.language.set(next);
    if (typeof document !== 'undefined') document.documentElement.lang = next;
  }
}
