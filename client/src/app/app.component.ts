import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'HR Department App';
  hrusers : any;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.getHRUsers();
  }

  getHRUsers() {
    this.httpClient.get('https://localhost:5001/api/hrusers').subscribe(data => {
      this.hrusers = data; 
    }, error => {
      console.log(error);
    })
  }


}
