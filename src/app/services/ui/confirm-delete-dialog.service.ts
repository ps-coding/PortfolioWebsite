import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from 'src/app/confirm-delete/confirm-delete.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDeleteDialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmDeleteDialog(itemToDelete: string) {
    return this.dialog
      .open(ConfirmDeleteComponent, {
        panelClass: 'confirm-dialog',
        disableClose: true,
        data: {
          itemToDelete,
        },
      })
      .afterClosed();
  }
}
