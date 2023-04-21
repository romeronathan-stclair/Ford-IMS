// role.service.ts
import { Injectable } from '@angular/core';
import { rolePowerLevels, Roles } from 'src/enums/roles';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    constructor(private authService: AuthService) { }

    // Dashboard
    canAccessDashboard(): boolean {
        // All roles have access to the dashboard
        return true;
    }

    // Cycle Check
    canAccessCycleCheck(): boolean {
        const allowedRoles = [
            Roles.CycleChecker,
            Roles.Admin,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    // Departments
    canEditDepartment(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
            Roles.SeniorProcessCoach,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    canCreateDepartment(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    canDeleteDepartment(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    // Plants
    canEditPlant(): boolean {
        return this.authService.user.role as Roles === Roles.Admin;
    }

    canCreatePlant(): boolean {
        return this.authService.user.role as Roles === Roles.Admin;
    }

    canDeletePlant(): boolean {
        return this.authService.user.role as Roles === Roles.Admin;
    }

    // Products
    canEditProduct(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
            Roles.SeniorProcessCoach,
            Roles.ProcessCoach,
            Roles.MaterialHandlingProcessCoach,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    canCreateProduct(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
            Roles.SeniorProcessCoach,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    canDeleteProduct(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    // Stock
    canEditStock(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
            Roles.SeniorProcessCoach,
            Roles.ProcessCoach,
            Roles.MaterialHandlingProcessCoach,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    canCreateStock(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
            Roles.SeniorProcessCoach,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    canDeleteStock(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    // Dunnage
    canEditDunnage(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
            Roles.SeniorProcessCoach,
            Roles.ProcessCoach,
            Roles.MaterialHandlingProcessCoach,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    canCreateDunnage(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
            Roles.SeniorProcessCoach,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    canDeleteDunnage(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    // Forecast
    canAccessForecast(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.PlantManager,
            Roles.TeamManager,
            Roles.SeniorProcessCoach,
            Roles.ProcessCoach,
            Roles.MaterialHandlingProcessCoach,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    // Cycle Count
    canStartCycleCount(): boolean {
        return this.authService.user.role as Roles === Roles.Admin;
    }

    // Sub Assembly Count
    canStartSubAssemblyCount(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.SeniorProcessCoach,
            Roles.ProcessCoach,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }

    // Production Count
    canStartProductionCount(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.SeniorProcessCoach,
            Roles.ProcessCoach,
        ];
        return allowedRoles.includes(this.authService.user.role as Roles);
    }
    // User Management
    canManageUser(targetRole?: Roles): boolean {

        const userRole = this.authService.user.role as Roles;
        const userRolePower = rolePowerLevels[userRole];
        const targetRolePower = rolePowerLevels[targetRole ? targetRole : userRole];

        return userRolePower > targetRolePower;
    }

    getRolesUnderUser(): Roles[] {
        const userRole = this.authService.user.role as Roles;
        const userPower = rolePowerLevels[userRole];

        const rolesUnderUser = Object.values(Roles)
            .filter(role => rolePowerLevels[role as Roles] < userPower);

        return rolesUnderUser;
    }

    // Cycle Check
    canCreateCycleCheck(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.CycleChecker,
        ];
        const userRole = this.authService.user.role as Roles;
        return allowedRoles.includes(userRole);
    }
    // Production Count
    canCreateProductionCount(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.SeniorProcessCoach,
            Roles.ProcessCoach,
        ];
        const userRole = this.authService.user.role as Roles;
        return allowedRoles.includes(userRole);
    }

    // Sub Assembly
    canCreateSubAssembly(): boolean {
        const allowedRoles = [
            Roles.Admin,
            Roles.SeniorProcessCoach,
            Roles.ProcessCoach,
        ];
        const userRole = this.authService.user.role as Roles;
        return allowedRoles.includes(userRole);
    }

}

