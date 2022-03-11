import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { LetterMode, Puzzle } from 'src/app/puzzle';

@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.scss'],
})
export class SolverComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();
  puzzle = new Puzzle();

  private startingWordSubject = new BehaviorSubject<string | null>(null);
  readonly startingWord$ = this.startingWordSubject.pipe(
    filter((x) => !!x),
    map((x) => x as string),
    distinctUntilChanged()
  );
  @Input() set startingWord(val: string | null) {
    if (val) {
      this.startingWordSubject.next(val);
    }
  }

  hasSingleAnswer$ = this.puzzle.answers$.pipe(
    map((answers) => answers.length === 1),
    distinctUntilChanged()
  );
  hasBeenSolved$ = combineLatest([
    this.puzzle.words$,
    this.puzzle.answers$,
  ]).pipe(
    map(([words, answers]) => {
      if (answers.length !== 1) {
        return false;
      }
      const lastWord = words[words.length - 1].letters
        ?.map((letter) => letter.letter)
        .join('');
      const answer = answers[0];
      return lastWord === answer;
    }),
    distinctUntilChanged()
  );

  constructor() {}

  ngOnInit(): void {
    this.startingWord$
      .pipe(takeUntil(this.destroyed))
      .subscribe((startingWord) => {
        this.puzzle.reset();
        this.addWord(startingWord);
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  addWord(word: string) {
    const answerCount = this.puzzle.getPossibleAnswers().length;
    this.puzzle.addWord(word);
    if (answerCount === 1) {
      const words = this.puzzle.words;
      if (words) {
        const lastWord = words[words.length - 1];
        if (lastWord) {
          lastWord.letters?.forEach(
            (letter) => (letter.mode = LetterMode.found)
          );
        }
      }
    }
  }

  @Output('reset') resetEvent = new Subject();
  reset() {
    this.resetEvent.next();
  }
}
