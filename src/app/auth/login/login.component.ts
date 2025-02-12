import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  isErrorOnLogin = false;
  hasErrors = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.authService.isErrorOnSignupOrLogin().subscribe(
      status => {
        this.isErrorOnLogin = true;
        document.getElementById('openModalButton').click();
      }
    );
    this.authService.isLoginPage(true);
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      this.isErrorOnLogin = true;
      document.getElementById('openModalButton').click();
      this.hasErrors = true;
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.authService.isLoginPage(false);
  }

}
