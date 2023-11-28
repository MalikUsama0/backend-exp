import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from 'src/entities/RolePermission.entity';
import { Repository } from 'typeorm';
import { Permission } from 'src/entities/Permission.entity';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionsRepository: Repository<RolePermission>,
  ) {}
  findAll(): Promise<RolePermission[]> {
    return this.rolePermissionsRepository.find();
  }

  findOne(id: number): Promise<RolePermission | null> {
    return this.rolePermissionsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.rolePermissionsRepository.delete(id);
  }

  async createRolePermission(rolePer): Promise<void> {
    console.log(rolePer, 'rolePermissions obj');
    const permission = new Permission();
    permission.id = rolePer.permissionId;
    const permissions = {
      roleId: rolePer.roleId,
      permission: rolePer.permissionId,
    };

    await this.rolePermissionsRepository.save(permissions);
  }
}
