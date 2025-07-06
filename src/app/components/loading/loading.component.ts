// src/app/components/loading-spinner/loading-spinner.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container ">
      <div class="spinner "></div>
    </div>
  `,
  styles: [
    `
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
    .spinner {
      width: 80px;
      height: 80px;
      border: 6px solid rgba(0, 0, 0, 0.2);
      border-top-color: #FFE353;  
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    `
  ]
})
export class LoadingSpinnerComponent {}
