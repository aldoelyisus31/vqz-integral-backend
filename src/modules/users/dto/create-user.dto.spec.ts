import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.username = 'johndoe';
    dto.email = 'john.doe@example.com';
    dto.password = 'password123';
    dto.fullName = 'John Doe';
    dto.userTypeId = 1;
    dto.accessMethodId = 1;
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

    it('should fail with username shorter than 3 characters', async () => {
      dto.username = 'ab';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('username');
    });
  });

  describe('email validation', () => {
    it('should fail with invalid email format', async () => {
      dto.email = 'invalid-email';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail with empty email', async () => {
      dto.email = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('password validation', () => {
    it('should fail with empty password', async () => {
      dto.password = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should fail with password shorter than 8 characters', async () => {
      dto.password = '1234567';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('fullName validation', () => {
    it('should pass with undefined fullName', async () => {
      dto.fullName = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if fullName is not a string', async () => {
      (dto as any).fullName = 123;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('fullName');
    });
  });

  describe('userTypeId validation', () => {
    it('should fail with undefined userTypeId', async () => {
      dto.userTypeId = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userTypeId');
    });

    it('should fail if userTypeId is not a number', async () => {
      (dto as any).userTypeId = 'not-a-number';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userTypeId');
    });
  });

  describe('accessMethodId validation', () => {
    /* it('should fail with undefined accessMethodId', async () => {
      dto.accessMethodId = undefined;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('accessMethodId');
    }); */

    it('should fail if accessMethodId is not a number', async () => {
      (dto as any).accessMethodId = 'not-a-number';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('accessMethodId');
    });
  });
});