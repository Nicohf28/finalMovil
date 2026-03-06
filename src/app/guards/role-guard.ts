import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user-role';

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return async () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const user = authService.getCurrentUser();
    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    const role = await authService.getUserRole(user.uid);
    if (role && allowedRoles.includes(role)) return true;
    router.navigate(['/login']);
    return false;
  };
}
