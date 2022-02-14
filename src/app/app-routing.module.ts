import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolverComponent } from './pages/solver/solver.component';

const routes: Routes = [
  {
    path: '',
    component: SolverComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
