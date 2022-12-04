import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SuperadminAuthGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    return this.isSuperadmin().pipe(
      map((isSuperadmin) => {
        if (isSuperadmin) {
          return true;
        } else {
          this.router.navigateByUrl('');
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
