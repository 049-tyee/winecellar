import Navbar from '@/components/Navbar';

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">管理后台</h1>
          <p className="text-neutral-400">页面开发中...</p>
        </div>
      </main>
    </>
  );
}
