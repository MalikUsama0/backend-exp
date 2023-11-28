import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { RolePermission } from 'src/entities/RolePermission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission])],
  providers: [RolePermissionService],
  controllers: [RolePermissionController],
  exports: [TypeOrmModule],
})
export class RolePermissionModule {}
