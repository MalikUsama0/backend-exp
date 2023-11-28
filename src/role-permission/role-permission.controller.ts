import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
  HttpStatus,
  Response,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
@Controller('/role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  async addRolePermission(@Body() rolePer: any) {
    return await this.rolePermissionService.createRolePermission(rolePer);
  }
}
