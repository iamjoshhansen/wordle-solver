import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SolverComponent } from './pages/solver/solver.component';
import { LetterComponent } from './components/letter/letter.component';
import { WordComponent } from './components/word/word.component';

@NgModule({
  declarations: [AppComponent, SolverComponent, LetterComponent, WordComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
