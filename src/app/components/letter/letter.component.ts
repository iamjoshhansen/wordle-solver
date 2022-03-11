import { Component, Input, OnInit, Output } from '@angular/core';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Letter, LetterMode } from 'src/app/puzzle';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss'],
})
export class LetterComponent implements OnInit {
  LetterMode = LetterMode;

  @Input() letter!: Letter;

  constructor() {}

  ngOnInit(): void {}

  isTouch = false;

  nextMode(ev: Event, isTouch = false) {
    ev.preventDefault();

    if (isTouch) {
      this.isTouch = true;
    }

    if (this.isTouch !== isTouch) {
      return;
    }

    const modes: LetterMode[] = [
      LetterMode.excluded,
      LetterMode.missplaced,
      LetterMode.found,
    ];
    const currentMode = this.letter.mode;
    const index = currentMode ? modes.indexOf(currentMode) : -1;
    const nextIndex = (modes.length + index + 1) % modes.length;
    const nextMode = modes[nextIndex];
    this.letter.mode = nextMode;
  }
}
