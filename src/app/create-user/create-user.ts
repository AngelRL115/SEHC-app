import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.css']
})
export class CreateUserComponent implements OnInit {
  createUserForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.createUserForm.invalid) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;
    const { name, lastName, username } = this.createUserForm.value;

    this.authService.createUser({ name, lastName, username }).subscribe({
      next: () => {
        this.successMessage = '¡Usuario creado con éxito! Serás redirigido al login.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Error al crear el usuario. Por favor, inténtalo de nuevo.';
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}