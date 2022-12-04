import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor(
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  copy() {
    const URL = `https://shahprasham.com${this.router.url}`;

    const success = this.clipboard.copy(URL);

    if (success) {
      this.snackBar.open(`Link copied: ${URL}`, 'OK', {
        duration: 5000,
        panelClass: ['snackbar', 'success-snackbar'],
      });
    } else {
      this.snackBar.open('Could not copy link, try again', 'OK', {
        panelClass: ['snackbar', 'danger-snackbar'],
      });
    }
  }
}
