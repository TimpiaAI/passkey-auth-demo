import { PasskeyAuth } from "convex-passkey-auth";
import { components } from "./_generated/api.js";
import { mutation, query } from "./_generated/server.js";
import { v } from "convex/values";

const passkeyAuth = new PasskeyAuth(components.passkeyAuth, {
  rpName: "Passkey Auth Demo",
  sessionExpiryMs: 30 * 24 * 60 * 60 * 1000, // 30 days
  refreshAfterMs: 24 * 60 * 60 * 1000, // refresh daily
});

/** Generate a registration challenge */
export const generateRegistrationChallenge = mutation({
  args: { identifier: v.string(), displayName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await passkeyAuth.generateRegistrationOptions(ctx, args);
  },
});

/** Verify a registration response from the browser */
export const verifyRegistration = mutation({
  args: {
    identifier: v.string(),
    credentialId: v.string(),
    publicKey: v.string(),
    challenge: v.string(),
    counter: v.number(),
    deviceName: v.optional(v.string()),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await passkeyAuth.verifyRegistration(ctx, args);
  },
});

/** Generate an authentication challenge */
export const generateAuthChallenge = mutation({
  args: { identifier: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await passkeyAuth.generateAuthenticationOptions(ctx, args);
  },
});

/** Verify an authentication response and create a session */
export const verifyAuth = mutation({
  args: {
    credentialId: v.string(),
    challenge: v.string(),
    counter: v.number(),
  },
  handler: async (ctx, args) => {
    return await passkeyAuth.verifyAuthentication(ctx, args);
  },
});

/** Validate a session token */
export const validateSession = mutation({
  args: { tokenHash: v.string() },
  handler: async (ctx, args) => {
    return await passkeyAuth.validateSession(ctx, args.tokenHash);
  },
});

/** Logout (invalidate session) */
export const logout = mutation({
  args: { tokenHash: v.string() },
  handler: async (ctx, args) => {
    return await passkeyAuth.logout(ctx, args.tokenHash);
  },
});

/** Get user info */
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await passkeyAuth.getUser(ctx, args.userId);
  },
});

/** List passkeys for a user */
export const listPasskeys = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await passkeyAuth.listPasskeys(ctx, args.userId);
  },
});

/** Revoke a passkey */
export const revokePasskey = mutation({
  args: { credentialId: v.string() },
  handler: async (ctx, args) => {
    return await passkeyAuth.revokePasskey(ctx, args.credentialId);
  },
});
