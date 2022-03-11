import { Component, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { answers } from 'src/app/services/answers';

const lastStartingWordKey = 'last-starting-word';

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
    this.wordSubject.next(val.toUpperCase());
  }

  isNotAPossibleAnswer$ = this.word$.pipe(
    map((word) => {
      if (word.length !== 5) {
        return false;
      }
      return !answers.includes(word.toLowerCase());
    })
  );

  get lastStartingWord() {
    return window.localStorage.getItem(lastStartingWordKey) || '';
  }
  set lastStartingWord(word: string) {
    window.localStorage.setItem(lastStartingWordKey, word.toUpperCase());
  }

  public readonly hasEnteredValidWord$ = this.word$.pipe(
    map((word) => word.length === 5)
  );

  @Output() claim = new Subject<string>();

  setInput(event: any) {
    this.word = event.target?.value || '';
  }

  claimStartingWord(word = this.word) {
    this.claim.next(word);
    this.lastStartingWord = word;
  }
}
