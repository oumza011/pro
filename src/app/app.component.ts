import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BuildProfile';
  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    // let data = { "username": "oumod011", "feedback": "i love oumod" };
    // this.http.post<any>('http://localhost:3000/login', data).subscribe(result=>{
      // alert(JSON.stringify(result));
    // })
  }
}
