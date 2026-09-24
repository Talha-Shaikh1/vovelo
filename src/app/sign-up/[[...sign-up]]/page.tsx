import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { BrandLogo } from '@/components/storefront/BrandLogo';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4">
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <BrandLogo size="md" />
        </Link>
        <p className="text-xs text-[#666660] mt-2">
          Create Staff or Verified Merchant Account
        </p>
      </div>

      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-white shadow-xl rounded-2xl border border-[#E4E4E0]',
            formButtonPrimary: 'bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold',
            footerActionLink: 'text-[#0F5132] hover:underline font-bold',
          },
        }}
      />
    </div>
  );
}
