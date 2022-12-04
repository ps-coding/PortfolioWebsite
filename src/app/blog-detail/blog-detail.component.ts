import 'firebase/firestore';

import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app';
import { Subscription } from 'rxjs';

import { Post } from '../services/blog/post';
import { OnlineService } from '../services/internet/online.service';
import { AuthService } from './../services/authentication/auth.service';
import { PostComment } from './../services/blog/post-comment';
import { PostService } from './../services/blog/post.service';
import { ConfirmDeleteDialogService } from './../services/ui/confirm-delete-dialog.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  post?: Post | null;

  title: string = '';
  content: string = '';
  summary: string = '';
  isLoading = true;

  comment = '';

  editing = false;

  postSubscription!: Subscription;

  buttonText: string = 'Add Comment';

  timeoutReference?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private titleService: Title,
    private metaService: Meta,
    private clipboard: Clipboard,
    public auth: AuthService,
    private snackBar: MatSnackBar,
    public onlineService: OnlineService,
    private confirmDeleteDialogService: ConfirmDeleteDialogService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Prasham's Portfolio - Loading Blog");
    this.getPost();
  }

  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
    if (this.timeoutReference) {
      window.clearTimeout(this.timeoutReference);
    }
  }

  getPost() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.postSubscription = this.postService
      .getPostData(
        id,
        () => {
          this.titleService.setTitle("Prasham's Portfolio - Blog Not Found");
          this.metaService.updateTag({
            name: 'description',
            content:
              "The blog specified could not be found on Prasham Shah's portfolio website.",
          });

          if (this.post) {
            this.snackBar.open(
              'The post may have been deleted from the server',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          }

          this.post = null;
          this.isLoading = false;
        },
        () => {
          this.snackBar.open(
            'Could not retrieve post comments because of an error from the server',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );
        },
        () => {
          this.titleService.setTitle(
            "Prasham's Portfolio - Blog Not Found: Offline"
          );
          this.metaService.updateTag({
            name: 'description',
            content:
              "The blog specified could not be found on Prasham Shah's portfolio website because the user is offline.",
          });
          this.snackBar.open(
            'Could not retrieve post because your are offline',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );

          this.post = null;
          this.isLoading = false;
        }
      )
      .subscribe((data) => {
        this.titleService.setTitle("Prasham's Portfolio - Loading Blog");
        this.isLoading = true;

        if (data) {
          this.post = data as Post | null | undefined;

          if (!this.editing) {
            this.titleService.setTitle(
              `Prasham's Portfolio - Viewing Blog: ${
                this.post?.title ?? 'Unknown'
              }`
            );
          } else {
            this.titleService.setTitle(
              `Prasham's Portfolio - Editing Blog: ${
                this.post?.title ?? 'Unknown'
              }`
            );
          }
          this.metaService.updateTag({
            name: 'description',
            content: `This is the blog '${
              this.post?.title ?? 'Unknown'
            }' from Prasham Shah's portfolio website. ${
              this.post?.summary ?? 'No summary has been provided.'
            } On this page you can read the blog and leave comments.`,
          });

          this.isLoading = false;
        } else {
          this.titleService.setTitle("Prasham's Portfolio - Blog Not Found");
          this.metaService.updateTag({
            name: 'description',
            content:
              "The blog specified could not be found on Prasham Shah's portfolio website.",
          });

          if (this.post) {
            this.snackBar.open(
              'The post may have been deleted from the server',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          }

          this.post = null;
          this.isLoading = false;
        }
      });
  }

  edit() {
    this.validateEdit();

    if (
      this.post &&
      this.title.trim() &&
      (this.auth.user?.displayName || this.auth.user?.email!) &&
      this.auth.user?.uid &&
      this.content.trim() &&
      this.summary.trim()
    ) {
      const formData = {
        title: this.title.trim(),
        image: this.post?.image,
        author: this.post?.author,
        authorID: this.post?.authorID,
        content: this.content.trim(),
        summary: this.summary.trim(),
        edited: firebase.firestore.Timestamp.now(),
        published: this.post?.published,
      };

      const id = this.route.snapshot.paramMap.get('id')!;

      this.postService
        .editPost(
          id,
          formData,
          () => {
            this.titleService.setTitle(
              `Prasham's Portfolio - Viewing Blog: ${
                this.post?.title ?? 'Unknown'
              }`
            );

            this.title = this.post?.title ?? '';
            this.content = this.post?.content ?? '';
            this.summary = this.post?.summary ?? '';

            this.editing = false;
          },
          () => {
            this.snackBar.open(
              'Could not edit post because of an error from the server',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          },
          () => {
            this.snackBar.open(
              'Could not edit post because you are offline',
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
        'Could not edit post due to lack of information and/or credentials',
        'OK',
        {
          panelClass: ['snackbar', 'danger-snackbar'],
        }
      );
    }
  }

  startEdit() {
    this.titleService.setTitle(
      `Prasham's Portfolio - Editing Blog: ${this.post?.title ?? 'Unknown'}`
    );

    this.title = this.post?.title ?? '';
    this.content = this.post?.content ?? '';
    this.summary = this.post?.summary ?? '';

    this.editing = true;
  }

  cancelEdit() {
    this.title = this.post?.title ?? '';
    this.content = this.post?.content ?? '';
    this.summary = this.post?.summary ?? '';

    this.titleService.setTitle(
      `Prasham's Portfolio - Viewing Blog: ${this.post?.title ?? 'Unknown'}`
    );

    this.editing = false;
  }

  delete() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.confirmDeleteDialogService
      .openConfirmDeleteDialog('post')
      .subscribe((shouldDelete) => {
        if (shouldDelete) {
          this.postService
            .deletePost(
              id,
              () => {
                this.snackBar.open('Post data deleted', 'OK', {
                  duration: 5000,
                  panelClass: ['snackbar', 'success-snackbar'],
                });
                this.router.navigateByUrl('/blog');
              },
              () => {
                this.snackBar.open('Post image deleted', 'OK', {
                  duration: 5000,
                  panelClass: ['snackbar', 'success-snackbar'],
                });
              },
              () => {
                this.snackBar.open(
                  'Could not delete post because of an error from the server',
                  'OK',
                  {
                    panelClass: ['snackbar', 'danger-snackbar'],
                  }
                );
              },
              () => {
                this.snackBar.open(
                  'Could not delete post comments because of an error from the server',
                  'OK',
                  {
                    panelClass: ['snackbar', 'danger-snackbar'],
                  }
                );
              },
              () => {
                this.snackBar.open(
                  'Could not delete post image because of an error from the server',
                  'OK',
                  {
                    panelClass: ['snackbar', 'danger-snackbar'],
                  }
                );
              },
              () => {
                this.snackBar.open(
                  'Could not delete post because you are offline',
                  'OK',
                  {
                    panelClass: ['snackbar', 'danger-snackbar'],
                  }
                );
              }
            )
            .subscribe();
        }
      });
  }

  addComment() {
    this.validateComment();

    if (
      this.comment.trim() &&
      (this.auth.user?.displayName || this.auth.user?.email!) &&
      this.auth.user?.uid
    ) {
      const id = this.route.snapshot.paramMap.get('id')!;
      let formData = {
        author: this.auth.user?.displayName ?? this.auth.user?.email!,
        authorID: this.auth.user?.uid,
        content: this.comment,
        published: firebase.firestore.Timestamp.now(),
      };
      this.postService
        .addComment(
          id,
          formData,
          () => {
            this.comment = '';

            if (this.timeoutReference) {
              window.clearTimeout(this.timeoutReference);
            }

            this.buttonText = 'Comment Added!';
            this.timeoutReference = window.setTimeout(() => {
              this.updateButtonText();
            }, 3000);
          },
          () => {
            this.snackBar.open(
              'Could not add comment because of an error from the server',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          },
          () => {
            this.snackBar.open(
              'Could not add comment because you are offline',
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
        'Could not add comment due to lack of information and/or credentials',
        'OK',
        {
          panelClass: ['snackbar', 'danger-snackbar'],
        }
      );
    }
  }

  deleteComment(commentID: string) {
    const postID = this.route.snapshot.paramMap.get('id')!;

    this.confirmDeleteDialogService
      .openConfirmDeleteDialog('comment')
      .subscribe((shouldDelete) => {
        if (shouldDelete) {
          this.postService
            .deleteComment(
              postID,
              commentID,
              () => {},
              () => {
                this.snackBar.open(
                  'Could not delete comment because of an error from the server',
                  'OK',
                  {
                    panelClass: ['snackbar', 'danger-snackbar'],
                  }
                );
              },
              () => {
                this.snackBar.open(
                  'Could not delete comment because you are offline',
                  'OK',
                  {
                    panelClass: ['snackbar', 'danger-snackbar'],
                  }
                );
              }
            )
            .subscribe();
        }
      });
  }

  isAuthor(post?: Post | null) {
    if (post) {
      return this.auth.isAdmin && this.auth.user?.uid === post.authorID;
    } else {
      return false;
    }
  }

  isCommentAuthor(comment: PostComment) {
    return this.auth.user && this.auth.user?.uid === comment.authorID;
  }

  copy() {
    const id = this.route.snapshot.paramMap.get('id');
    const postURL = `https://shahprasham.com/blog/${id}`;

    const success = this.clipboard.copy(postURL);

    if (success) {
      this.snackBar.open(`Link copied: ${postURL}`, 'OK', {
        duration: 5000,
        panelClass: ['snackbar', 'success-snackbar'],
      });
    } else {
      this.snackBar.open('Could not copy link, try again', 'OK', {
        panelClass: ['snackbar', 'danger-snackbar'],
      });
    }
  }

  updateButtonText() {
    this.buttonText = 'Add Comment';
  }

  validateComment() {
    const commentHTML = this.sanitizer.sanitize(
      SecurityContext.HTML,
      this.comment
    );
    if (commentHTML) {
      this.comment = commentHTML.trim();
    } else {
      this.comment = '';
    }
  }

  validateEdit() {
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
