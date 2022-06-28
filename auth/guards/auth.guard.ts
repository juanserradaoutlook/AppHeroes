import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor (private authService: AuthService,
              private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
      return this.authService.verificaAutenticacion()
        .pipe(
          tap( estaAutenticado => {
            if (!estaAutenticado) {
              this.router.navigate(['./auth/login']);
            }
          })
        )

    //   console.log('canActivate', true);
    //   console.log(route);
    //   console.log(state);
      
    //   if (this.authService.auth.id) {
    //     return true;
    //   }
    // console.log('Bloqueado por el canActivate');
    
    // return false;
  }
  
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    
      return this.authService.verificaAutenticacion()
      .pipe(
        tap( estaAutenticado => {
          if (!estaAutenticado) {
            this.router.navigate(['./auth/login']);
          }
        })
      )
    // console.log('canLoad', true);
    // console.log(route);
    // console.log(segments);
    
    // if (this.authService.auth.id) {
    //   return true;
    // }
    
    // console.log('Bloqueado por el canLoad');
    //  return false;
  }
}
