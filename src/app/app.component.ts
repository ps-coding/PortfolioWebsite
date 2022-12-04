import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { OnlineService } from './services/internet/online.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  backgroundColor = '#1976d2';
  onlineSubscription!: Subscription;

  constructor(private onlineService: OnlineService) {}
  ngOnInit(): void {
    this.onlineSubscription = this.onlineService.isOnline.subscribe(
      (online) => {
        this.backgroundColor = online ? '#1976d2' : 'red';
      }
    );
  }

  ngOnDestroy(): void {
    if (this.onlineSubscription) {
      this.onlineSubscription.unsubscribe();
    }
  }
}
