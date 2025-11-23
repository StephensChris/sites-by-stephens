export function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400">© 2025 Sites by Stephens. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
