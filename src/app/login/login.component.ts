import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../service/share.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(public router: Router, private http: HttpClient,private share:ShareService) { }
  // constructor(private http: HttpClient){}
  ngOnInit(): void {
    this.processLogout();
  }
  loged = false;
  eye = "fa-eye-slash";
  psType = "password";
  username = "";
  password = "";
  checkLogin = false;
  result:any;
  showPass() {
    if (this.eye == "fa-eye-slash") {
      this.eye = "fa-eye";
      this.psType = "text";
    } else {
      this.eye = "fa-eye-slash";
      this.psType = "password";
    }
  }
  processLogout() {
    (<HTMLInputElement>document.getElementById("usernameLog")).value = '';
    (<HTMLInputElement>document.getElementById("passwordLog")).value = '';
    this.loged = false;
    this.eye = "fa-eye-slash";
    this.psType = "password";
    this.username = "";
    this.password = "";
    this.checkLogin = false;
    this.router.navigate(["/"]);
  }
  processLogin() {
    this.checkLogin = false;
    var username = (<HTMLInputElement>document.getElementById("usernameLog")).value;
    var password = (<HTMLInputElement>document.getElementById("passwordLog")).value;
    let data = {
      "username": username,
      "password": password
    };
    this.http.post<any>('http://localhost:3000/login', data).subscribe(result => {
      // alert(JSON.stringify(result));
      if(result.length == 0){
        this.checkLogin = true;
        // alert('เข้าสู่ระบบล้มเหลว กรุณาลงใหม่อีกครั้ง!');
      }else{
        this.loged = true;
        this.result = result
        // console.log(result);
        this.share.shareDataLogin = data;
        this.router.navigate(["/profile"]);
      }


    })
  }
}
