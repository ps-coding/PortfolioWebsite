import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { OnlineService } from '../services/internet/online.service';
import { AuthService } from './../services/authentication/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    public auth: AuthService,
    public onlineService: OnlineService,
    private snackBar: MatSnackBar
  ) {}

  login() {
    this.auth.login(() => {
      this.snackBar.open('Sign in was not completed', 'OK', {
        panelClass: ['snackbar', 'danger-snackbar'],
      });
    });
  }

  logout() {
    this.auth.logout(() => {
      this.snackBar.open('Sign out was not completed', 'OK', {
        panelClass: ['snackbar', 'danger-snackbar'],
      });
    });
  }
}
