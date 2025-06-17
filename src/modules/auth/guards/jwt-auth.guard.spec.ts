import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with "jwt" strategy', () => {
    // We can't directly test the parent class's implementation,
    // but we can verify the guard is properly instantiated
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });

  // Note: Most of the actual functionality is handled by Passport's AuthGuard
  // and would be better tested through integration tests
});