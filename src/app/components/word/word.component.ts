import { Component, Input, OnInit } from '@angular/core';
import { LetterMode, Word } from 'src/app/puzzle';

export interface Letter {
  character: string;
  mode: LetterMode | null;
}

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent implements OnInit {
  @Input() word!: Word;

  constructor() {}

  ngOnInit(): void {}

  setMode(i: number, mode: LetterMode | null) {
    if (this.word.letters) {
      this.word.letters[i].mode = mode;
    }
  }
}
