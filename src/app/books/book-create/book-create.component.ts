import { Component, OnInit } from '@angular/core';
import { BooksService } from '../books.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Book } from '../book.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {
  private mode = 'create';
  private bookId: string;
  book: Book;
  form: FormGroup;
  isLoading = false;
  imagePreview: string;

  constructor(public booksService: BooksService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required]}),
      author: new FormControl(null, {validators: [Validators.required]}),
      description: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if (paramMap.has('bookId')) {
        this.mode = 'edit';
        this.bookId = paramMap.get('bookId');
        this.isLoading = true;
        this.booksService.getSingleBook(this.bookId).subscribe( bookData => {
          this.book = {
            id: bookData['books']._id,
            title: bookData['books'].title,
            author: bookData['books'].author,
            description: bookData['books'].description,
            imagePath: bookData['books'].imagePath
          };
          this.isLoading = false;
          this.form.setValue({
              title: this.book.title,
              author: this.book.author,
              description: this.book.description,
              image: this.book.imagePath
            });
        });
      } else {
        this.mode = 'create';
        this.bookId = null;
      }
    });
  }

  onSaveBook() {
    if (this.form.invalid) {
      return;
    }
    const id = null;
    this.isLoading = true;
    if (this.mode === 'create') {
      this.booksService.addBook(
        id,
        this.form.value.author,
        this.form.value.title,
        this.form.value.description,
        this.form.value.image);
    } else {
      this.booksService.updateBook(
        this.bookId,
        this.form.value.author,
        this.form.value.title,
        this.form.value.description,
        this.form.value.image
        )}
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    };
    reader.readAsDataURL(file);
  }

}
