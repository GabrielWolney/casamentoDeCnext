"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FBFE] gap-4">
      <p className="text-lg text-[#1a2634] font-[family-name:var(--font-crimson)]">
        Algo deu errado.
      </p>
      <button
        onClick={reset}
        className="bg-[#6B93B8] text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-[#5a81a3]"
      >
        Tentar novamente
      </button>
    </div>
  );
}