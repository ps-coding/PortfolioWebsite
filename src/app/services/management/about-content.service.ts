import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';

import { OnlineService } from '../internet/online.service';
import { Achievement } from './achievement';
import { Hobby } from './hobby';

@Injectable({
  providedIn: 'root',
})
export class AboutContentService {
  achievementCollection: AngularFirestoreCollection<Achievement>;
  hobbyCollection: AngularFirestoreCollection<Hobby>;

  constructor(
    private afs: AngularFirestore,
    private onlineService: OnlineService
  ) {
    this.achievementCollection = afs.collection('achievements', (ref) =>
      ref.orderBy('category', 'asc')
    );
    this.hobbyCollection = afs.collection('hobbies', (ref) =>
      ref.orderBy('category', 'asc')
    );
  }
  getAchievements(errorCallback: Function, offlineCallback: Function) {
    return this.onlineService.isOnline.pipe(
      mergeMap((online) => {
        if (online) {
          return this.achievementCollection.snapshotChanges().pipe(
            map((actions) => {
              if (online) {
                return actions.map((object) => {
                  const id = object.payload.doc.id;
                  const data = object.payload.doc.data();

                  return { ...data, id } as Achievement;
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

  getHobbies(errorCallback: Function, offlineCallback: Function) {
    return this.onlineService.isOnline.pipe(
      mergeMap((online) => {
        if (online) {
          return this.hobbyCollection.snapshotChanges().pipe(
            map((actions) => {
              if (online) {
                return actions.map((object) => {
                  const id = object.payload.doc.id;
                  const data = object.payload.doc.data();

                  return { ...data, id } as Hobby;
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

  getAchievement(id: string) {
    return this.afs.doc<Achievement>(`achievements/${id}`);
  }

  getHobby(id: string) {
    return this.afs.doc<Hobby>(`hobbies/${id}`);
  }

  addAchievement(
    data: Achievement,
    successCallback: Function,
    errorCallback: Function,
    offlineCallback: Function
  ) {
    return this.onlineService.isOnline.pipe(
      take(1),
      map((online) => {
        if (online) {
          this.achievementCollection
            .add(data)
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

  addHobby(
    data: Achievement,
    successCallback: Function,
    errorCallback: Function,
    offlineCallback: Function
  ) {
    return this.onlineService.isOnline.pipe(
      take(1),
      map((online) => {
        if (online) {
          this.hobbyCollection
            .add(data)
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

  deleteAchievement(
    id: string,
    errorCallback: Function,
    offlineCallback: Function
  ) {
    return this.onlineService.isOnline.pipe(
      take(1),
      map((online) => {
        if (online) {
          this.getAchievement(id)
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

  deleteHobby(id: string, errorCallback: Function, offlineCallback: Function) {
    return this.onlineService.isOnline.pipe(
      take(1),
      map((online) => {
        if (online) {
          this.getHobby(id)
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
}
