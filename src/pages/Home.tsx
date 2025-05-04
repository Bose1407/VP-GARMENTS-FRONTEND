import React from "react";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const featuredCategories = [
  {
    id: 1,
    name: "Summer Collection",
    image: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "/products",
  },
  {
    id: 2,
    name: "Accessories",
    image: "https://images.pexels.com/photos/9558577/pexels-photo-9558577.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "/products",
  },
  {
    id: 3,
    name: "New Arrivals",
    image: "https://images.pexels.com/photos/11731428/pexels-photo-11731428.jpeg?auto=compress&cs=tinysrgb&w=600",
    link: "/products",
  },
];

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-off-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden bg-neutral-100">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        <Container className="relative h-full flex flex-col justify-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-black leading-tight mb-4 animate-fade-in">
              Discover Your Unique Style
            </h1>
            <p className="text-lg text-white mb-8 animate-slide-up">
              Explore our wide range of products and find what defines your personal style.
            </p>
            <div className="flex space-x-4 animate-slide-up" style={{animationDelay: '200ms'}}>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => {}}
              >
                Shop Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="!border-white !text-white hover:!bg-white/20"
                onClick={() => {}}
              >
                View Collections
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <Container>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">Shop by Category</h2>
            <p className="text-neutral-600">Find your style in our curated collections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="group relative overflow-hidden rounded-lg h-[350px]"
              >
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                  <span className="inline-flex items-center text-sm font-medium text-white transition-all duration-300 group-hover:translate-x-1">
                    Shop Now <ArrowRight size={16} className="ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-neutral-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-3">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-neutral-600 mb-6">
              Be the first to know about new collections, special offers and exclusive events.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              />
              <Button variant="primary">Subscribe</Button>
            </form>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default Home;