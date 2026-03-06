import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user-role';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class RegisterPage {

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['local' as UserRole, [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {}

  async register() {
    if (this.form.invalid) return;

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...'
    });
    await loading.present();

    const { email, password, role } = this.form.value;

    try {
      const userCredential = await this.authService.register(
        email!,
        password!,
        role!
      );

      await loading.dismiss();

      this.authService.saveUserProfile(
        userCredential.user.uid,
        userCredential.user.email!,
        role!
      ).catch(() => {});

      const alert = await this.alertCtrl.create({
        header: 'Registro exitoso',
        message: 'Tu cuenta fue creada correctamente',
        buttons: ['OK']
      });
      await alert.present();

      this.router.navigate(['/login']);

    } catch (error: any) {
      await loading.dismiss();

      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: error.message ?? 'No se pudo crear la cuenta',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}