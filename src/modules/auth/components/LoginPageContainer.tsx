"use client";

import LoginForm from "@/modules/auth/components/LoginForm";

export default function LoginPageContainer() {
    return (
        <div className="flex min-h-screen bg-background">

            {/* Left Branding Panel */}
            <div
                className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-sidebar p-12 text-white lg:flex"
            >
                {/* Ambient Glow */}
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-semibold tracking-wide text-white/90">
                        ECOMPOINTER
                    </h1>

                    <p className="mt-6 text-4xl font-semibold leading-tight">
                        Multi-Brand Garment Management
                    </p>

                    <p className="mt-4 max-w-md leading-relaxed text-textSidebar-muted">
                        Built for scalable fashion businesses. Manage products,
                        variants, inventory and retail operations from one
                        centralized platform.
                    </p>
                </div>

                <p className="relative z-10 text-sm text-textSidebar-muted">
                    © {new Date().getFullYear()} ecompointer. All rights reserved.
                </p>
            </div>

            {/* Right Login Section */}
            <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
                <LoginForm />
            </div>

        </div>
    );
}