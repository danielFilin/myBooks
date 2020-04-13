import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksListComponent } from './books/books-list/books-list.component';
import { BookCreateComponent } from './books/book-create/book-create.component';
import { AuthGuard } from './auth/auth.guard';
import { DetailedBookComponent } from './books/books-list/detailed-book/detailed-book.component';
import { PageViewComponent } from './books/books-list/page-view/page-view.component';


const routes: Routes = [
  { path: '', component: BooksListComponent },
  { path: 'create', component: BookCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:bookId', component: BookCreateComponent, canActivate: [AuthGuard]},
  { path: 'details/:bookId', component: DetailedBookComponent, canActivate: [AuthGuard]},
  { path: 'veiw-settings', component: PageViewComponent, canActivate: [AuthGuard]},
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
