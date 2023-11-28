import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Role } from './Role.entity'; // Import the Role entity
import { Permission } from './Permission.entity'; // Import the Permission entity

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role)
  role: Role;
  @Column()
  roleId: Role['id'];

  @ManyToOne(() => Permission, (permission) => permission.id)
  permission: Permission;
}
