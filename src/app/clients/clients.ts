import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService, Client } from './client.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clients.html',
  styleUrls: ['./clients.css']
})
export class ClientsComponent implements OnInit {
  private allClients: Client[] = [];
  public displayedClients: Client[] = [];
  private recordsToShow = 9;
  private recordsToLoad = 5;

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.allClients = data;
        this.displayedClients = this.allClients.slice(0, this.recordsToShow);
      },
      error: (err) => {
        console.error('Error fetching clients:', err);
      }
    });
  }

  onTableScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = 100; // pixels from bottom
    const position = target.scrollTop + target.offsetHeight;
    const height = target.scrollHeight;

    if (position >= height - threshold) {
      this.loadMoreClients();
    }
  }

  private loadMoreClients(): void {
    const currentLength = this.displayedClients.length;
    if (currentLength >= this.allClients.length) {
      return; // All clients are already displayed
    }

    const moreClients = this.allClients.slice(currentLength, currentLength + this.recordsToLoad);
    this.displayedClients = [...this.displayedClients, ...moreClients];
  }

  editClient(id: number): void {
    console.log('Edit client with ID:', id);
  }

  deleteClient(id: number): void {
    console.log('Delete client with ID:', id);
  }
}
