import { Component, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  private wordSubject = new BehaviorSubject<string>('');
  readonly word$ = this.wordSubject.pipe(
    distinctUntilChanged(),
    map((word) => word.toUpperCase())
  );
  get word() {
    return this.wordSubject.value;
  }
  set word(val: string) {
    this.wordSubject.next(val);
  }

  public readonly hasEnteredValidWord$ = this.word$.pipe(
    map((word) => word.length === 5)
  );

  @Output() claim = new Subject<string>();

  setInput(event: any) {
    this.word = event.target?.value || '';
  }

  claimStartingWord() {
    this.claim.next(this.word);
  }
}
