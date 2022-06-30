import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { LoginregisterService } from '../_services/loginregister.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  constructor(private loginRegisterService: LoginregisterService) { }

  ngOnInit(): void {
  }

  register() {
    this.loginRegisterService.register(this.model).subscribe(response => {
      console.log(response);
      this.cancel();
    }, error => {
      console.log(error);
    })
  }

  cancel() {
    //our cancel button will emit false
    this.cancelRegister.emit(false);
  }

}
