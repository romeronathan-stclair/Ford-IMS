// auth-role.guard.ts
import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { RoleService } from '../services/role.service';

@Injectable({
    providedIn: 'root',
})
export class AuthRoleGuard implements CanActivate {
    constructor(private messageService: MessageService, private roleService: RoleService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const requiredPermission = route.data['requiredPermission'] as keyof RoleService;

        if (this.roleService[requiredPermission]()) {
            return true;
        } else {
            this.router.navigate(['/dashboard/plants/list']);
            this.messageService.clear();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'You do not have permission to access this page.',
            });

            return false;
        }
    }
}
