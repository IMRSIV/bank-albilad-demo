import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {/* Bank AlBilad Official Logo */}
            <div className="relative w-32 h-12">
              <Image
                src="https://www.bankalbilad.com.sa/az/images/logo.png"
                alt="بنك البلاد - Bank AlBilad"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-bank-primary hover:text-bank-red transition-colors font-medium"
            >
              البحث عن عقار
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <a 
              href="https://www.bankalbilad.com.sa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-bank-primary transition-colors text-sm"
            >
              الموقع الرسمي
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

