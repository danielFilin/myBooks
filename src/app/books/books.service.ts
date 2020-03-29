import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from './book.model';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/books/';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient, private router: Router) {}

  private myBooks: Book[] = [];
  updatedBookList = new Subject<{books: Book[], bookCount: number}>();
  getUpdatedBookList() {
    return this.updatedBookList.asObservable();
  }

  addBook(id: null, author: string, title: string, description: string, image: File) {
    const bookData = new FormData();
    bookData.append('title', title);
    bookData.append('author', author);
    bookData.append('description', description);
    bookData.append('image', image, title);
    this.http.post<{message: string, book: Book}>(BACKEND_URL, bookData)
    .subscribe( (responseData) => {
      this.router.navigate(['/']);
    });

  }

   updateBook(id: string, author: string, title: string, description: string, image: File | string) {
      let bookData: Book | FormData;
      if (typeof(image) === 'object') {
        bookData = new FormData();
        bookData.append('id', id);
        bookData.append('title', title);
        bookData.append('author', author);
        bookData.append('description', description);
        bookData.append('image', image, title);
      }  else {
        bookData = {
          id,
          author,
          title,
          description,
          imagePath: image,
          creator: null
        };
      }
      this.http.put(BACKEND_URL + id, bookData)
    .subscribe( response => {
      this.router.navigate(['/']);
    });
  }

  getSingleBook(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      author: string,
      description: string,
      imagePath: string,
      creator: string
    }>(BACKEND_URL + id);
  }

  getBooks(postsPerPage: number, currentPage: number, userId: string) {
    const queryParams = `?pagesize=${postsPerPage}&startingpage=${currentPage}&userid=${userId}`;
    this.http.get<{message: string, books: any, maxBooks: number}>(BACKEND_URL + queryParams)
    .pipe(map ((bookData) => {
      return {books: bookData.books.map(book => {
        return {
          title: book.title,
          author: book.author,
          description: book.description,
          id: book._id,
          imagePath: book.imagePath,
          creator: book.creator
        };
      }), maxBooks: bookData.maxBooks};
    })
    )
    .subscribe( (updatedBookData) => {
        this.myBooks = updatedBookData.books;
        this.updatedBookList.next({
          books: [...this.myBooks],
          bookCount: updatedBookData.maxBooks
        });
    });
  }

  deleteBook(bookId: string) {
    return this.http.delete(BACKEND_URL + bookId);
  }

}
