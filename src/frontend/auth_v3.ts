import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

const getDatabaseConfig = () => {
    // Detect if we are in a build environment (Next.js build phase)
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL;

    // During build, always use memory SQLite to prevent connection errors
    if (isBuildPhase || !process.env.DATABASE_URL) {
        return {
            provider: "sqlite",
            url: ":memory:",
        };
    }

    const url = process.env.DATABASE_URL;
    if (url.startsWith("postgres")) {
        return {
            provider: "postgresql",
            url: url,
        };
    }

    return {
        provider: "sqlite",
        url: url.replace("sqlite:///", ""),
    };
};

export const auth = betterAuth({
    database: getDatabaseConfig(),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        jwt({
            jwt: {
                issuer: "todo-evolution",
                expiresIn: "7d"
            }
        })
    ]
});
