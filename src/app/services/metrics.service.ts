import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProcessingMetrics {
  filesProcessedToday: number;
  currentlyProcessing: number;
  errorsToday: number;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private STORAGE_KEY = 'processing_metrics';
  
  private metrics = new BehaviorSubject<ProcessingMetrics>(this.loadMetrics());

  metrics$ = this.metrics.asObservable();

  private loadMetrics(): ProcessingMetrics {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const metrics = JSON.parse(stored);
      if (this.isNewDay(metrics.lastUpdated)) {
        return this.getInitialMetrics();
      }
      return metrics;
    }
    return this.getInitialMetrics();
  }

  private getInitialMetrics(): ProcessingMetrics {
    return {
      filesProcessedToday: 0,
      currentlyProcessing: 0,
      errorsToday: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  private isNewDay(lastUpdated: string): boolean {
    const last = new Date(lastUpdated);
    const now = new Date();
    return last.getDate() !== now.getDate() || 
           last.getMonth() !== now.getMonth() ||
           last.getFullYear() !== now.getFullYear();
  }

  private saveMetrics(metrics: ProcessingMetrics) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(metrics));
  }

  incrementProcessed() {
    const current = this.metrics.value;
    const updated = {
      ...current,
      filesProcessedToday: current.filesProcessedToday + 1,
      lastUpdated: new Date().toISOString()
    };
    this.metrics.next(updated);
    this.saveMetrics(updated);
  }

  setProcessing(count: number) {
    const current = this.metrics.value;
    const updated = {
      ...current,
      currentlyProcessing: count,
      lastUpdated: new Date().toISOString()
    };
    this.metrics.next(updated);
    this.saveMetrics(updated);
  }

  incrementErrors() {
    const current = this.metrics.value;
    const updated = {
      ...current,
      errorsToday: current.errorsToday + 1,
      lastUpdated: new Date().toISOString()
    };
    this.metrics.next(updated);
    this.saveMetrics(updated);
  }
} 