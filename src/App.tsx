import { useState, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import {
  usePasskeyRegister,
  usePasskeyLogin,
  usePasskeyAuth,
} from "convex-passkey-auth/react";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">
            <span className="text-violet-400">convex-passkey-auth</span> demo
          </h1>
          <a
            href="https://github.com/TimpiaAI/convex-passkey-auth"
            className="text-sm text-slate-400 hover:text-white transition"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-6 flex flex-col gap-8">
        <p className="text-slate-400">
          Passwordless WebAuthn passkey authentication component for Convex —
          register passkeys, authenticate with biometrics, and manage sessions
          in real-time.
        </p>
        <WebAuthnCheck />
        <AuthDemo />
      </main>
    </div>
  );
}

function WebAuthnCheck() {
  const isSupported =
    typeof window !== "undefined" &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential === "function";

  if (isSupported) return null;

  return (
    <div className="bg-red-950 border border-red-800 rounded-lg p-4">
      <p className="text-red-400 text-sm font-medium">
        WebAuthn is not supported in this browser. Passkey authentication
        requires a modern browser with WebAuthn support (Chrome, Safari, Firefox,
        Edge).
      </p>
    </div>
  );
}

function AuthDemo() {
  const generateRegChallenge = useMutation(
    api.passkeys.generateRegistrationChallenge
  );
  const verifyReg = useMutation(api.passkeys.verifyRegistration);
  const generateAuthChallenge = useMutation(
    api.passkeys.generateAuthChallenge
  );
  const verifyAuthMutation = useMutation(api.passkeys.verifyAuth);
  const validateSessionMutation = useMutation(api.passkeys.validateSession);
  const logoutMutation = useMutation(api.passkeys.logout);

  const registerOptions = useMemo(
    () => ({
      generateChallenge: generateRegChallenge,
      verifyRegistration: verifyReg,
      rpName: "Passkey Auth Demo",
    }),
    [generateRegChallenge, verifyReg]
  );

  const loginOptions = useMemo(
    () => ({
      generateChallenge: generateAuthChallenge,
      verifyAuthentication: verifyAuthMutation,
    }),
    [generateAuthChallenge, verifyAuthMutation]
  );

  const authOptions = useMemo(
    () => ({
      validateSession: validateSessionMutation,
      invalidateSession: logoutMutation,
    }),
    [validateSessionMutation, logoutMutation]
  );

  const {
    register,
    isRegistering,
    error: regError,
  } = usePasskeyRegister(registerOptions);

  const {
    login,
    isLoggingIn,
    error: loginError,
  } = usePasskeyLogin(loginOptions);

  const { user, isAuthenticated, isLoading, logout } =
    usePasskeyAuth(authOptions);

  const [regUsername, setRegUsername] = useState("");
  const [regDisplayName, setRegDisplayName] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [regResult, setRegResult] = useState<{
    userId: string;
    credentialId: string;
  } | null>(null);
  const [loginResult, setLoginResult] = useState<{
    userId: string;
    expiresAt: number;
  } | null>(null);

  const handleRegister = async () => {
    if (!regUsername.trim()) return;
    try {
      const result = await register(regUsername.trim(), regDisplayName.trim() || undefined);
      setRegResult(result);
      setRegUsername("");
      setRegDisplayName("");
    } catch {
      // error is handled by the hook
    }
  };

  const handleLogin = async () => {
    try {
      const result = await login(loginUsername.trim() || undefined);
      setLoginResult({
        userId: result.userId,
        expiresAt: result.expiresAt,
      });
      setLoginUsername("");
    } catch {
      // error is handled by the hook
    }
  };

  const handleLogout = async () => {
    await logout();
    setLoginResult(null);
    setRegResult(null);
  };

  if (isLoading) {
    return (
      <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <p className="text-slate-500 text-sm">Checking session...</p>
      </section>
    );
  }

  return (
    <>
      {/* Session Status Banner */}
      <SessionBanner
        isAuthenticated={isAuthenticated}
        user={user}
        loginResult={loginResult}
        onLogout={handleLogout}
      />

      {/* Registration */}
      <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h2 className="text-lg font-semibold mb-1">Register Passkey</h2>
        <p className="text-xs text-slate-500 mb-4">
          Create a new account and register a passkey (fingerprint / Face ID /
          security key).
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Username (e.g. alice)"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
          />
          <input
            type="text"
            placeholder="Display name (optional)"
            value={regDisplayName}
            onChange={(e) => setRegDisplayName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
          />
          <button
            onClick={handleRegister}
            disabled={isRegistering || !regUsername.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed"
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>
        </div>
        {regError && (
          <div className="bg-red-950 border border-red-800 rounded p-3 mb-3">
            <p className="text-sm text-red-400">{regError.message}</p>
          </div>
        )}
        {regResult && (
          <div className="bg-violet-950 border border-violet-800 rounded p-4">
            <p className="text-xs text-violet-400 mb-1 font-medium">
              Passkey registered successfully!
            </p>
            <div className="flex flex-col gap-1 text-xs text-slate-400">
              <span>
                User ID:{" "}
                <code className="font-mono text-white">{regResult.userId}</code>
              </span>
              <span>
                Credential:{" "}
                <code className="font-mono text-white break-all">
                  {regResult.credentialId.slice(0, 24)}...
                </code>
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Authentication */}
      <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h2 className="text-lg font-semibold mb-1">Login with Passkey</h2>
        <p className="text-xs text-slate-500 mb-4">
          Authenticate using a registered passkey. Leave username blank for
          discoverable credential login.
        </p>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Username (optional for discoverable credentials)"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
          />
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoggingIn ? "Authenticating..." : "Login"}
          </button>
        </div>
        {loginError && (
          <div className="bg-red-950 border border-red-800 rounded p-3 mb-3">
            <p className="text-sm text-red-400">{loginError.message}</p>
          </div>
        )}
        {loginResult && (
          <div className="bg-violet-950 border border-violet-800 rounded p-4">
            <p className="text-xs text-violet-400 mb-1 font-medium">
              Authenticated successfully!
            </p>
            <div className="flex flex-col gap-1 text-xs text-slate-400">
              <span>
                User ID:{" "}
                <code className="font-mono text-white">
                  {loginResult.userId}
                </code>
              </span>
              <span>
                Session expires:{" "}
                <code className="font-mono text-white">
                  {new Date(loginResult.expiresAt).toLocaleString()}
                </code>
              </span>
            </div>
          </div>
        )}
      </section>

      {/* User Details + Passkey List (only when authenticated) */}
      {isAuthenticated && user && (
        <>
          <UserDetails userId={user.userId} />
          <PasskeyList userId={user.userId} />
        </>
      )}
    </>
  );
}

function SessionBanner({
  isAuthenticated,
  user,
  loginResult,
  onLogout,
}: {
  isAuthenticated: boolean;
  user: { userId: string; expiresAt?: number } | null;
  loginResult: { userId: string; expiresAt: number } | null;
  onLogout: () => void;
}) {
  const expiresAt = user?.expiresAt ?? loginResult?.expiresAt;

  return (
    <section
      className={`rounded-lg p-4 border flex items-center justify-between ${
        isAuthenticated
          ? "bg-violet-950/50 border-violet-800"
          : "bg-slate-900 border-slate-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isAuthenticated ? "bg-violet-400 animate-pulse" : "bg-slate-600"
          }`}
        />
        <div>
          <p className="text-sm font-medium">
            {isAuthenticated ? "Authenticated" : "Not authenticated"}
          </p>
          {isAuthenticated && user && (
            <p className="text-xs text-slate-400">
              User: <code className="font-mono">{user.userId}</code>
              {expiresAt && (
                <span className="ml-3">
                  Expires: {new Date(expiresAt).toLocaleString()}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      {isAuthenticated && (
        <button
          onClick={onLogout}
          className="text-xs text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-3 py-1.5 rounded transition cursor-pointer"
        >
          Logout
        </button>
      )}
    </section>
  );
}

function UserDetails({ userId }: { userId: string }) {
  const user = useQuery(api.passkeys.getUser, { userId });

  if (user === undefined) {
    return (
      <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h2 className="text-lg font-semibold mb-4">User Details</h2>
        <p className="text-slate-500 text-sm">Loading...</p>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <h2 className="text-lg font-semibold mb-4">User Details</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-slate-400">User ID</div>
        <div className="font-mono text-white break-all">{user.userId}</div>
        <div className="text-slate-400">Identifier</div>
        <div className="text-white">{user.identifier}</div>
        <div className="text-slate-400">Display Name</div>
        <div className="text-white">{user.displayName ?? "---"}</div>
        <div className="text-slate-400">Created</div>
        <div className="text-white">
          {new Date(user.createdAt).toLocaleString()}
        </div>
      </div>
    </section>
  );
}

function PasskeyList({ userId }: { userId: string }) {
  const passkeys = useQuery(api.passkeys.listPasskeys, { userId });
  const revoke = useMutation(api.passkeys.revokePasskey);

  if (passkeys === undefined) {
    return (
      <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h2 className="text-lg font-semibold mb-4">Registered Passkeys</h2>
        <p className="text-slate-500 text-sm">Loading...</p>
      </section>
    );
  }

  return (
    <section className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <h2 className="text-lg font-semibold mb-4">
        Registered Passkeys{" "}
        <span className="text-sm text-slate-500 font-normal">
          ({passkeys.length})
        </span>
      </h2>
      {passkeys.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No passkeys found. Register one above.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {passkeys.map((pk) => (
            <div
              key={pk.credentialId}
              className={`flex items-center justify-between bg-slate-800 rounded px-4 py-3 border ${
                pk.revoked ? "border-red-900 opacity-60" : "border-slate-700"
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {pk.deviceName ?? "Passkey"}
                  </span>
                  <code className="text-xs text-slate-400 font-mono">
                    {pk.credentialId.slice(0, 16)}...
                  </code>
                  {pk.revoked && (
                    <span className="text-xs bg-red-900 text-red-300 px-1.5 py-0.5 rounded">
                      revoked
                    </span>
                  )}
                </div>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span>
                    Created: {new Date(pk.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Last used: {new Date(pk.lastUsedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {!pk.revoked && (
                <button
                  onClick={() =>
                    revoke({ credentialId: pk.credentialId })
                  }
                  className="text-xs text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 px-3 py-1 rounded transition cursor-pointer"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
