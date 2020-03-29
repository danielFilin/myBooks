import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BooksService } from '../../books.service';
import { Book } from '../../book.model';

@Component({
  selector: 'app-detailed-book',
  templateUrl: './detailed-book.component.html',
  styleUrls: ['./detailed-book.component.css']
})
export class DetailedBookComponent implements OnInit {
  book: Book;

  constructor(public route: ActivatedRoute, public booksService: BooksService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
        const bookId = paramMap.get('bookId');
        this.booksService.getSingleBook(bookId).subscribe( bookData => {
          this.book = {
            id: bookData['books']._id,
            title: bookData['books'].title,
            author: bookData['books'].author,
            description: bookData['books'].description,
            imagePath: bookData['books'].imagePath,
            creator: bookData['books'].creator
          };
        });
    });
  }
}

