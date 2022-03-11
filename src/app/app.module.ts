import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LetterComponent } from './components/letter/letter.component';
import { WordComponent } from './components/word/word.component';
import { GameComponent } from './pages/game/game.component';
import { SolverComponent } from './pages/game/solver/solver.component';
import { StartComponent } from './pages/game/start/start.component';
import { CountPipe } from './pipes/count.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LetterComponent,
    SolverComponent,
    StartComponent,
    WordComponent,
    CountPipe,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
