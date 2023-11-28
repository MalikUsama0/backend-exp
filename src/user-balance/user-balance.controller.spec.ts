import { Test, TestingModule } from '@nestjs/testing';
import { UserBalanceController } from './user-balance.controller';

describe('UserBalanceController', () => {
  let controller: UserBalanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBalanceController],
    }).compile();

    controller = module.get<UserBalanceController>(UserBalanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
