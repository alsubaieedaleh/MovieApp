// src/app/components/search-box/search-box.component.ts
import { Component, EventEmitter, output, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe'; 

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './search-box.component.html',
})
export class SearchBoxComponent {
  searchTerm = signal('');

  search = output<string>();
  onSearch() {
    const term = this.searchTerm().trim();
    if (term) {
      this.search.emit(term);
    }
  }
}
