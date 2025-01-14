import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>File Processed Successfully</h2>
    <mat-dialog-content>
      Your file has been de-identified and is ready for download.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
      <button mat-raised-button color="primary" (click)="downloadFile()">
        Download De-identified File
      </button>
    </mat-dialog-actions>
  `
})
export class SuccessDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {content: string; originalName: string}) {}

  downloadFile(): void {
    const blob = new Blob([this.data.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deidentified_${this.data.originalName}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
} 