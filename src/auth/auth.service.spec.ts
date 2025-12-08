import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwt },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login and return token when credentials are valid', async () => {
    const user = {
      id: 1,
      email: 'saad@ac.in',
      password: await bcrypt.hash('Saad@12', 10),
      role: 'ADMIN'
    };

    mockUserRepo.findOne.mockResolvedValue(user);

    const result = await service.login({ email: 'saad@ac.in', password: 'Saad@12' });

    expect(mockJwt.sign).toHaveBeenCalled();
    expect(result).toHaveProperty('token');
  });

});
