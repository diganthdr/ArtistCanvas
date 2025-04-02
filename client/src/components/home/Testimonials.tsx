import { Card, CardContent } from "@/components/ui/card";

// Testimonial data for static display
const testimonials = [
  {
    quote: "Diganth's oil painting workshop completely transformed my approach to art. His techniques are accessible and his passion is contagious!",
    name: "Sarah J.",
    role: "Workshop Student",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
  },
  {
    quote: "The watercolor landscape I purchased brings me joy every day. Diganth's unique style captures light in a way I've never seen before.",
    name: "Michael T.",
    role: "Collector",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
  },
  {
    quote: "I've attended both online and in-person workshops, and Diganth's teaching style works beautifully in both formats. Truly inspirational!",
    name: "Lisa R.",
    role: "Workshop Student",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-neutral mb-3">Testimonials</h2>
          <p className="font-body text-neutral max-w-2xl mx-auto">
            What collectors and workshop students have to say
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-1">
                  <i className="bx bxs-star text-accent"></i>
                  <i className="bx bxs-star text-accent"></i>
                  <i className="bx bxs-star text-accent"></i>
                  <i className="bx bxs-star text-accent"></i>
                  <i className="bx bxs-star text-accent"></i>
                </div>
                
                <blockquote className="font-accent italic text-neutral mb-4">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-body font-medium text-neutral">{testimonial.name}</p>
                    <p className="text-neutral text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
