import Link from "next/link";

export default function Navbar(){
    return(
    <nav className="w-full bg-[black] px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo / Brand */}
        <h1 className="text-xl font-bold text-white">
          LibraryMate
        </h1>

        {/* Links */}
        <ul className="flex gap-6 text-white font-meduim">
          <li className="cursor-pointer hover:text-zinc-600"><Link href="/">Home</Link></li>
          <li className="cursor-pointer hover:text-zinc-600">About</li>
          <li className="cursor-pointer hover:text-zinc-600">Contact</li>
          <li className="cursor-pointer hover:text-zinc-600"><Link href="/login">Login</Link></li>
        </ul>
      </div>
    </nav>)
}