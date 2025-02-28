import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-employes',
  templateUrl: './add-employes.component.html',
  styleUrls: ['./add-employes.component.css'],
  standalone : false
})
export class AddEmployesComponent implements OnInit {
  @Input() displayStyleChild: string = "none";  // Reçoit la variable du parent
  @Output() closeEvent = new EventEmitter<void>(); // Émet un événement pour fermer le modal
  @Output() employeeAdded = new EventEmitter<void>();
  nom: string = '';
  email: string = '';
  sexe: string = '';
  role: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  imageFile: File | null = null; // Stocke le fichier sélectionné

  constructor(
    private dataservice: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  closePopup(): void {
    this.displayStyleChild = "none"; // Localement
    this.closeEvent.emit(); // Notifie le parent pour fermer le modal
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      console.log('Image sélectionnée:', file);
    }
  }
  
AddEmployer(): void {

  if (!this.nom.trim() || !this.email.trim() || !this.sexe.trim() || !this.role.trim() || !this.password.trim() || !this.passwordConfirmation.trim()) {
    this.toastr.error('All fields are required.', 'Validation Error');
    return;
  }

  if (!this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    this.toastr.error('Invalid email format.', 'Validation Error');
    return;
  }

  if (this.password.length < 8) {
    this.toastr.error('Password must be at least 8 characters long.', 'Validation Error');
    return;
  }

  if (this.password !== this.passwordConfirmation) {
    this.toastr.error('Passwords do not match.', 'Validation Error');
    return;
  }

  const formData = new FormData();
  formData.append('name', this.nom.trim());
  formData.append('email', this.email.trim());
  formData.append('sexe', this.sexe.trim());
  formData.append('role', this.role.trim());
  formData.append('password', this.password.trim());
  formData.append('password_confirmation', this.passwordConfirmation.trim());

  if (this.imageFile) {
    formData.append('profile_image', this.imageFile);
  }

  this.dataservice.AddUser(formData).subscribe(
    (response) => {
      console.log('Employee added successfully:', response);
      this.toastr.success('Employee added successfully!', 'Success');
      this.employeeAdded.emit(); // Notifie le parent qu'un employé a été ajouté
      this.router.navigate(['/dashboard']).then(() => this.closePopup());
    },
    (error) => {
      console.error('Error adding employee:', error);
      const errorMessage = error?.error?.message || 'Failed to add employee.';
      this.toastr.error(errorMessage, 'Error');
    }
  );
}

}
