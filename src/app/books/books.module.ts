import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookCreateComponent } from './book-create/book-create.component';
import { BooksListComponent} from './books-list/books-list.component';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { DetailedBookComponent } from './books-list/detailed-book/detailed-book.component';

@NgModule({
  declarations: [
    BookCreateComponent,
    BooksListComponent,
    SearchComponent,
    DetailedBookComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule
  ]
})

export class BooksModule {}
