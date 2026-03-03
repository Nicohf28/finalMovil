import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  private auth = getAuth();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  async register() {
    if (this.form.invalid) return;

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...'
    });
    await loading.present();

    const { email, password } = this.form.value;

    try {
      await createUserWithEmailAndPassword(
        this.auth,
        email!,
        password!
      );

      await loading.dismiss();

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
        message: error.message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}