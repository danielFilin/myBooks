import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksListComponent } from './books/books-list/books-list.component';
import { BookCreateComponent } from './books/book-create/book-create.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  { path: '', component: BooksListComponent },
  { path: 'create', component: BookCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:bookId', component: BookCreateComponent, canActivate: [AuthGuard]},
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
