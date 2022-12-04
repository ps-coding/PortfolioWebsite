import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { OnlineService } from '../services/internet/online.service';
import { AboutContentService } from '../services/management/about-content.service';
import { Achievement } from '../services/management/achievement';
import { Hobby } from '../services/management/hobby';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  achievements!: Map<string, string[]>;
  hobbies!: Map<string, string[]>;

  achievementSubscription!: Subscription;
  hobbySubscription!: Subscription;

  isLoadingAchievements = true;
  isLoadingHobbies = true;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    public onlineService: OnlineService,
    private aboutContentService: AboutContentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Prasham's Portfolio - About");
    this.metaService.updateTag({
      name: 'description',
      content:
        "This is the about page of Prasham Shah's portfolio website. On this page you can learn about him and his achievements.",
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
          this.achievements = new Map<string, string[]>();
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
          this.achievements = new Map<string, string[]>();
          this.isLoadingAchievements = false;
        }
      )
      .subscribe((achievements) => {
        if (achievements != null) {
          this.achievements = this.groupByKey(achievements);
          this.isLoadingAchievements = false;
        } else {
          this.achievements = new Map<string, string[]>();
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
          this.hobbies = new Map<string, string[]>();
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
          this.hobbies = new Map<string, string[]>();
          this.isLoadingHobbies = false;
        }
      )
      .subscribe((hobbies) => {
        if (hobbies != null) {
          this.hobbies = this.groupByKey(hobbies);
          this.isLoadingHobbies = false;
        } else {
          this.hobbies = new Map<string, string[]>();
          this.isLoadingHobbies = false;
        }
      });
  }

  groupByKey(list: Achievement[] | Hobby[]) {
    return list.reduce((current, item) => {
      const { category, content } = item;

      current.set(category, [...(current.get(category) || []), content]);

      return current;
    }, new Map<string, string[]>());
  }

  getAge() {
    const age = moment().diff(moment('31082008', 'DDMMYYYY'), 'years');
    return age;
  }

  getGrade() {
    const year = moment().diff(moment('01092013', 'DDMMYYYY'), 'years');

    if (year <= 12) {
      return { year, inSchool: true };
    } else {
      return { year: null, inSchool: false };
    }
  }
}
