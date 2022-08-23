import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginregisterService } from 'src/app/_services/loginregister.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  registerForm!: FormGroup;
  validationErrors: string[] = [];

  constructor(private loginRegisterService: LoginregisterService, 
    private toastr: ToastrService, private formBuilderService: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  

  initializeForm() {
    this.registerForm = this.formBuilderService.group({
      username: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      faculty: ['', Validators.required],
      statusOrQuote: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchPasswordsValues('password')]]
    })
  }



  matchPasswordsValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl | any) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null : { isMatching: true };
    }
  }


  register() {
    this.loginRegisterService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/dashboard');
    }, error => {
      this.validationErrors = error;
    })
  }

  cancel() {
    //our cancel button will emit false
    this.cancelRegister.emit(false);
  }

}
