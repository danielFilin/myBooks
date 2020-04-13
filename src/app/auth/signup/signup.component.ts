import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  isErrorOnSignup = false;
  private authStatusSub: Subscription;
  hasErrors = false;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.authService.isErrorOnSignupOrLogin().subscribe(
      status => {
        this.isErrorOnSignup = true;
        document.getElementById('openModalButton').click();
      }
    );
 }

  isPasswordIdentical(password, confirmPassword) {
    if (password === confirmPassword) {
      return true;
    }
    return false;
  }

  onSignup(form: NgForm) {
    if (form.invalid && this.isPasswordIdentical(form.value.password, form.value.repeatPassword)) {
      this.isErrorOnSignup = true;
      return;
    }
    this.hasErrors = true;
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
