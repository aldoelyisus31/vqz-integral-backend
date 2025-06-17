import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  let dto: LoginDto;

  beforeEach(() => {
    dto = new LoginDto();
    dto.username = 'johndoe';
    dto.password = 'password123';
  });

  it('should validate a correct dto', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('username validation', () => {
    it('should fail with empty username', async () => {
      dto.username = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('username');
    });

    it('should fail with non-string username', async () => {
      (dto as any).username = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('username');
    });

    it('should fail with undefined username', async () => {
      dto.username = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('username');
    });
  });

  describe('password validation', () => {
    it('should fail with empty password', async () => {
      dto.password = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail with non-string password', async () => {
      (dto as any).password = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail with undefined password', async () => {
      dto.password = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });
  });
});