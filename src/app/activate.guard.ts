import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataserviceService } from './dataservice.service';

@Injectable({
  providedIn: 'root'
})
export class ActivateGuard implements CanActivate {
  constructor(private dataservice: DataserviceService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.dataservice.isLoggedIn("dfdf", "ff")){
      return true;
    }
    else{
      alert("dont have permission");
      this.router.navigate(['login'])
    }
     
  }
  
}
