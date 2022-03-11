import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { answers } from './services/answers';

function getPossibleAnswers(words: Word[]): string[] {
  const knownPattern: string = words
    .reduce((acc, curr) => {
      return curr
        .letters!.map((letter, i) => {
          const a = acc[i];
          if (letter.mode === LetterMode.found || a !== '_') {
            return letter.letter;
          }
          return '_';
        })
        .join('');
    }, '_____')
    .toLowerCase();

  const knownPatternRegex = new RegExp(`^${knownPattern.replace(/_/g, '.')}$`);

  // Bad Letters
  const badLetterSet = new Set<string>();
  words.forEach((word) =>
    word.letters
      ?.filter((letter) => letter.mode === LetterMode.excluded)
      .forEach((letter) => badLetterSet.add(letter.letter!.toLowerCase()))
  );
  const badLetters = [...badLetterSet].join('');
  const badLettersRegex = new RegExp(`^.*[${badLetters}].*$`);

  const misplacedPatterns: string[] = words
    .map((word) => {
      return (
        word.letters
          ?.map((letter) =>
            letter.mode === LetterMode.missplaced
              ? letter.letter?.toLowerCase()
              : '_'
          )
          .join('') ?? '_____'
      );
    })
    .filter((x) => x !== '_____');

  const missplacedLetters = [0, 1, 2, 3, 4].map((index) => [
    ...new Set(
      misplacedPatterns
        .map((pattern) => pattern.charAt(index))
        .filter((c) => c !== '_')
    ),
  ]);

  const missingLetters = [
    ...new Set(
      misplacedPatterns
        .join('')
        .split('')
        .filter((c) => c != '_')
    ),
  ];

  return (
    answers
      // matches known spots
      .filter((word) => !!word.match(knownPatternRegex))
      // avoids bad letters
      .filter((word) => !word.match(badLettersRegex))
      // avoids bad spots
      .filter((word) =>
        missplacedLetters.every(
          (letters, i) => !letters.includes(word.charAt(i))
        )
      )
      // has all missing letters
      .filter((word) => {
        const has =
          [...new Set(word.split(''))]
            .map((c) => missingLetters.includes(c))
            .reduce((a, c) => a + (c ? 1 : 0), 0) === missingLetters.length;
        return has;
      })
      .map((word) => word.toUpperCase())
  );
}

export class Puzzle {
  private wordsSubject = new BehaviorSubject<Word[] | null>([]);
  readonly words$ = this.wordsSubject.pipe(
    filter((l) => l !== null)
    // distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  ) as unknown as Observable<Word[]>;
  set words(val: Word[] | null) {
    this.wordsSubject.next(val);
  }
  get words() {
    return this.wordsSubject.value;
  }

  answers$ = this.words$.pipe(map((words) => getPossibleAnswers(words)));

  getPossibleAnswers(): string[] {
    if (!this.words) {
      return [];
    }
    return getPossibleAnswers(this.words);
  }

  addWord(word: string) {
    if (word.length !== 5) {
      throw new Error(`Cannot add non 5-letter words`);
    }
    const newWord = new Word(
      word
        .toUpperCase()
        .split('')
        .map((c) => new Letter(c)) as Letters
    );

    const words = this.words!;
    const lastIndex = words.length - 1;

    if (lastIndex > -1) {
      const lastWord = words[lastIndex];
      lastWord.letters?.forEach((letter, i) => {
        if (letter.mode === LetterMode.found) {
          newWord.letters![i].mode = LetterMode.found;
        }
      });
    }

    this.words?.push(newWord);

    this.words = this.words;
    newWord.letters$.subscribe(() => (this.words = this.words));
  }

  reset() {
    this.wordsSubject.next([]);
  }
}

export type Letters = [Letter, Letter, Letter, Letter, Letter];

export class Word {
  private lettersSubject = new BehaviorSubject<Letters | null>(null);
  readonly letters$ = this.lettersSubject.pipe(
    filter((l) => l !== null)
    // distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  );
  set letters(val: Letters | null) {
    this.lettersSubject.next(val);
  }
  get letters() {
    return this.lettersSubject.value;
  }

  constructor(
    letters: Letters = [
      new Letter(),
      new Letter(),
      new Letter(),
      new Letter(),
      new Letter(),
    ]
  ) {
    this.letters = letters;

    this.letters.forEach((letter) => {
      letter.letter$.subscribe(() => (this.letters = this.letters));
      letter.mode$.subscribe(() => (this.letters = this.letters));
    });
  }
}

export enum LetterMode {
  normal = 'normal',
  excluded = 'excluded',
  missplaced = 'missplaced',
  found = 'found',
}

export class Letter {
  private letterSubject = new BehaviorSubject<string | null>(null);
  readonly letter$ = this.letterSubject.pipe(
    filter((l) => l !== null),
    distinctUntilChanged()
  );
  set letter(val: string | null) {
    this.letterSubject.next(val);
  }
  get letter() {
    return this.letterSubject.value;
  }

  private modeSubject = new BehaviorSubject<LetterMode | null>(null);
  readonly mode$ = this.modeSubject.pipe(
    filter((l) => l !== null),
    distinctUntilChanged()
  );
  set mode(val: LetterMode | null) {
    this.modeSubject.next(val);
  }
  get mode() {
    return this.modeSubject.value;
  }

  constructor(letter = '', mode = LetterMode.normal) {
    this.letter = letter;
    this.mode = mode;
  }
}
