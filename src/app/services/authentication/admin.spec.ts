import { Admin } from './admin';

describe('Admin', () => {
  it('should create an instance', () => {
    let a: Admin = { email: 'email@email.com' };
    expect(a).toBeTruthy();
  });
});
