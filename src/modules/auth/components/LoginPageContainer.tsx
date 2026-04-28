"use client";

import AuthSplitLayout from "@/modules/auth/components/AuthSplitLayout";
import LoginForm from "@/modules/auth/components/LoginForm";

export default function LoginPageContainer() {
    return (
        <AuthSplitLayout>
                <LoginForm />
        </AuthSplitLayout>
    );
}
