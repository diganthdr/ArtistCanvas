import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-heading text-3xl font-bold text-neutral mb-4">About Diganth</h2>
            
            <div className="space-y-4 text-neutral">
              <p>
                I am a contemporary artist specializing in oil, acrylic, and watercolor paintings. 
                My work explores the interplay between nature and emotion, seeking to capture 
                moments of tranquility and wonder.
              </p>
              
              <p>
                With over 15 years of artistic experience, I have developed a distinctive style 
                that blends traditional techniques with modern sensibilities. My paintings have 
                been featured in galleries across the country and in private collections worldwide.
              </p>
              
              <p>
                I believe in the power of art to transform spaces and connect people through 
                shared visual experiences. This belief extends to my teaching philosophy, where 
                I guide students to discover their unique artistic voice.
              </p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button className="w-full sm:w-auto">Get in Touch</Button>
              </Link>
              <Link href="/gallery">
                <Button variant="secondary" className="w-full sm:w-auto">View My Work</Button>
              </Link>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-accent rounded-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80" 
                alt="Artist Diganth in studio" 
                className="relative z-10 w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
