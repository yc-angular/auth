import { Injectable } from '@angular/core';

@Injectable()
export class Auth {
  private __jwt: string;
  private __as: AuthStorage;
  private __decoder: AuthDecoder;

  setup(ac: AuthConfig) {
    this.__as = ac.storage;
    this.__decoder = ac.decoder;
    this.readStorage();
  }

  private async readStorage() {
    this.__jwt = await this.__as.get('__jwt');
  }

  get jwt(): string {
    return this.__jwt;
  }

  get isAuthenticated(): boolean {
    return !!this.user;
  }

  signJwt(jwt: string): Promise<any> {
    this.__jwt = jwt;
    return this.__as.set('__jwt', jwt);
  }

  get user(): AuthUser {
    if (!this.__jwt) return null;
    const decoded: any = this.__decoder(this.__jwt);
    const now = new Date().getTime();
    if (now < decoded.exp * 1000) {
      return decoded;
    }
    return null;
  }

  hasRoles(...roles: string[]): boolean {
    const user = this.user;
    for(let role of roles) {
      if(!~user.roles.indexOf(role)) return false;
    }
    return true;
  }

  async signout(): Promise<void> {
    delete this.__jwt;
    await this.__as.delete('__jwt');
  }
}

export interface AuthConfig {
  storage: AuthStorage;
  decoder: AuthDecoder;
}

export type AuthDecoder = (jwt: string) => AuthUser;

export interface AuthStorage {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<any>;
  delete(key: string): Promise<any>;
  clear(): Promise<any>;
}

export interface AuthUser {
  _id: string;
  roles: Array<string>;
  username: string;
};