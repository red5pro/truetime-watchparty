export const removeFromArray = (arr: any[], args: any[]) => arr.filter((val) => !args.includes(val))

export enum UserRoles {
  ORGANIZER = 'ORGANIZER',
  VIP = 'VIP',
  ADMIN = 'ADMIN',
}
