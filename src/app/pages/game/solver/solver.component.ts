import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { Puzzle } from 'src/app/puzzle';

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

  constructor() {}

  ngOnInit(): void {
    this.startingWord$
      .pipe(takeUntil(this.destroyed))
      .subscribe((startingWord) => {
        console.log(`Added starting word: "${startingWord}"`);
        // this.puzzle = new Puzzle();
        this.addWord(startingWord);
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  addWord(word: string) {
    this.puzzle.addWord(word);
  }

  @Output('reset') resetEvent = new Subject();
  reset() {
    this.resetEvent.next();
  }
}
