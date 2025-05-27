import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent {
  @Input() activeTab: string = 'browse';

  constructor(private router: Router) {}

  @Output() tabChange = new EventEmitter<string>();

  setTab(tab: string) {
    this.tabChange.emit(tab);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([`/${tab}`]);
  }
}
