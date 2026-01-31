import { Star } from 'lucide-react';
import { testimonials } from '../data/landingPageData';

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="relative z-10 px-6 py-20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Developers Love It</h2>
                    <p className="text-xl text-gray-400">Join thousands of developers who've accelerated their workflow</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl border border-gray-700 p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-bold">
                                    {testimonial.avatar}
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                            <div className="flex mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
