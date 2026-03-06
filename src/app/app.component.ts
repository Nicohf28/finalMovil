import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserRole } from './models/user-role';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent implements OnInit, OnDestroy {
  role: UserRole | null = null;
  private sub: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.sub = this.authService.role$.subscribe((r) => {
      this.role = r;
      document.body.classList.remove('theme-local', 'theme-repartidor', 'theme-reposteria');
      if (r === 'local') document.body.classList.add('theme-local');
      else if (r === 'repartidor') document.body.classList.add('theme-repartidor');
      else document.body.classList.add('theme-reposteria');
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    document.body.classList.remove('theme-local', 'theme-repartidor', 'theme-reposteria');
  }
}
