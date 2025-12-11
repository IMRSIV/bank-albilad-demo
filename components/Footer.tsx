export default function Footer() {
  return (
    <footer className="bg-bank-primary text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">بنك البلاد</h3>
            <p className="text-gray-300 text-sm">
              خدمة البحث عن العقارات بالتعاون مع منصة سكني
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="https://www.bankalbilad.com.sa" target="_blank" rel="noopener noreferrer" className="hover:text-bank-accent transition-colors">
                  الموقع الرسمي
                </a>
              </li>
              <li>
                <a href="https://sakani.sa" target="_blank" rel="noopener noreferrer" className="hover:text-bank-accent transition-colors">
                  منصة سكني
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>هاتف: 8001230000</li>
              <li>
                <a href="mailto:info@bankalbilad.com.sa" className="hover:text-bank-accent transition-colors">
                  info@bankalbilad.com.sa
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>© 2025 بنك البلاد. جميع الحقوق محفوظة.</p>
          <p className="mt-2">هذا موقع تجريبي لعرض إمكانيات البحث عن العقارات</p>
        </div>
      </div>
    </footer>
  )
}

