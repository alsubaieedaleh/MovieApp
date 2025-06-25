// src/app/components/search-box/search-box.component.ts
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-box.component.html',
})
export class SearchBoxComponent {
  searchTerm = signal('');

  @Output() search = new EventEmitter<string>();

  onSearch() {
    const term = this.searchTerm().trim();
    if (term) {
      this.search.emit(term);
    }
  }
}
