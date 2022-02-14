import { Component, OnInit } from '@angular/core';
import { Puzzle } from 'src/app/puzzle';

@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.scss'],
})
export class SolverComponent implements OnInit {
  puzzle = new Puzzle();

  constructor() {}

  ngOnInit(): void {
    this.puzzle.addWord('AUDIO');
  }

  addWord(word: string) {
    this.puzzle.addWord(word);
  }
}
