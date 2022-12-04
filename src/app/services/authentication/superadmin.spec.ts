import { Superadmin } from './superadmin';

describe('Superadmin', () => {
  it('should create an instance', () => {
    const a: Superadmin = {
      email: 'email',
    };
    expect(a).toBeTruthy();
  });
});
