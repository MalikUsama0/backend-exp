import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User.entity';
import { RolePermission } from './RolePermission.entity';
import {
  IsNotEmpty,
  IsBoolean,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';

@Entity()
export class Role {
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
  @IsBoolean()
  active: string;

  @OneToMany(() => User, (user) => user.role)
  user: User[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermission: RolePermission[];
}
