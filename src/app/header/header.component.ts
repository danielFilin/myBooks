import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { BooksService } from '../books/books.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(private authService: AuthService, private booksService: BooksService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  showCollection(event) {
    this.userId = this.authService.getUserId();
    if (event.innerHTML === 'Show All Books') {
      this.booksService.getBooks(10, 1, '-1');
      event.innerHTML = 'Show My Books';
    } else {
      this.booksService.getBooks(10, 1, this.userId);
      event.innerHTML = 'Show All Books';
    }
  }

}
