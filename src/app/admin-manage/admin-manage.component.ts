import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { Admin } from '../services/authentication/admin';
import { OnlineService } from '../services/internet/online.service';
import { AboutContentService } from '../services/management/about-content.service';
import { Achievement } from '../services/management/achievement';
import { Hobby } from '../services/management/hobby';
import { AuthService } from './../services/authentication/auth.service';
import { ConfirmDeleteDialogService } from './../services/ui/confirm-delete-dialog.service';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.css'],
})
export class AdminManageComponent implements OnInit, OnDestroy {
  email: string = '';
  uid: string = '';

  achievementCategory: string = '';
  achievementContent: string = '';

  hobbyCategory: string = '';
  hobbyContent: string = '';

  adminButtonText: string = 'Add Admin';
  achievementButtonText: string = 'Add Achievement';
  hobbyButtonText: string = 'Add Hobby';

  admins!: Admin[];
  achievements!: Achievement[];
  hobbies!: Hobby[];

  achievementCategories!: string[];
  hobbyCategories!: string[];

  adminSubscription!: Subscription;
  achievementSubscription!: Subscription;
  hobbySubscription!: Subscription;

  isLoadingAdmins = true;
  isLoadingAchievements = true;
  isLoadingHobbies = true;

  timeoutReference?: number;

