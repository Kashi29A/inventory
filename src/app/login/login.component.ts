import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  uname: string;
  psw: string;
  fname: string;
  lname: string;
  currentRole: string;
  roles: any[]
  submitted: boolean;
  constructor(private dataservice: DataserviceService) { }

  ngOnInit(): void {
    this.roles = [
      {label: "Admin", value: "admin"},
      {label: "User", value: "user"}
    ]
  }

  login(e){
    console.log(this.uname)
    console.log(this.psw)
    this.submitted = true;
    this.dataservice.isLoggedIn(this.fname, this.lname, this.currentRole, this.uname, this.psw).subscribe((data)=>{
      console.log(data)
    })
  }
}
