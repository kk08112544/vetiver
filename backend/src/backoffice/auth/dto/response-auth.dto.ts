export class ResponseAuthDto {
  id!: number;
  firstName!: string;
  lastName!: string;
  userName!: string;
  password!: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
}

export function toAuthResponse(user: ResponseAuthDto): ResponseAuthDto {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    password: user.password,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
}
