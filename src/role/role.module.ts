import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from 'src/entities/Role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [TypeOrmModule],
})
export class RoleModule {}
