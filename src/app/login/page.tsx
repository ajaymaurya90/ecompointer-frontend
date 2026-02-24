import LoginForm from "@/components/Auth/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-zinc-950">

            {/* Left Branding Panel */}
            <div className="hidden lg:flex relative w-1/2 
                bg-gradient-to-br 
                from-slate-900 via-blue-950 to-slate-950 
                text-white p-12 flex-col justify-between overflow-hidden">

                {/* Ambient Blue Glow */}
                <div className="absolute -top-32 -left-32 w-96 h-96 
                    bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 
                    bg-indigo-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-semibold tracking-wide text-white/90">
                        ECOMPOINTER
                    </h1>

                    <p className="mt-6 text-4xl font-semibold leading-tight">
                        Multi-Brand Garment Management
                    </p>

                    <p className="mt-4 text-slate-300 max-w-md leading-relaxed">
                        Built for scalable fashion businesses. Manage products,
                        variants, inventory and retail operations from one
                        centralized platform.
                    </p>
                </div>

                <p className="relative z-10 text-sm text-slate-400">
                    © {new Date().getFullYear()} ecompointer. All rights reserved.
                </p>
            </div>

            {/* Right Login Section */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
                <LoginForm />
            </div>

        </div>
    );
}