import 'firebase/auth';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';

import { OnlineService } from './../internet/online.service';
import { Admin } from './admin';
import { Superadmin } from './superadmin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  adminCollection!: AngularFirestoreCollection<Admin>;
  superadminCollection!: AngularFirestoreCollection<Superadmin>;
  user?: firebase.User | null;
  isAdmin = false;
  isSuperadmin = false;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private onlineService: OnlineService
  ) {
    this.adminCollection = this.afs.collection('admins', (ref) =>
      ref.orderBy('email', 'asc')
    );
    this.superadminCollection = this.afs.collection('superadmins', (ref) =>
      ref.orderBy('email', 'asc')
    );

    this.check();
  }

  check() {
    this.afAuth.authState.subscribe(
      (user) => {
        this.user = user;
        this.adminCheck(user?.uid, user?.email);
        this.superadminCheck(user?.uid, user?.email);
      },
      () => {
        this.user = null;
        this.isAdmin = false;
        this.isSuperadmin = false;
      }
    );
  }

  adminCheck(uid?: string | null, email?: string | null) {
    this.getAdmins(
      () => {
        this.isAdmin = false;
      },
      () => {
        this.isAdmin = false;
      }
    ).subscribe((admins) => {
      if (admins) {
        if (uid && email) {
          this.isAdmin = admins.some((admin) => {
            return admin.id === uid && admin.email === email;
          });
        } else {
          this.isAdmin = false;
        }
      } else {
        this.isAdmin = false;
      }
    });
  }

  superadminCheck(uid?: string | null, email?: string | null) {
    this.getSuperadmins(
      () => {
        this.isSuperadmin = false;
      },
      () => {
        this.isSuperadmin = false;
      }
    ).subscribe((superadmins) => {
      if (superadmins) {
        if (uid && email) {
          this.isSuperadmin = superadmins.some((superadmin) => {
            return superadmin.id === uid && superadmin.email === email;
          });
        } else {
          this.isSuperadmin = false;
        }
      } else {
        this.isSuperadmin = false;
      }
    });
  }

  getAdmins(errorCallback: Function, offlineCallback: Function) {
    return this.onlineService.isOnline.pipe(
      mergeMap((online) => {
        if (online) {
          return this.adminCollection.snapshotChanges().pipe(
            map((actions) => {
              if (online) {
                return actions.map((object) => {
                  const id = object.payload.doc.id;
                  const data = object.payload.doc.data();

                  return { ...data, id } as Admin;
                });
              } else {
                offlineCallback();
                return null;
              }
            }),
            catchError(() => {
              errorCallback();
              return of(null);
            })
          );
        } else {
          offlineCallback();
          return of(null);
        }
      }),
      catchError(() => {
        offlineCallback();
        return of(null);
      })
    );
  }

  getSuperadmins(errorCallback: Function, offlineCallback: Function) {
    return this.onlineService.isOnline.pipe(
      mergeMap((online) => {
        if (online) {
          return this.superadminCollection.snapshotChanges().pipe(
            map((actions) => {
              if (online) {
                return actions.map((object) => {
                  const id = object.payload.doc.id;
                  const data = object.payload.doc.data();

                  return { ...data, id } as Superadmin;
                });
              } else {
                offlineCallback();
                return null;
              }
            }),
            catchError(() => {
              errorCallback();
              return of(null);
            })
          );
        } else {
          offlineCallback();
          return of(null);
        }
      }),
      catchError(() => {
        offlineCallback();
        return of(null);
      })
    );
  }

  getAdmin(id: string) {
    return this.afs.doc<Admin>(`admins/${id}`);
  }

  addAdmin(
    uid: string,
    data: Admin,
    successCallback: Function,
    errorCallback: Function,
    offlineCallback: Function
  ) {
    return this.onlineService.isOnline.pipe(
      take(1),
      map((online) => {
        if (online) {
          this.adminCollection
            .doc(uid)
            .set(data)
            .then(() => {
              successCallback();
            })
            .catch(() => {
              errorCallback();
            });
        } else {
          offlineCallback();
        }
      }),
      catchError(() => {
        offlineCallback();
        return of(null);
      })
    );
  }

  deleteAdmin(id: string, errorCallback: Function, offlineCallback: Function) {
    return this.onlineService.isOnline.pipe(
      take(1),
      map((online) => {
        if (online) {
          this.getAdmin(id)
            .delete()
            .catch(() => {
              errorCallback();
            });
        } else {
          offlineCallback();
        }
      }),
      catchError(() => {
        offlineCallback();
        return of(null);
      })
    );
  }

  login(errorCallback: Function) {
    this.afAuth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(() => {
        errorCallback();
      });
  }

  logout(errorCallback: Function) {
    this.afAuth.signOut().catch(() => {
      errorCallback();
    });

    if (this.router.url === '/blog/new' || this.router.url === '/admins') {
      this.router.navigateByUrl('');
    }
  }
}
