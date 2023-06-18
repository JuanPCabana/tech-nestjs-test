export class AddUserDto {
  readonly nombre: string;
  readonly apellido: string;
  readonly email: string;
  readonly password: string;
  readonly rol: string;
}

export class UpdateUserDto {
  readonly nombre?: string;
  readonly apellido?: string;
  readonly email?: string;
  readonly password?: string;
  readonly rol?: string;
}
