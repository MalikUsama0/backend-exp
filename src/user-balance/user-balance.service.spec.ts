import { Test, TestingModule } from '@nestjs/testing';
import { UserBalanceService } from './user-balance.service';

describe('UserBalanceService', () => {
  let service: UserBalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBalanceService],
    }).compile();

    service = module.get<UserBalanceService>(UserBalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
