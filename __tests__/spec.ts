import { inject, TestBed } from '@angular/core/testing';
import * as jwt from 'jsonwebtoken';

import { AuthModule, Auth } from '../src';

describe('AuthModule', () => {
  let auth: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AuthModule.forRoot()
      ]
    });
  });

  beforeEach(inject([Auth], (_auth) => {
    auth = _auth;
    auth.setup({
      storage: {
        get: x => Promise.resolve(localStorage.getItem(x)),
        set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
        delete: x => Promise.resolve(localStorage.removeItem(x)),
        clear: () => Promise.resolve(localStorage.clear())
      },
      decoder: jwt.decode as any
    })
  }));

  it('Should be defined', () => {
    expect(auth).toBeDefined();
  });

  it('Should be not authenticated', () => {
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.info).toBe(null);
    expect(auth.jwt).toBeFalsy();
  });

  it('Should be authenticated', () => {
    const token = jwt.sign({
      username: 'tom',
      roles: ['admin', 'user']
    }, 'secret', { expiresIn: '1m' });
    auth.signJwt(token);
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.info).toBeTruthy();
    expect(auth.jwt).toBeTruthy();
  });

  it('Should have role admin', () => {
    expect(auth.hasRoles('admin')).toBe(true);
  });

  it('Should not have role super', () => {
    expect(auth.hasRoles('super')).toBe(false);
  });

  it('Should be expired', () => {
    const token = jwt.sign({
      username: 'tom',
      roles: ['admin', 'user']
    }, 'secret', { expiresIn: '0s' });
    auth.signJwt(token);
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.info).toBe(null);
  });

  it('Should signout', async () => {
    const token = jwt.sign({
      username: 'tom',
      roles: ['admin', 'user']
    }, 'secret', { expiresIn: '1m' });
    auth.signJwt(token);
    await auth.signout();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.info).toBe(null);
    expect(auth.jwt).toBeFalsy();
  });
});
