import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { UploadFormComponent } from '../../components/upload-form/upload-form.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    UploadFormComponent
  ],
  template: `
    <div class="upload-container">
      <div class="header">
        <button mat-icon-button routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Upload 837 File</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <app-upload-form></app-upload-form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .upload-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      h1 {
        margin: 0 0 0 16px;
        color: #2c3e50;
      }
    }
  `]
})
export class FileUploadComponent {} 