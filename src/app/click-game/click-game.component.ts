import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-click-game',
  templateUrl: './click-game.component.html',
  styleUrls: ['./click-game.component.css'],
})
export class ClickGameComponent implements OnInit, OnDestroy {
  clickCount: number = 0;
  speedClickCount: number = 0;
  speed: number = 0;
  seconds: number = 0;
  firstClick: boolean = true;
  updateInterval!: number;
  lastClicked: number = 0;
  highSpeed: number = 0;

  delayOn: boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const clickCountSaved = localStorage.getItem(
      'PRASHAM_PORTFOLIO_CLICK_COUNT'
    );
    const highSpeedSaved = localStorage.getItem('PRASHAM_PORTFOLIO_HIGH_SPEED');

    if (clickCountSaved) {
      const clickCountNumber = Number(clickCountSaved);

      if (!isNaN(clickCountNumber)) {
        this.clickCount = clickCountNumber;
      } else {
        this.snackBar.open(
          'Cache corruption was detected so click count has been cleared',
          'OK',
          {
            panelClass: ['snackbar', 'danger-snackbar'],
          }
        );
        localStorage.removeItem('PRASHAM_PORTFOLIO_CLICK_COUNT');
      }
    }

    if (highSpeedSaved) {
      const highSpeedNumber = Number(highSpeedSaved);

      if (!isNaN(highSpeedNumber)) {
        this.highSpeed = highSpeedNumber;
      } else {
        this.snackBar.open(
          'Cache corruption was detected so high speed has been cleared',
          'OK',
          {
            panelClass: ['snackbar', 'danger-snackbar'],
          }
        );
        localStorage.removeItem('PRASHAM_PORTFOLIO_HIGH_SPEED');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      window.clearInterval(this.updateInterval);
    }
  }

  increment() {
    if (this.firstClick) {
      this.updateInterval = window.setInterval(() => {
        this.seconds += 0.1;
        this.lastClicked += 0.1;

        if (this.speedClickCount >= 3) {
          this.delayOn = false;
          this.speed = this.speedClickCount / this.seconds;

          if (this.speed > this.highSpeed) {
            this.highSpeed = this.speed;
            localStorage.setItem(
              'PRASHAM_PORTFOLIO_HIGH_SPEED',
              `${this.highSpeed}`
            );
          }

          if (this.lastClicked >= 3) {
            this.seconds = 0;
            this.lastClicked = 0;
            this.speedClickCount = 0;
            this.speed = 0;
            this.firstClick = true;
            this.delayOn = false;
            window.clearInterval(this.updateInterval);
          }
        } else {
          this.delayOn = true;
          if (this.lastClicked >= 10) {
            this.seconds = 0;
            this.lastClicked = 0;
            this.speedClickCount = 0;
            this.speed = 0;
            this.firstClick = true;
            this.delayOn = false;
            window.clearInterval(this.updateInterval);
          }
        }
      }, 100);
    }

    this.firstClick = false;
    this.clickCount++;
    this.speedClickCount++;
    this.lastClicked = 0;
    localStorage.setItem('PRASHAM_PORTFOLIO_CLICK_COUNT', `${this.clickCount}`);
  }

  reset() {
    if (this.updateInterval) {
      window.clearInterval(this.updateInterval);
    }
    this.firstClick = true;
    this.seconds = 0;
    this.speedClickCount = 0;
    this.speed = 0;
    this.highSpeed = 0;
    this.delayOn = false;
    localStorage.removeItem('PRASHAM_PORTFOLIO_HIGH_SPEED');

    this.clickCount = 0;
    localStorage.removeItem('PRASHAM_PORTFOLIO_CLICK_COUNT');
  }
}
