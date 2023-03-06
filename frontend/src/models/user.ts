export interface User {
    name: string;
    email: string;
    plants: [{
        plantId: string;
        departments: [String];
        isActive: boolean;
    }]
    role: string;
    deactivatedDate: Date;
    passwordResetToken: String | undefined;
    passwordResetExpires: Date | undefined;
};
