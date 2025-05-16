import Image from "next/image";
import ChatInputBox from "./_components/ChatInputBox";

export default function Home() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center justify-between">
      {/* Header Section */}
      <header className="w-full text-center pt-18">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 drop-shadow-sm">Welcome to OrbiQ</h1>
        <p className="mt-3 text-gray-600 text-lg sm:text-xl">Ask anything, get instant answers.</p>
      </header>

      {/* Chat Box */}
      <main className="flex-grow w-full flex items-center justify-center">
        <ChatInputBox />
      </main>

      {/* Footer Section */}
      <div className="w-full text-center py-6 text-gray-500 text-sm">
        <p>Powered by AI | © {new Date().getFullYear()} OrbiQ</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </div>
    </div>
  );
}
