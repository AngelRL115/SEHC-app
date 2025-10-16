import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService, Client } from './client.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class ClientsComponent implements OnInit {
  private allClients: Client[] = [];
  public displayedClients: Client[] = [];
  private recordsToShow = 9;
  private recordsToLoad = 5;

  // Add/View Modal
  isModalActive = false;
  currentStep = 1;

  // Delete Modal
  isDeleteModalActive = false;
  clientToDelete: Client | null = null;

  // Edit Modal
  isEditModalActive = false;
  clientToEdit: Client | null = null;
  editClientData: any = {};
  originalClientData: any = {};

  clientData = {
    name: '',
    lastName: '',
    phone: '',
    invoice: false,
    socialReason: '',
    zipcode: '',
    fiscalRegimen: '',
    email: ''
  };
  vehicleData = {
    idClient: 0,
    brand: '',
    model: '',
    year: '',
    color: '',
    plate: '',
    doors: 0,
    motor: ''
  };

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.allClients = data;
        this.displayedClients = this.allClients.slice(0, this.recordsToShow);
      },
      error: (err: any) => {
        console.error('Error fetching clients:', err);
      }
    });
  }

  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = 100;
    const position = target.scrollTop + target.offsetHeight;
    const height = target.scrollHeight;

    if (position >= height - threshold) {
      this.loadMoreClients();
    }
  }

  private loadMoreClients(): void {
    const currentLength = this.displayedClients.length;
    if (currentLength >= this.allClients.length) {
      return;
    }
    const moreClients = this.allClients.slice(currentLength, currentLength + this.recordsToLoad);
    this.displayedClients = [...this.displayedClients, ...moreClients];
  }

  // --- Edit Client Logic ---
  editClient(client: Client): void {
    this.clientToEdit = client;
    this.originalClientData = { ...client };
    this.editClientData = { ...client };
    this.isEditModalActive = true;
  }

  closeEditModal(): void {
    this.isEditModalActive = false;
    this.clientToEdit = null;
    this.editClientData = {};
    this.originalClientData = {};
  }

  saveClientChanges(): void {
    if (!this.clientToEdit) return;

    const payload: any = {
        idClient: this.clientToEdit.idclient,
        name: this.editClientData.name,
        lastName: this.editClientData.lastName,
        phone: this.editClientData.phone,
        invoice: this.editClientData.invoice
    };

    if (this.editClientData.invoice) {
        payload.socialReason = this.editClientData.socialReason;
        payload.zipcode = this.editClientData.zipcode;
        payload.fiscalRegimen = this.editClientData.fiscalRegimen;
        payload.email = this.editClientData.email;
    }

    this.clientService.updateClientDetails(payload).subscribe({
      next: () => {
        this.loadClients();
        this.closeEditModal();
      },
      error: (err: any) => {
        console.error('Error updating client:', err);
        this.closeEditModal();
      }
    });
  }

  // --- Delete Client Logic ---
  deleteClient(client: Client): void {
    this.clientToDelete = client;
    this.isDeleteModalActive = true;
  }

  cancelDelete(): void {
    this.isDeleteModalActive = false;
    this.clientToDelete = null;
  }

  confirmDelete(): void {
    if (this.clientToDelete) {
      this.clientService.deleteClient(this.clientToDelete.idclient).subscribe({
        next: () => {
          this.loadClients();
          this.cancelDelete();
        },
        error: (err: any) => {
          console.error('Error deleting client:', err);
          this.cancelDelete();
        }
      });
    }
  }

  // --- Add Client Logic ---
  openModal(): void {
    this.isModalActive = true;
  }

  closeModal(): void {
    this.isModalActive = false;
    this.currentStep = 1;
    this.resetForms();
  }

  nextStep(): void {
    this.clientService.newClient(this.clientData).subscribe({
      next: (response) => {
        this.vehicleData.idClient = response.clientId;
        this.currentStep = 2;
      },
      error: (err: any) => {
        console.error('Error creating client:', err);
      }
    });
  }

  prevStep(): void {
    this.currentStep = 1;
  }

  saveVehicle(): void {
    this.clientService.newVehicle(this.vehicleData).subscribe({
      next: () => {
        this.closeModal();
        this.loadClients();
      },
      error: (err: any) => {
        console.error('Error creating vehicle:', err);
      }
    });
  }

  private resetForms(): void {
    this.clientData = {
      name: '',
      lastName: '',
      phone: '',
      invoice: false,
      socialReason: '',
      zipcode: '',
      fiscalRegimen: '',
      email: ''
    };
    this.vehicleData = {
      idClient: 0,
      brand: '',
      model: '',
      year: '',
      color: '',
      plate: '',
      doors: 0,
      motor: ''
    };
  }
}
