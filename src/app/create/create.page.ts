import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { getDatabase, ref, set } from "firebase/database";
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../services/auth.service';
import { USER_ROLE_LABELS, UserRole } from '../models/user-role';
import { Subscription } from 'rxjs';

const db = getDatabase();

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class CreatePage implements OnInit, OnDestroy {
  infoForm = this.formBuilder.group({
    info_title: [null, Validators.required],
    info_description: [null, Validators.required]
  });

  role: UserRole | null = null;
  roleLabel = '';
  private sub?: Subscription;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.sub = this.authService.role$.subscribe((r) => {
      this.role = r;
      this.roleLabel = r ? USER_ROLE_LABELS[r] : '';
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  logout() {
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }

  saveInfo() {
    const id = uuidv4();
    set(ref(db, 'infos/' + id), this.infoForm.value).then(() => {
      // Navega a DetailPage con el id
      this.router.navigate(['/detail', id]);
    });
  }

  goToDetail() {
    const id = uuidv4(); // Genera un ID único para la nueva entrada
    // Navega a DetailPage con el id
    this.router.navigate(['/detail', id]);
  }
}