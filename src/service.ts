import { Injectable } from '@angular/core';

@Injectable()
export class Auth {
  private __jwt: string;
  private __as: AuthStorage;
  private __decoder: AuthDecoder;
  private __ready: Promise<void>;

  public JWT_KEY = '__jwt';

  async setup(ac: AuthConfig) {
    this.__as = ac.storage;
    this.__decoder = ac.decoder;
    this.__ready = this.readStorage();
    await this.__ready;
  }

  ready() {
    return this.__ready;
  }

  private async readStorage() {
    const jwt = await this.__as.get(this.JWT_KEY);
    if(jwt && jwt !== 'null') {
      this.__jwt = jwt;
    }
  }

  get jwt(): string {
    return this.__jwt;
  }

  get isAuthenticated(): boolean {
    return !!this.info;
  }

  signJwt(jwt: string): Promise<any> {
    this.__jwt = jwt;
    return this.__as.set(this.JWT_KEY, jwt);
  }

  get info(): AuthInfo {
    if (!this.__jwt) return null;
    const decoded: any = this.__decoder(this.__jwt);
    const now = new Date().getTime();
    if (now < decoded.exp * 1000) {
      return decoded;
    }
    return null;
  }

  hasRoles(...roles: string[]): boolean {
    for(let role of roles) {
      if(!~this.info.roles.indexOf(role)) return false;
    }
    return true;
  }

  async signout(): Promise<void> {
    delete this.__jwt;
    await this.__as.delete(this.JWT_KEY);
  }
}

export interface AuthConfig {
  storage: AuthStorage;
  decoder: AuthDecoder;
}

export type AuthDecoder = (jwt: string) => AuthInfo;

export interface AuthStorage {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<any>;
  delete(key: string): Promise<any>;
  clear(): Promise<any>;
}

export interface AuthInfo {
  _id: string;
  roles: Array<string>;
  username: string;
  providers: Array<{
    name: string;
    openid: string;
  }>;
};