import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarRegistrationService, Vehicle } from './car-registration.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './car-registration.html',
  styleUrls: ['./car-registration.css'],
  providers: [CarRegistrationService]
})
export class CarRegistrationComponent implements OnInit {
  private allVehicles: Vehicle[] = [];
  public vehicles: Vehicle[] = [];
  private recordsToShow = 9;
  private recordsToLoad = 5;

  isDeleteModalActive = false;
  vehicleToDelete: Vehicle | null = null;

  isEditModalActive = false;
  vehicleToEdit: Vehicle | null = null;
  editVehicleData: any = {};
  originalVehicleData: any = {};

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

  deleteVehicle(vehicle: Vehicle): void {
    this.vehicleToDelete = vehicle;
    this.isDeleteModalActive = true;
  }

  cancelDelete(): void {
    this.isDeleteModalActive = false;
    this.vehicleToDelete = null;
  }

  confirmDelete(): void {
    if (this.vehicleToDelete) {
      this.carRegistrationService.deleteVehicle(this.vehicleToDelete.idVehicle).subscribe({
        next: () => {
          this.loadVehicles();
          this.cancelDelete();
        },
        error: (err: any) => {
          console.error('Error deleting vehicle:', err);
          this.cancelDelete();
        }
      });
    }
  }

  editVehicle(vehicle: Vehicle): void {
    this.vehicleToEdit = vehicle;
    this.originalVehicleData = { ...vehicle };
    this.editVehicleData = { ...vehicle };
    this.isEditModalActive = true;
  }

  cancelEdit(): void {
    this.isEditModalActive = false;
    this.vehicleToEdit = null;
    this.editVehicleData = {};
    this.originalVehicleData = {};
  }

  confirmEdit(): void {
    if (this.vehicleToEdit) {
      this.carRegistrationService.updateVehicle(this.editVehicleData).subscribe({
        next: () => {
          this.loadVehicles();
          this.cancelEdit();
        },
        error: (err: any) => {
          console.error('Error updating vehicle:', err);
          this.cancelEdit();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
