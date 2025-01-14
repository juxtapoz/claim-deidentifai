import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card>
      <mat-card-content>
        <div class="status-card-content">
          <mat-icon class="status-icon">{{icon}}</mat-icon>
          <div class="status-info">
            <h3>{{title}}</h3>
            <div class="status-value">{{value}}</div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .status-card-content {
      display: flex;
      align-items: center;
      padding: 16px;
    }

    .status-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-right: 16px;
      color: #64B5F6;
      opacity: 0.9;
    }

    .status-info {
      h3 {
        margin: 0;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.6);
      }

      .status-value {
        font-size: 24px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.87);
        margin-top: 8px;
      }
    }
  `]
})
export class StatusCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() icon: string = '';
} 