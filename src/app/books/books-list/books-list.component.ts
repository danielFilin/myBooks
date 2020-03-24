import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { Book } from '../book.model';
import { BooksService } from '../books.service';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css'],

})
export class BooksListComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  posts = [];
  booksSubscription: Subscription;
  isLoading = false;
  totalPosts = 0;
  booksPerPage = 2;
  currentPage = 1;
  userId: string;
  private authStatusSubs: Subscription;
  userIsAuthenticated = false;

  constructor(public booksService: BooksService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.booksService.getBooks(this.booksPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.booksSubscription = this.booksService.getUpdatedBookList()
    .subscribe( (booData: {books: Book[], bookCount: number}) => {
      this.books = booData.books;
      this.isLoading = false;
      this.totalPosts = booData.bookCount;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener()
    .subscribe( isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onSelect(form: NgForm) {
    this.isLoading = true;
    this.currentPage = form.value.startingPage;
    this.booksPerPage = form.value.pagesNumber;
    console.log(this.booksPerPage, this.currentPage);
    this.booksService.getBooks(this.booksPerPage, this.currentPage);
  }

  onDeleteBook(bookId: string) {
    this.isLoading = true;
    this.booksService.deleteBook(bookId).subscribe( () => {
      this.booksService.getBooks(this.booksPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.booksSubscription.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

}
