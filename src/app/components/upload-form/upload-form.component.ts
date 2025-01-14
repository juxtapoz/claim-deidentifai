import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeidentificationService } from '../../services/deidentification.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { SuccessDialogComponent } from './success-dialog.component';
import { MetricsService } from '../../services/metrics.service';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  template: `
    <div class="upload-form">
      <div 
        class="upload-zone"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        [class.dragover]="isDragOver">
        <mat-icon>cloud_upload</mat-icon>
        <h3>Drag and drop your 837 file here</h3>
        <p>or</p>
        <button mat-raised-button color="primary" (click)="fileInput.click()">
          Select File
        </button>
        <input
          #fileInput
          type="file"
          (change)="onFileSelected($event)"
          accept=".edi,.txt"
          style="display: none">
        <p class="hint">Accepted formats: EDI, TXT</p>
      </div>

      <div class="upload-status" *ngIf="selectedFile">
        <h4>Selected File:</h4>
        <p>{{selectedFile.name}}</p>
        <mat-progress-bar
          *ngIf="uploading"
          mode="determinate"
          [value]="uploadProgress">
        </mat-progress-bar>
        <button
          mat-raised-button
          color="primary"
          [disabled]="uploading"
          (click)="uploadFile()">
          Upload File
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent {
  isDragOver = false;
  selectedFile: File | null = null;
  uploading = false;
  uploadProgress = 0;

  constructor(
    private deidentificationService: DeidentificationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private metricsService: MetricsService
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;
    
    this.uploading = true;
    this.uploadProgress = 0;
    this.metricsService.setProcessing(1);

    this.deidentificationService.processFile(this.selectedFile)
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.metricsService.setProcessing(0);
            this.metricsService.incrementProcessed();
            const originalName = this.selectedFile?.name ?? 'file.txt';
            this.uploading = false;
            this.selectedFile = null;
            
            this.dialog.open(SuccessDialogComponent, {
              data: {
                content: event.body.file_content,
                originalName
              },
              width: '400px'
            });
          }
        },
        error: (err) => {
          this.metricsService.setProcessing(0);
          this.metricsService.incrementErrors();
          console.error('Upload failed:', err);
          this.snackBar.open('Error processing file: ' + err.message, 'Close', {
            duration: 5000
          });
          this.uploading = false;
        }
      });
  }
} 