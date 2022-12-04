import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';

import { OnlineService } from './../internet/online.service';
import { Post } from './post';
import { PostComment } from './post-comment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  postsCollection: AngularFirestoreCollection<Post>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private onlineService: OnlineService
  ) {
    this.postsCollection = this.afs.collection('posts', (ref) =>
      ref.orderBy('published', 'desc')
    );
  }

  getPosts(errorCallback: Function, offlineCallback: Function) {
    return this.onlineService.isOnline.pipe(
      mergeMap((online) => {
        if (online) {
          return this.postsCollection.snapshotChanges().pipe(
            map((actions) => {
              if (online) {
                return actions.map((object) => {
                  const data = object.payload.doc.data() as Post;
                  const id = object.payload.doc.id;

                  return { ...data, id } as Post;
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

  getComments(id: string, errorCallback: Function, offlineCallback: Function) {
    const commentsCollection = this.getPost(id).collection<PostComment>(
      'comments',
      (ref) => ref.orderBy('published', 'desc')
    );

    return this.onlineService.isOnline.pipe(
      mergeMap((online) => {
        if (online) {
          return commentsCollection.snapshotChanges().pipe(
            map((actions) => {
              if (online) {
                return actions.map((object) => {
                  const data = object.payload.doc.data() as PostComment;
                  const id = object.payload.doc.id;

                  return { ...data, id } as PostComment;
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

  getPost(id: string) {
    return this.afs.doc<Post>(`posts/${id}`);
  }

  getComment(postID: string, commentID: string) {
    return this.afs.doc<Post>(`posts/${postID}/comments/${commentID}`);
  }

  getPostData(
    id: string,
    errorCallback: Function,
    commentErrorCallback: Function,
    offlineCallback: Function
  ) {
    const postDocument = this.getPost(id);

    return this.onlineService.isOnline.pipe(
      mergeMap((online) => {
        if (online) {
          return postDocument.snapshotChanges().pipe(
            mergeMap((object) => {
              if (online) {
                const data = object.payload.data();
                const id = object.payload.id;

                return this.getComments(
                  id,
                  commentErrorCallback,
                  offlineCallback
                ).pipe(
                  map((comments) => {
                    if (online) {
                      const post = { ...data, id, comments } as Post;
                      return post;
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

  createPost(
    data: Post,
    successCallback: Function,
    errorCallback: Function,
    offlineCallback: Function
  ) {
    return this.onlineService.isOnline.pipe(
      take(1),
      map((online) => {
        if (online) {
          this.postsCollection
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

  editPost(
    id: string,
    data: Post,
    successCallback: Function,
    errorCallback: Function,
    offlineCallback: Function
  ) {
    return this.onlineService.isOnline.pipe(
      take(1),
      map((online) => {
        if (online) {
          this.getPost(id)
            .update(data)
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

  deletePost(
    id: string,
    successCallback: Function,
    successImageCallback: Function,
    errorCallback: Function,
    errorCommentCallback: Function,
    errorImageCallback: Function,
    offlineCallback: Function
  ) {
    return this.onlineService.isOnline.pipe(
      take(1),
      mergeMap((online) => {
        if (online) {
          return this.getPost(id)
            .get()
            .pipe(
              map((snapshot) => {
                if (online) {
                  const post = snapshot.data() as Post;
                  const postImage = post?.image!;

                  this.deleteImageFromURL(
                    postImage,
                    errorImageCallback,
                    offlineCallback
                  ).subscribe(() => {
                    successImageCallback();
                  });
                  this.deletePostFromDatabase(
                    id,
                    errorCallback,
                    errorCommentCallback,
                    offlineCallback
                  ).subscribe(() => {
                    successCallback();
                  });
                } else {
                  offlineCallback();
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

  deletePostFromDatabase(
    id: string,
    errorCallback: Function,
    errorCommentCallback: Function,
    offlineCallback: Function
  ) {
    return this.onlineService.isOnline.pipe(
      take(1),
      mergeMap((online) => {
        if (online) {
          return this.getPost(id)
            .collection<PostComment>('comments')
            .get()
            .pipe(
              map((snapshot) => {
                if (online) {
                  if (snapshot && !snapshot.empty) {
                    snapshot.forEach((document) => {
                      document.ref.delete().catch(() => {
                        errorCommentCallback();
                      });
                    });
                  }

                  this.getPost(id)
                    .delete()
                    .catch(() => {
                      errorCallback();
                    });
                } else {
                  offlineCallback();
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

  deleteImageFromURL(
    imageURL: string,
    errorCallback: Function,
    offlineCallback: Function
  ) {
    try {
      const imageReference = this.storage.refFromURL(imageURL);

      return this.onlineService.isOnline.pipe(
        take(1),
        mergeMap((online) => {
          if (online) {
            return imageReference.delete().pipe(
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
    } catch {
      errorCallback();
      return of(null);
    }
  }

  addComment(
    id: string,
    data: PostComment,
    successCallback: Function,
    errorCallback: Function,
    offlineCallback: Function
  ) {
    return this.onlineService.isOnline.pipe(
      take(1),
      map((online) => {
        if (online) {
          this.getPost(id)
            .collection('comments')
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

  deleteComment(
    postID: string,
    commentID: string,
    successCallback: Function,
    errorCallback: Function,
    offlineCallback: Function
  ) {
    return this.onlineService.isOnline.pipe(
      take(1),
      map((online) => {
        if (online) {
          this.getComment(postID, commentID)
            .delete()
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
}
