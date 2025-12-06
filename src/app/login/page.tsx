import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F5E9] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <LoginForm />
      </div>
    </div>
  );
}
