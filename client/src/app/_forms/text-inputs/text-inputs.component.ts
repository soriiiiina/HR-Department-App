import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-inputs',
  templateUrl: './text-inputs.component.html',
  styleUrls: ['./text-inputs.component.css']
})
export class TextInputsComponent implements ControlValueAccessor {

  @Input() label!: string; 
  @Input() type = 'defaultText';
   

  constructor(@Self() public ngControl: NgControl) { 
    this.ngControl.valueAccessor = this;
  }


  //Interface ControlValueAccessor --> we dont need them 
  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

    
}
