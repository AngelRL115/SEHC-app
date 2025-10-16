import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarRegistrationService, Vehicle } from './car-registration.service';

@Component({
  selector: 'app-car-registration',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car-registration.html',
  styleUrls: ['./car-registration.css'],
  providers: [CarRegistrationService]
})
export class CarRegistrationComponent implements OnInit {
  private allVehicles: Vehicle[] = [];
  public vehicles: Vehicle[] = [];
  private recordsToShow = 9;
  private recordsToLoad = 5;

  constructor(private carRegistrationService: CarRegistrationService, private router: Router) { }

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.carRegistrationService.getAllVehicles().subscribe({
      next: (data) => {
        this.allVehicles = data;
        this.vehicles = this.allVehicles.slice(0, this.recordsToShow);
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.allVehicles = [];
          this.vehicles = [];
        }
      }
    });
  }

  onScroll(event: Event): void {
    console.log('scrolling');
    const target = event.target as HTMLElement;
    const threshold = 100;
    const position = target.scrollTop + target.offsetHeight;
    const height = target.scrollHeight;

    if (position >= height - threshold) {
      this.loadMoreVehicles();
    }
  }

  private loadMoreVehicles(): void {
    const currentLength = this.vehicles.length;
    if (currentLength >= this.allVehicles.length) {
      return;
    }
    const moreVehicles = this.allVehicles.slice(currentLength, currentLength + this.recordsToLoad);
    this.vehicles = [...this.vehicles, ...moreVehicles];
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
