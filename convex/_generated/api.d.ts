/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as myFunctions from "../myFunctions.js";
import type * as passkeys from "../passkeys.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  myFunctions: typeof myFunctions;
  passkeys: typeof passkeys;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  passkeyAuth: {
    public: {
      cleanupExpiredChallenges: FunctionReference<
        "mutation",
        "internal",
        {},
        number
      >;
      cleanupExpiredSessions: FunctionReference<
        "mutation",
        "internal",
        {},
        number
      >;
      generateAuthenticationChallenge: FunctionReference<
        "mutation",
        "internal",
        { identifier?: string },
        {
          allowCredentials: Array<{ credentialId: string; type: string }>;
          challenge: string;
        }
      >;
      generateRegistrationChallenge: FunctionReference<
        "mutation",
        "internal",
        { displayName?: string; identifier: string },
        { challenge: string; displayName?: string; identifier: string }
      >;
      getOrCreateSigningKey: FunctionReference<
        "mutation",
        "internal",
        {},
        { algorithm: string; privateKey: string; publicKey: string }
      >;
      getOrCreateUser: FunctionReference<
        "mutation",
        "internal",
        { displayName?: string; identifier: string },
        {
          createdAt: number;
          displayName?: string;
          identifier: string;
          isNew: boolean;
          userId: string;
        }
      >;
      getPublicKey: FunctionReference<
        "query",
        "internal",
        {},
        { algorithm: string; publicKey: string } | null
      >;
      getUser: FunctionReference<
        "query",
        "internal",
        { userId: string },
        {
          createdAt: number;
          displayName?: string;
          identifier: string;
          userId: string;
        } | null
      >;
      invalidateAllSessions: FunctionReference<
        "mutation",
        "internal",
        { userId: string },
        number
      >;
      invalidateSession: FunctionReference<
        "mutation",
        "internal",
        { tokenHash: string },
        boolean
      >;
      listPasskeys: FunctionReference<
        "query",
        "internal",
        { userId: string },
        Array<{
          createdAt: number;
          credentialId: string;
          deviceName?: string;
          lastUsedAt: number;
          revoked: boolean;
        }>
      >;
      mintSessionJWT: FunctionReference<
        "mutation",
        "internal",
        {
          audience?: string;
          expiresInMs?: number;
          identifier: string;
          issuer: string;
          userId: string;
        },
        { expiresAt: number; token: string }
      >;
      revokePasskey: FunctionReference<
        "mutation",
        "internal",
        { credentialId: string },
        boolean
      >;
      validateSession: FunctionReference<
        "mutation",
        "internal",
        { tokenHash: string },
        {
          expiresAt?: number;
          reason?: "expired" | "revoked" | "invalid";
          userId?: string;
          valid: boolean;
        }
      >;
      verifyAuthentication: FunctionReference<
        "mutation",
        "internal",
        {
          challenge: string;
          counter: number;
          credentialId: string;
          refreshAfterMs?: number;
          sessionExpiryMs?: number;
        },
        { expiresAt: number; sessionToken: string; userId: string }
      >;
      verifyRegistration: FunctionReference<
        "mutation",
        "internal",
        {
          challenge: string;
          counter: number;
          credentialId: string;
          deviceName?: string;
          displayName?: string;
          identifier: string;
          publicKey: string;
        },
        { credentialId: string; userId: string }
      >;
    };
  };
};
