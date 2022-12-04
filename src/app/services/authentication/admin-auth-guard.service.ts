import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    return this.isAdmin().pipe(
      mergeMap((isAdmin) => {
        return this.isSuperadmin().pipe(
          map((isSuperadmin) => {
            if (isAdmin || isSuperadmin) {
              return true;
            } else {
              this.router.navigateByUrl('');
              return false;
            }
          })
        );
      })
    );
  }

  isAdmin() {
    return this.auth.adminCollection.snapshotChanges().pipe(
      map((actions) => {
        if (this.auth.user) {
          let adminValue = false;

          actions.map((action) => {
            const adminUID = action.payload.doc.id;
            const adminEmail = action.payload.doc.data().email;

            if (
              adminUID === this.auth.user?.uid &&
              adminEmail === this.auth.user?.email
            ) {
              adminValue = true;
            }
          });

          return adminValue;
        } else {
          return false;
        }
      })
    );
  }

  isSuperadmin() {
    return this.auth.superadminCollection.snapshotChanges().pipe(
      map((actions) => {
        if (this.auth.user) {
          let superadminValue = false;

          actions.map((action) => {
            const superadminUID = action.payload.doc.id;
            const superadminEmail = action.payload.doc.data().email;

            if (
              superadminUID === this.auth.user?.uid &&
              superadminEmail === this.auth.user?.email
            ) {
              superadminValue = true;
            }
          });

          return superadminValue;
        } else {
          return false;
        }
      })
    );
  }
}
