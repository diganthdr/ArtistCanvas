import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="font-heading text-2xl font-bold text-white hover:text-accent transition">
              Diganth
            </Link>
            <p className="text-gray-400 mt-3 text-sm">
              Contemporary artist specializing in oil, acrylic, and watercolor paintings.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading text-white text-lg font-medium mb-4">Site Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-accent transition text-sm">Home</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-accent transition text-sm">Gallery</Link></li>
              <li><Link href="/workshops" className="text-gray-400 hover:text-accent transition text-sm">Workshops</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-accent transition text-sm">About</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-accent transition text-sm">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-white text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-accent transition text-sm">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition text-sm">Shipping & Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent transition text-sm">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-white text-lg font-medium mb-4">Join the Community</h4>
            <p className="text-gray-400 text-sm mb-4">
              Follow on social media for behind-the-scenes content and early announcements.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-accent transition">
                <i className="bx bxl-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition">
                <i className="bx bxl-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition">
                <i className="bx bxl-pinterest text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition">
                <i className="bx bxl-youtube text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Diganth. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 sm:mt-0">
            Designed with <i className="bx bxs-heart text-accent inline-block"></i> for artists
          </p>
        </div>
      </div>
    </footer>
  );
}
