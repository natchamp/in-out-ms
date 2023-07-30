import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { LoginDetails } from '../models/models';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;
  responseMsg: string = '';

  loginDetails: LoginDetails={
      userName:'',
      password:''
  }

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.loginForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
      ]),
    });
  }

  login() {
    // let loginInfo = {
    //   email: this.loginForm.get('email')?.value,
    //   password: this.loginForm.get('password')?.value,
    // };

    this.api.login(this.loginDetails).subscribe({
      next: (res: any) => {
        if (res.toString() === 'Invalid'){
          this.responseMsg = 'Invalid Credentials!';
          alert(this.responseMsg)
        }  
        else {
          this.responseMsg = res.toString();
          if(this.responseMsg.includes("Successful"))
          {
            alert("Login Successfully")
          }else{
          alert(this.responseMsg);
          }
           this.api.saveUsername(res.toString());
          // let isActive = this.api.getTokenUserInfo()?.active ?? false;
          // if (isActive) 
          this.router.navigateByUrl('/home');
          // else {
          //   this.responseMsg = 'You are not Active!';
          //   this.api.deleteToken();
          //}
        }
      },
      error: (err: any) => {
        console.log('Error: ');
        console.log(err);
      },
    });
  }

  getEmailErrors() {
    if (this.Email.hasError('required')) return 'Email is required!';
    if (this.Email.hasError('email')) return 'Email is invalid.';
    return '';
  }

  getPasswordErrors() {
    if (this.Password.hasError('required')) return 'Password is required!';
    if (this.Password.hasError('minlength'))
      return 'Minimum 8 characters are required!';
    if (this.Password.hasError('maxlength'))
      return 'Maximum 15 characters are required!';
    return '';
  }

  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get Password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}
