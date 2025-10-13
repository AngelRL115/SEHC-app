import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-temporary-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temporary-content.html',
  styleUrls: ['./temporary-content.css']
})
export class TemporaryContentComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/home']);
  }
}