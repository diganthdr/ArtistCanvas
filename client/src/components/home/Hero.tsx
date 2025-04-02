import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
          alt="Featured artwork by Diganth" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-neutral opacity-20"></div>
      </div>
      
      <div className="container relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl text-center mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Bringing <span className="text-accent">Colors</span> to Life
          </h1>
          <p className="font-accent text-lg md:text-xl text-white mb-8">
            Explore oil, acrylic, and watercolor paintings crafted with passion
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/gallery">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Gallery
              </Button>
            </Link>
            <Link href="/workshops">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white bg-opacity-20 border-white border-opacity-40 text-white hover:bg-opacity-30">
                Join Workshops
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
