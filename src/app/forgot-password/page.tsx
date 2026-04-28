import AuthSplitLayout from "@/modules/auth/components/AuthSplitLayout";
import ForgotPasswordForm from "@/modules/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <AuthSplitLayout>
            <ForgotPasswordForm />
        </AuthSplitLayout>
    );
}
