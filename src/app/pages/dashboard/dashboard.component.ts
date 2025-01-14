import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { StatusCardComponent } from '../../components/status-card/status-card.component';
import { MetricsService } from '../../services/metrics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    StatusCardComponent
  ],
  template: `
    <header class="app-header">
      <div class="header-content">
        <h1>
          <span class="title-837">837</span>
          <span class="title-de">De-identif</span>
          <span class="title-ai">AI</span>
        </h1>
      </div>
    </header>

    <div class="dashboard-container">
      <div class="feature-cards">
        <mat-card>
          <mat-card-content>
            <mat-icon class="feature-icon">psychology</mat-icon>
            <h3>AI-Powered De-identification</h3>
            <p>Advanced AI agents automatically detect and remove PHI from your 837 claim files with high accuracy</p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <mat-icon class="feature-icon">security</mat-icon>
            <h3>HIPAA Safe Harbor Compliant</h3>
            <p>AI models trained specifically on healthcare data ensure complete PHI removal following HIPAA guidelines</p>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <mat-icon class="feature-icon">bolt</mat-icon>
            <h3>Real-Time Processing</h3>
            <p>Neural networks process your files instantly with zero data storage for maximum security</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="action-card">
        <mat-card>
          <mat-card-content class="centered-content">
            <h2>Start De-identification</h2>
            <button mat-raised-button color="primary" routerLink="/upload">
              <mat-icon>upload_file</mat-icon>
              Upload 837 File
            </button>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="status-cards">
        <ng-container *ngIf="metrics$ | async as metrics">
          <app-status-card
            title="Files De-identified Today"
            [value]="metrics.filesProcessedToday.toString()"
            icon="description"
          ></app-status-card>
          
          <app-status-card
            title="Processing"
            [value]="metrics.currentlyProcessing.toString()"
            icon="psychology"
          ></app-status-card>
          
          <app-status-card
            title="Errors Today"
            [value]="metrics.errorsToday.toString()"
            icon="error_outline"
          ></app-status-card>
        </ng-container>
      </div>
    </div>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <p>&copy; 2025 837 De-identifAI. All rights reserved.</p>
        </div>
        <div class="footer-section">
          <p>HIPAA Compliant • Zero Data Storage • Real-Time Processing</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-header {
      background: rgba(28, 28, 30, 0.8);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 24px;

      h1 {
        margin: 0;
        font-size: 2rem;
        font-weight: 300;
        letter-spacing: -0.5px;

        .title-837 {
          color: #64B5F6;
          font-weight: 500;
        }

        .title-de {
          color: rgba(255, 255, 255, 0.87);
        }

        .title-ai {
          background: linear-gradient(135deg, #4FC3F7, #81D4FA);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 500;
        }
      }
    }

    .dashboard-container {
      flex: 1;
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 24px;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
    }

    mat-card {
      background: rgba(28, 28, 30, 0.8) !important;
      transition: transform 0.2s, box-shadow 0.2s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
      }
    }

    .feature-cards mat-card-content {
      text-align: center;
      padding: 24px;

      .feature-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        margin-bottom: 16px;
        color: #64B5F6;
        opacity: 0.9;
        transform-origin: center;
        transition: transform 0.3s ease;
      }

      &:hover .feature-icon {
        transform: scale(1.1);
      }

      h3 {
        color: rgba(255, 255, 255, 0.87);
        margin: 0 0 16px 0;
        font-size: 1.5rem;
        font-weight: 300;
      }

      p {
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
        line-height: 1.5;
      }
    }

    .action-card {
      margin-bottom: 24px;
      
      .centered-content {
        text-align: center;
        padding: 32px;

        h2 {
          margin-bottom: 24px;
          color: rgba(255, 255, 255, 0.87);
          font-weight: 300;
        }

        button mat-icon {
          margin-right: 8px;
        }
      }
    }

    .status-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .app-footer {
      background: rgba(28, 28, 30, 0.8);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 24px 0;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      
      .footer-section {
        p {
          margin: 0;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }
      }
    }

    /* ... rest of existing styles ... */
  `]
})
export class DashboardComponent {
  metrics$ = this.metricsService.metrics$;

  constructor(private metricsService: MetricsService) {}
} 