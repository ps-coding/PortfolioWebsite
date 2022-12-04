import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { OnlineService } from '../services/internet/online.service';
import { AuthService } from './../services/authentication/auth.service';
import { Post } from './../services/blog/post';
import { PostService } from './../services/blog/post.service';
import { ConfirmDeleteDialogService } from './../services/ui/confirm-delete-dialog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css'],
})
export class BlogListComponent implements OnInit, OnDestroy {
  originalPosts!: Post[];
  postsToDisplay!: Post[];

  titleFilter = '';
  contentFilter = '';
  summaryFilter = '';

  postsSubscription!: Subscription;

  constructor(
    private postService: PostService,
    public auth: AuthService,
    private titleService: Title,
    private metaService: Meta,
    private snackBar: MatSnackBar,
    public onlineService: OnlineService,
    private confirmDeleteDialogService: ConfirmDeleteDialogService
  ) {}

  ngOnInit(): void {
    this.postsSubscription = this.postService
      .getPosts(
        () => {
          this.snackBar.open(
            'Could not retrieve posts because of an error from the server',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );
        },
        () => {
          this.snackBar.open(
            'Could not retrieve posts because your are offline',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );
        }
      )
      .subscribe((posts) => {
        if (posts != null) {
          this.originalPosts = posts;
          this.filter();
        } else {
          this.originalPosts = [];
          this.filter();
        }
      });

    this.titleService.setTitle("Prasham's Portfolio - Blogs");
    this.metaService.updateTag({
      name: 'description',
      content:
        "This is the blog page of Prasham Shah's portfolio website. On this page you can view all of his blogs and click a blog to read it.",
    });
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  delete(id: string) {
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

  isAuthor(post: Post) {
    if (this.auth.user) {
      return this.auth.isAdmin && this.auth.user?.uid === post.authorID;
    } else {
      return false;
    }
  }

  filter() {
    this.postsToDisplay = this.originalPosts.filter((post) => {
      return (
        post.title.toLowerCase().includes(this.titleFilter.toLowerCase()) &&
        post.content.toLowerCase().includes(this.contentFilter.toLowerCase()) &&
        post.summary.toLowerCase().includes(this.summaryFilter.toLowerCase())
      );
    });
  }

  clearTitleFilter() {
    this.titleFilter = '';
    this.filter();
  }

  clearContentFilter() {
    this.contentFilter = '';
    this.filter();
  }

  clearSummaryFilter() {
    this.summaryFilter = '';
    this.filter();
  }
}
