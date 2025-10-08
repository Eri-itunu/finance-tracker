import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AIPromptClient from './AIPromptClient';

export default async function Page() {
  const session = await auth();
  if (!session) redirect('/');

  return (
    <main className="p-4">
      <h1 className="mb-4 text-xl">AI — Ask about your spending</h1>
      {/* Client component handles prompt + display */}

      <AIPromptClient />
    </main>
  );
}
