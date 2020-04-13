import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BooksService } from '../../books.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.css']
})
export class PageViewComponent implements OnInit {
  userId: string;

  constructor(private booksService: BooksService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }


  onSelect(form: NgForm) {
    const settingsData = [form.value.pagesNumber, form.value.startingPage];
    this.booksService.exampleEmitter.next(settingsData);
  }

}
