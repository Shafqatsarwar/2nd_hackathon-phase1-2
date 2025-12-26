import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

const getDatabaseConfig = () => {
    // Determine if we are in build/static generation phase
    // Better Auth must NOT attempt a real connection during build
    const isBuild =
        process.env.NEXT_PHASE === 'phase-production-build' ||
        process.env.CI === 'true' ||
        (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production');

    if (isBuild || !process.env.DATABASE_URL) {
        console.log("🛠️ Auth: Using memory fallback for build/static phase");
        return {
            provider: "sqlite",
            url: ":memory:",
        };
    }

    const url = process.env.DATABASE_URL;
    console.log("📡 Auth: Using database connection");

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
