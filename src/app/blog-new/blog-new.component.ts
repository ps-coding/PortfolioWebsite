import 'firebase/firestore';

import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import firebase from 'firebase/app';
import * as moment from 'moment';
import { Observable, of, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { OnlineService } from '../services/internet/online.service';
import { AuthService } from './../services/authentication/auth.service';
import { Post } from './../services/blog/post';
import { PostService } from './../services/blog/post.service';

@Component({
  selector: 'app-blog-new',
  templateUrl: './blog-new.component.html',
  styleUrls: ['./blog-new.component.css'],
})
export class BlogNewComponent implements OnInit, OnDestroy {
  title = '';
  image!: string;
  summary = '';
  content = '';
  imageWasPreviouslyUploaded = false;
  imagePreviouslyUploaded!: string;
  buttonText: string = 'Create Post';
  uploadPercent!: Observable<number>;
  downloadURL!: Observable<string>;
  imageValue!: string;

  downloadSubscription!: Subscription;

  timeoutReference?: number;

  constructor(
    public auth: AuthService,
    private postService: PostService,
    private storage: AngularFireStorage,
    private titleService: Title,
    private metaService: Meta,
    private snackBar: MatSnackBar,
    public onlineService: OnlineService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Prasham's Portfolio - New Blog");
    this.metaService.updateTag({
      name: 'description',
      content:
        "This is the new blog page of Prasham Shah's portfolio website. On this page he creates new blogs. If anyone besides him tries to access this page, he or she will be redirected back to the home page.",
    });
  }

  ngOnDestroy(): void {
    if (this.downloadSubscription) {
      this.downloadSubscription.unsubscribe();
    }

    if (this.imageWasPreviouslyUploaded) {
      this.postService
        .deleteImageFromURL(
          this.imagePreviouslyUploaded,
          () => {
            this.snackBar.open(
              'Could not delete previous post image because of an error from the server',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          },
          () => {
            this.snackBar.open(
              'Could not delete previous post image because you are offline',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          }
        )
        .subscribe();
    }
    if (this.timeoutReference) {
      window.clearTimeout(this.timeoutReference);
    }
  }

  createPost() {
    this.validateInput();

    if (
      this.title.trim() &&
      this.image &&
      (this.auth.user?.displayName || this.auth.user?.email!) &&
      this.auth.user?.uid &&
      this.content.trim() &&
      this.summary.trim()
    ) {
      const data: Post = {
        title: this.title.trim(),
        image: this.image,
        author: this.auth.user?.displayName ?? this.auth.user?.email!,
        authorID: this.auth.user?.uid,
        content: this.content.trim(),
        summary: this.summary.trim(),
        published: firebase.firestore.Timestamp.now(),
      };
      this.postService
        .createPost(
          data,
          () => {
            this.title = '';
            this.content = '';
            this.summary = '';
            this.image = '';
            this.imageValue = '';
            this.imagePreviouslyUploaded = '';
            this.imageWasPreviouslyUploaded = false;

            this.uploadPercent = of(0);

            this.buttonText = 'Post Created!';

            if (this.timeoutReference) {
              window.clearTimeout(this.timeoutReference);
            }

            this.timeoutReference = window.setTimeout(() => {
              this.updateButtonText();
            }, 3000);
          },
          () => {
            this.snackBar.open(
              'Could not create post because of an error from the server',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          },
          () => {
            this.snackBar.open(
              'Could not create post because you are offline',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          }
        )
        .subscribe();
    } else {
      this.snackBar.open(
        'Could not create post due to lack of information and/or credentials',
        'OK',
        {
          panelClass: ['snackbar', 'danger-snackbar'],
        }
      );
    }
  }

  async uploadImage(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files![0];
    if (file.type.split('/')[0] === 'image') {
      if (this.imageWasPreviouslyUploaded) {
        const previousImage = this.imagePreviouslyUploaded;

        this.postService
          .deleteImageFromURL(
            this.imagePreviouslyUploaded,
            () => {
              this.imagePreviouslyUploaded = previousImage;
              this.snackBar.open(
                'Could not delete previous post image because of an error from the server',
                'OK',
                {
                  panelClass: ['snackbar', 'danger-snackbar'],
                }
              );
            },
            () => {
              this.imagePreviouslyUploaded = previousImage;
              this.snackBar.open(
                'Could not delete previous post image because you are offline',
                'OK',
                {
                  panelClass: ['snackbar', 'danger-snackbar'],
                }
              );
            }
          )
          .subscribe();
        this.imagePreviouslyUploaded = '';
      }

      this.image = '';

      const path = `posts/${uuid()}-${moment.now()}-${file.name}`;
      const task = this.storage.upload(path, file);
      const reference = this.storage.ref(path);
      this.uploadPercent = task.percentageChanges() as Observable<number>;

      try {
        await task;
      } catch {
        this.snackBar.open(
          'Could not upload image because of an error from the server',
          'OK',
          {
            panelClass: ['snackbar', 'danger-snackbar'],
          }
        );
        return;
      }
      this.downloadURL = reference.getDownloadURL();

      this.downloadSubscription = this.downloadURL.subscribe(
        (url) => {
          this.image = url;
          this.imagePreviouslyUploaded = this.image;
          this.imageWasPreviouslyUploaded = true;
        },
        () => {
          this.snackBar.open(
            'Could not get URL of image because of an error from the server',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );
        }
      );
    } else {
      this.image = '';
      this.imageValue = '';
      this.snackBar.open('Please upload an image', 'OK', {
        panelClass: ['snackbar', 'danger-snackbar'],
      });
    }
  }

  updateButtonText() {
    this.buttonText = 'Create Post';
  }

  validateInput() {
    const titleHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.title);
    if (titleHTML) {
      this.title = titleHTML.trim();
    } else {
      this.title = '';
    }

    const contentHTML = this.sanitizer.sanitize(
      SecurityContext.HTML,
      this.content
    );
    if (contentHTML) {
      this.content = contentHTML.trim();
    } else {
      this.content = '';
    }

    const summaryHTML = this.sanitizer.sanitize(
      SecurityContext.HTML,
      this.summary
    );
    if (summaryHTML) {
      this.summary = summaryHTML.trim();
    } else {
      this.summary = '';
    }
  }
}
