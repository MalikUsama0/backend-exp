import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolePermission } from './RolePermission.entity'; // Import the RolePermission entity
import { IsNotEmpty, IsBoolean, IsDate, Length, IsInt, MinLength, MaxLength, IsString } from 'class-validator';


@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Title is too short',
  })
  @MaxLength(200, {
    message: 'Title is too long',
  })
  title: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Module is too short',
  })
  @MaxLength(200, {
    message: 'Module is too long',
  })
  module: string;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];
}
