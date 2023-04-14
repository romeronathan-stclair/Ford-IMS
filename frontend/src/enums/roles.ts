export enum Roles {
  Admin = 'Admin',
  PlantManager = 'Plant Manager',
  TeamManager = 'Team Manager',
  SeniorProcessCoach = 'Senior Process Coach',
  ProcessCoach = 'Process Coach',
  CycleChecker = 'Cycle Checker',
  Employee = 'Employee',
  MaterialHandlingProcessCoach = 'Material & Handling Process Coach',
}
export const rolePowerLevels: Record<Roles, number> = {
  [Roles.Admin]: 7,
  [Roles.PlantManager]: 6,
  [Roles.TeamManager]: 5,
  [Roles.SeniorProcessCoach]: 4,
  [Roles.MaterialHandlingProcessCoach]: 4,
  [Roles.ProcessCoach]: 3,
  [Roles.CycleChecker]: 2,
  [Roles.Employee]: 1,
};  