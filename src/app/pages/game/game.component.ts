import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  private readonly startingWordSubject = new BehaviorSubject<string>('');
  public readonly startingWord$ = this.startingWordSubject.pipe(
    distinctUntilChanged()
  );
  public readonly hasStartingWord$ = this.startingWord$.pipe(
    map((word) => word.length > 0)
  );

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {}

  startWithWord(word: string) {
    this.startingWordSubject.next(word);
  }

  reset() {
    this.startingWordSubject.next('');
  }

  toggleTheme() {
    this.themeService.toggle();
  }
}
