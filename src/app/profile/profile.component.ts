import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../service/share.service';
const md5 = require('md5');
const resizebase64 = require('resize-base64');
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(public router: Router, private http: HttpClient, private share: ShareService) { }
  alertSuccess = false;
  alertFailed = false;
  fileToUpload = '';
  eye0 = "fa-eye-slash";
  eye1 = "fa-eye-slash";
  eye2 = "fa-eye-slash";
  psType0 = "password";
  psType1 = "password";
  psType2 = "password";
  bCol0 = '';
  bCol1 = '';
  bCol2 = '';
  userName = "";
  fName = "";
  lName = "";
  fNameold = "";
  lNameold = "";
  flagEdit = false;
  flagEditPasst = false;
  inputControl = "inp-bh";
  switchInput = false;
  checkOldPass = false;
  checknewPass = false;
  checkRePass = false;
  oldPassword = "";
  password = "";
  srcProPart = "assets/img/";
  srcProfile = "";
  srcProfileOld = "";
  checkfname = false;
  checklname = false;
  checkdubPass = false;
  checkerr = false;
  ngOnInit(): void {
    this.http.post<any>('http://localhost:3000/login', this.share.shareDataLogin).subscribe(result => {
      if (result.length == 0) {
        this.router.navigate(['/']);
      } else {
        this.userName = result[0].username
        this.fName = result[0].fname;
        this.lName = result[0].lname;
        this.fNameold = result[0].fname;
        this.lNameold = result[0].lname;
        this.oldPassword = result[0].password;
        this.srcProfile = this.srcProPart + result[0].pic_profile;
        this.srcProfileOld = this.srcProPart + result[0].pic_profile;
      }
    })
  }
  reloadProfile() {
    this.http.post<any>('http://localhost:3000/login', this.share.shareDataLogin).subscribe(result => {
      if (result.length == 0) {
      } else {
        this.router.navigate(['/']);
        this.userName = result[0].username
        this.fName = result[0].fname;
        this.lName = result[0].lname;
        this.fNameold = result[0].fname;
        this.lNameold = result[0].lname;
        this.oldPassword = result[0].password;
        this.srcProfile = this.srcProPart + result[0].pic_profile;
        this.srcProfileOld = this.srcProPart + result[0].pic_profile;
        this.checkfname = false;
        this.checklname = false;
        this.flagEditPasst = false;
        this.flagEdit = false;
        this.checkerr = false;
        this.router.navigate(['/profile']);
      }
    })
  }
  uploadFile(x: any) {
    var data = this.fileToUpload;
    let base64String = resizebase64(data,150,150);
    let base64Image = { base64: base64String.split(';base64,').pop(), names: x };
    this.http.post<any>('http://localhost:3000/upload', base64Image).subscribe(result => {
      if(result == 'success'){
        alert('บันทึกสำเร็จ');
      }
    })
  }
  updateProfile() {
    this.checkdubPass = false;
    var username = this.userName;
    var password = (<HTMLInputElement>document.getElementById("newpass")).value;
    var repassword = (<HTMLInputElement>document.getElementById("renewpass")).value;
    var oldPassword = (<HTMLInputElement>document.getElementById("oldpass")).value;
    var fname = (<HTMLInputElement>document.getElementById("fname")).value;
    var lname = (<HTMLInputElement>document.getElementById("lname")).value;
    var filepart = (<HTMLInputElement>document.getElementById("upPicPro")).value;
    var filename = filepart.split("\\");
    var pic_profile = "";
    if (filepart == '') {
      var pic_profile = "";
    } else {
      var pic_profile = filename[2];
    }
    var count = 0;
    let data = {
      "username": username,
      "password": password,
      "oldPassword": oldPassword,
      "fname": fname,
      "lname": lname,
      "pic_profile": pic_profile,
    };
    if (oldPassword != '') {
      if (md5(oldPassword) != this.oldPassword) {
        count = 1;
        this.checkOldPass = true;
      }
    }
    if ((password == '') && (repassword == '') && (oldPassword == '')) {

    } else if ((password != '') && (repassword != '') && (oldPassword != '')) {

    } else {
      count = 1;
      if (oldPassword == '') {
        this.checkOldPass = true;
      }
      if (repassword == '') {
        this.checkRePass = true;
      }
      if (password == '') {
        this.checknewPass = true;
      }
    }
    if (this.checkRePass) {
      count = 1;
    }
    if (this.checknewPass) {
      count = 1;
    }
    if (this.checkOldPass) {
      count = 1;
    }
    if (data.fname == '') {
      count = 1;
      this.checkfname = true;
    }
    if (data.lname == '') {
      count = 1;
      this.checklname = true;
    }
    if (count == 0) {
      this.http.post<any>('http://localhost:3000/updateprofile', data).subscribe(result => {
        if (result.result == 'failed') {
          this.checkerr = true;
          this.alertFailed = true;
            setTimeout(() => {
              this.alertFailed = false;
            }, 3000);
        } else
          if (result.result == '777') {
            this.checkdubPass = true;
          } else if (result.result == "failed read") { } else {
            if(pic_profile != ''){
              this.uploadFile(pic_profile);
            }
            this.alertSuccess = true;
            setTimeout(() => {
              this.alertSuccess = false;
            }, 3000);
            this.reloadProfile();
            this.flagEditPasst = false;
            this.flagEdit = false;
            this.srcProfile = this.srcProfileOld;
            this.inputControl = "inp-bh";
          }
      })
    } else {
    }
  }
  openEditFrofile() {
    this.flagEdit = true;
    this.inputControl = "form-control";
    this.switchInput = true;
  }
  cancelEditFrofile() {
    (<HTMLInputElement>document.getElementById("fname")).value = this.fNameold;
    (<HTMLInputElement>document.getElementById("lname")).value = this.lNameold;
    this.fName = this.fNameold;
    this.lName = this.lNameold;
    this.checkfname = false;
    this.checklname = false;
    this.flagEditPasst = false;
    this.flagEdit = false;
    this.srcProfile = this.srcProfileOld;
    this.inputControl = "inp-bh";
    this.cancelEditPass()

  }
  showPass0() {
    if (this.eye0 == "fa-eye-slash") {
      this.eye0 = "fa-eye";
      this.psType0 = "text";
    } else {
      this.eye0 = "fa-eye-slash";
      this.psType0 = "password";
    }
  }
  showPass1() {
    if (this.eye1 == "fa-eye-slash") {
      this.eye1 = "fa-eye";
      this.psType1 = "text";
    } else {
      this.eye1 = "fa-eye-slash";
      this.psType1 = "password";
    }
  }

  showPass2() {
    if (this.eye2 == "fa-eye-slash") {
      this.eye2 = "fa-eye";
      this.psType2 = "text";
    } else {
      this.eye2 = "fa-eye-slash";
      this.psType2 = "password";
    }
  }
  resetAlertOldPass() {
    this.checkOldPass = false;
  }
  resetAlertNewPass() {
    this.checknewPass = false;
  }
  resetAlertReNewPass() {
    this.checkRePass = false;
  }
  checkOldPassword(event: any) {

    if (event == this.oldPassword) {
    } else {
    }
  }
  checkPassword(event: any) {
    if (event.length >= 6) {
      if (event.match(/([a-zA-Z])/) && event.match(/([0-9])/)) {
        this.bCol1 = '';
        this.checknewPass = false;
        this.password = event;
      } else {
        this.bCol1 = 'bg-red';
        this.checknewPass = true;
      }
    } else if (event.length == 0) {
      this.bCol1 = '';
      this.checknewPass = false;
      this.password = event;
    } else {
      this.bCol1 = 'bg-red';
      this.checknewPass = true;
    }
  }
  checkRePassword(event: any) {
    if (event == this.password) {
      this.bCol2 = '';
      this.checkRePass = false;
    } else {
      this.bCol2 = 'bg-red';
      this.checkRePass = true;
    }
  }
  chootFile() {
    document.getElementById("upPicPro")?.click();
  }
  changeProfile(e: any) {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.srcProfile = event.target.result;
        this.fileToUpload = event.target.result;

      }
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  toUpperF(e: any) {
    this.checkfname = false;
    if (e.length != 0) {
      this.fName = e[0].toUpperCase() + e.substring(1);

    }

  }
  toUpperL(e: any) {
    this.checklname = false;
    if (e.length != 0) {
      this.lName = e[0].toUpperCase() + e.substring(1);
    }
  }
  flagEditPass() {
    this.flagEditPasst = true;
  }

  cancelEditPass() {
    this.flagEditPasst = false;
    (<HTMLInputElement>document.getElementById("newpass")).value = '';
    (<HTMLInputElement>document.getElementById("renewpass")).value = '';
    (<HTMLInputElement>document.getElementById("oldpass")).value = '';
    this.psType0 = "password";
    this.psType1 = "password";
    this.psType2 = "password";
    this.bCol0 = '';
    this.bCol1 = '';
    this.bCol2 = '';
    this.checkOldPass = false;
    this.checknewPass = false;
    this.checkRePass = false;
    this.eye0 = "fa-eye-slash";
    this.eye1 = "fa-eye-slash";
    this.eye2 = "fa-eye-slash";
  }
}
