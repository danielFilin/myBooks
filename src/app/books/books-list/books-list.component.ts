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
  booksPerPage = 10;
  currentPage = 1;
  userId: string;
  private authStatusSubs: Subscription;
  userIsAuthenticated = false;
  settingsView = false;
  searchBarView = false;

  constructor(public booksService: BooksService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.booksService.getBooks(this.booksPerPage, this.currentPage, this.userId);
    this.booksSubscription = this.booksService.getUpdatedBookList()
    .subscribe( (bookData: {books: Book[], bookCount: number}) => {
      this.books = bookData.books;
      this.isLoading = false;
      this.totalPosts = bookData.bookCount;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    console.log(this.userIsAuthenticated);
    this.authStatusSubs = this.authService.getAuthStatusListener()
    .subscribe( isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });

    this.booksService.exampleEmitter.subscribe( (state) => {
      this.isLoading = true;
      this.booksService.getBooks(state[0], state[1], this.userId);
    });
  }

  onSelect(form: NgForm) {
    this.isLoading = true;
    this.currentPage = form.value.startingPage;
    this.booksPerPage = form.value.pagesNumber;
    this.booksService.getBooks(this.booksPerPage, this.currentPage, this.userId);
  }

  onDeleteBook(bookId: string) {
    this.isLoading = true;
    this.booksService.deleteBook(bookId).subscribe( () => {
      this.booksService.getBooks(this.booksPerPage, this.currentPage, this.userId);
    }, () => {
      this.isLoading = false;
    });
  }

  toggleViewSettings(event) {
    if (this.settingsView === false) {
      this.settingsView = true;
      event.innerHTML = 'Hide View Settings';
    } else {
      this.settingsView = false;
      event.innerHTML = 'Show View Settings';
    }
  }

  toggleSearchBar(event) {
    if (this.searchBarView === false) {
      this.searchBarView = true;
      event.innerHTML = 'Hide Search Bar';
    } else {
      this.searchBarView = false;
      event.innerHTML = 'Show Search Bar';
    }
  }

  ngOnDestroy() {
    this.booksSubscription.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

}
