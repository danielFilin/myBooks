import { Component, OnInit } from '@angular/core';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchParameter = 'author';

  constructor(private booksService: BooksService) { }

  ngOnInit(): void {
  }

  onSelect(queryParam) {
    this.searchParameter = queryParam.toLowerCase();
  }

  findBooks(event) {
    this.booksService.findBooks(event.value.toLowerCase(), this.searchParameter);
  }

}