  constructor(
    public auth: AuthService,
    private aboutContentService: AboutContentService,
    private titleService: Title,
    private metaService: Meta,
    private snackBar: MatSnackBar,
    public onlineService: OnlineService,
    private confirmDeleteDialogService: ConfirmDeleteDialogService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Prasham's Portfolio - Admins");
    this.metaService.updateTag({
      name: 'description',
      content:
        "This is the admin page of Prasham Shah's portfolio website. On this page he manages the website. If anyone besides him tries to access this page, he or she will be redirected back to the home page.",
    });
    this.adminSubscription = this.auth
      .getAdmins(
        () => {
          this.snackBar.open(
            'Could not retrieve admins because of an error from the server',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );
          this.admins = [];
          this.isLoadingAdmins = false;
        },
        () => {
          this.snackBar.open(
            'Could not retrieve admins because you are offline',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );
          this.admins = [];
          this.isLoadingAdmins = false;
        }
      )
      .subscribe((admins) => {
        if (admins != null) {
          this.admins = admins;
          this.isLoadingAdmins = false;
        } else {
          this.admins = [];
          this.isLoadingAdmins = false;
        }
      });

    this.achievementSubscription = this.aboutContentService
      .getAchievements(
        () => {
          this.snackBar.open(
            'Could not retrieve achievements because of an error from the server',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );
          this.achievements = [];
          this.achievementCategories = [];
          this.isLoadingAchievements = false;
        },
        () => {
          this.snackBar.open(
            'Could not retrieve achievements because you are offline',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );
          this.achievements = [];
          this.achievementCategories = [];
          this.isLoadingAchievements = false;
        }
      )
      .subscribe((achievements) => {
        if (achievements != null) {
          this.achievements = achievements;
          this.achievementCategories = Array.from(
            new Set(achievements.map((achievement) => achievement.category))
          );
          this.isLoadingAchievements = false;
        } else {
          this.achievements = [];
          this.isLoadingAchievements = false;
        }
      });

    this.hobbySubscription = this.aboutContentService
      .getHobbies(
        () => {
          this.snackBar.open(
            'Could not retrieve hobbies because of an error from the server',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );
          this.hobbies = [];
          this.hobbyCategories = [];
          this.isLoadingHobbies = false;
        },
        () => {
          this.snackBar.open(
            'Could not retrieve hobbies because you are offline',
            'OK',
            {
              panelClass: ['snackbar', 'danger-snackbar'],
            }
          );
          this.hobbies = [];
          this.hobbyCategories = [];
          this.isLoadingHobbies = false;
        }
      )
      .subscribe((hobbies) => {
        if (hobbies != null) {
          this.hobbies = hobbies;
          this.hobbyCategories = Array.from(
            new Set(hobbies.map((hobby) => hobby.category))
          );
          this.isLoadingHobbies = false;
        } else {
          this.hobbies = [];
          this.hobbyCategories = [];
          this.isLoadingHobbies = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.adminSubscription) {
      this.adminSubscription.unsubscribe();
    }
    if (this.achievementSubscription) {
      this.achievementSubscription.unsubscribe();
    }
    if (this.hobbySubscription) {
      this.hobbySubscription.unsubscribe();
    }
    if (this.timeoutReference) {
      window.clearTimeout(this.timeoutReference);
    }
  }

  addAdmin() {
    this.trim();

    const emailIsValid =
      /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/.test(
        this.email.trim()
      );

    if (this.uid.trim() && this.email.trim() && emailIsValid) {
      const buttonText: string = this.uidExists()
        ? 'Admin Updated!'
        : 'Admin Added!';

      const data: Admin = { email: this.email.trim() };

      this.auth
        .addAdmin(
          this.uid.trim(),
          data,
          () => {
            if (this.timeoutReference) {
              window.clearTimeout(this.timeoutReference);
              this.updateAdminButtonText();
              this.updateAchievementButtonText();
              this.updateHobbyButtonText();
            }
            this.timeoutReference = window.setTimeout(() => {
              this.updateAdminButtonText();
              this.updateAchievementButtonText();
              this.updateHobbyButtonText();
            }, 3000);

            this.uid = '';
            this.email = '';
            this.adminButtonText = buttonText;
          },
          () => {
            this.snackBar.open(
              'Could not add admin because of an error from the server',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          },
          () => {
            this.snackBar.open(
              'Could not add admin because your are offline',
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
        'Could not add admin due a to lack of information and/or invalid input',
        'OK',
        {
          panelClass: ['snackbar', 'danger-snackbar'],
        }
      );
    }
  }

  addAchievement() {
    this.trim();

    if (this.achievementCategory.trim() && this.achievementContent.trim()) {
      const buttonText: string = 'Achievement Added!';

      const data: Achievement = {
        category: this.achievementCategory.trim(),
        content: this.achievementContent.trim(),
      };

      this.aboutContentService
        .addAchievement(
          data,
          () => {
            if (this.timeoutReference) {
              window.clearTimeout(this.timeoutReference);
              this.updateAdminButtonText();
              this.updateAchievementButtonText();
              this.updateHobbyButtonText();
            }
            this.timeoutReference = window.setTimeout(() => {
              this.updateAdminButtonText();
              this.updateAchievementButtonText();
              this.updateHobbyButtonText();
            }, 3000);

            this.achievementCategory = '';
            this.achievementContent = '';
            this.achievementButtonText = buttonText;
          },
          () => {
            this.snackBar.open(
              'Could not add achievement because of an error from the server',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          },
          () => {
            this.snackBar.open(
              'Could not add achievement because your are offline',
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
        'Could not add achievement due a to lack of information and/or invalid input',
        'OK',
        {
          panelClass: ['snackbar', 'danger-snackbar'],
        }
      );
    }
  }

  addHobby() {
    this.trim();

    if (this.hobbyCategory.trim() && this.hobbyContent.trim()) {
      const buttonText: string = 'Hobby Added!';

      const data: Hobby = {
        category: this.hobbyCategory.trim(),
        content: this.hobbyContent.trim(),
      };

      this.aboutContentService
        .addHobby(
          data,
          () => {
            if (this.timeoutReference) {
              window.clearTimeout(this.timeoutReference);
              this.updateAdminButtonText();
              this.updateAchievementButtonText();
              this.updateHobbyButtonText();
            }
            this.timeoutReference = window.setTimeout(() => {
              this.updateAdminButtonText();
              this.updateAchievementButtonText();
              this.updateHobbyButtonText();
            }, 3000);

            this.hobbyCategory = '';
            this.hobbyContent = '';
            this.hobbyButtonText = buttonText;
          },
          () => {
            this.snackBar.open(
              'Could not add hobby because of an error from the server',
              'OK',
              {
                panelClass: ['snackbar', 'danger-snackbar'],
              }
            );
          },
          () => {
            this.snackBar.open(
              'Could not add hobby because your are offline',
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
        'Could not add hobby due a to lack of information and/or invalid input',
        'OK',
        {
          panelClass: ['snackbar', 'danger-snackbar'],
        }
      );
    }
  }

  deleteAdmin(id: string) {
    this.confirmDeleteDialogService
      .openConfirmDeleteDialog('admin')
      .subscribe((shouldDelete) => {
        if (shouldDelete) {
          this.auth
            .deleteAdmin(
              id,
              () => {
                this.snackBar.open(
                  'Could not delete admin because of an error from the server',
                  'OK',
                  {
                    panelClass: ['snackbar', 'danger-snackbar'],
                  }
                );
              },
              () => {
                this.snackBar.open(
                  'Could not delete admin because you are offline',
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

  deleteAchievement(id: string) {
    this.confirmDeleteDialogService
      .openConfirmDeleteDialog('achievement')
      .subscribe((shouldDelete) => {
        if (shouldDelete) {
          this.aboutContentService
            .deleteAchievement(
              id,
              () => {
                this.snackBar.open(
                  'Could not delete achievement because of an error from the server',
                  'OK',
                  {
                    panelClass: ['snackbar', 'danger-snackbar'],
                  }
                );
              },
              () => {
                this.snackBar.open(
                  'Could not delete achievement because you are offline',
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

  deleteHobby(id: string) {
    this.confirmDeleteDialogService
      .openConfirmDeleteDialog('hobby')
      .subscribe((shouldDelete) => {
        if (shouldDelete) {
          this.aboutContentService
            .deleteHobby(
              id,
              () => {
                this.snackBar.open(
                  'Could not delete hobby because of an error from the server',
                  'OK',
                  {
                    panelClass: ['snackbar', 'danger-snackbar'],
                  }
                );
              },
              () => {
                this.snackBar.open(
                  'Could not delete hobby because you are offline',
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
  uidExists() {
    if (this.admins) {
      const uidExists = this.admins.some((admin) => {
        return admin.id === this.uid;
      });

      return uidExists;
    } else {
      return false;
    }
  }

  updateAdminButtonText() {
    if (this.uidExists()) {
      this.adminButtonText = 'Set Admin';
    } else {
      this.adminButtonText = 'Add Admin';
    }
  }

  updateAchievementButtonText() {
    this.achievementButtonText = 'Add Achievement';
  }

  updateHobbyButtonText() {
    this.hobbyButtonText = 'Add Hobby';
  }

  trim() {
    this.uid = this.uid.trim();
    this.email = this.email.trim();

    this.achievementCategory = this.achievementCategory.trim();
    this.achievementContent = this.achievementContent.trim();

    this.hobbyCategory = this.hobbyCategory.trim();
    this.hobbyContent = this.hobbyContent.trim();
  }
}
