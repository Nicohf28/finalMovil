import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user-role';
import { map, take } from 'rxjs/operators';

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.role$.pipe(
      take(1),
      map((role) => {
        if (!authService.getCurrentUser()) {
          router.navigate(['/login']);
          return false;
        }
        if (role && allowedRoles.includes(role)) {
          return true;
        }
        router.navigate(['/login']);
        return false;
      })
    );
  };
}
