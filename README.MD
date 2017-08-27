[![Build Status](https://travis-ci.org/yc-angular/auth.svg?branch=master)](https://travis-ci.org/yc-angular/auth.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/yc-angular/auth/badge.svg?branch=master)](https://coveralls.io/github/yc-angular/auth?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# @yci/auth

## Installation

1. Install the Ionic plugin
```
 npm i -S @yci/auth
```

2. Add it to your app’s NgModule.

```typescript
// Import your library
import { AuthModule } from '@yci/auth';

@NgModule({

  ...

  imports: [

    ...

    // Specify your library as an import
    AuthModule.forRoot()
  ],
  
  ...

})
export class AppModule { }
```

3. setup storage and decoder

```ts
import { Auth } from '@yci/auth';
import * as jwt from 'jsonwebtoken';

constructor(public auth: Auth) {
  auth.setup({
    storage: {
      get: x => Promise.resolve(localStorage.getItem(x)),
      set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
      clear: () => Promise.resolve(localStorage.clear())
    },
    decoder: jwt.decode as any
  })
}

```
## Usage
Once your library is imported, you can use its service in your Angular application:

```ts
import { Auth } from '@yci/auth';

constructor(public auth: Auth) {
  auth.user // get the user payload
}
```

## Methods and Properties
```ts
  setup(ac: AuthConfig): void;
  signJwt(jwt: string): Promise<any>;
  hasRoles(...roles: string[]): boolean;
  signout(): Promise<void>;

  get jwt(): string;
  get isAuthenticated(): boolean;
  get user(): AuthUser;
```

## Interfaces and Types
```ts
export type AuthDecoder = (jwt: string) => AuthUser;

export interface AuthConfig {
  storage: AuthStorage;
  decoder: AuthDecoder;
}

export interface AuthStorage {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<any>;
  clear(): Promise<any>;
}

export interface AuthUser {
  _id: string;
  roles: Array<string>;
  username: string;
};
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

## License

MIT © [Yu Chen](mailto:yu.chen@live.ie)

