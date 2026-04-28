import { Suspense } from "react";
import AuthSplitLayout from "@/modules/auth/components/AuthSplitLayout";
import ResetPasswordForm from "@/modules/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <AuthSplitLayout>
            <Suspense fallback={null}>
                <ResetPasswordForm />
            </Suspense>
        </AuthSplitLayout>
    );
}
