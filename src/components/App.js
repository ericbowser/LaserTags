import React, { useState } from 'react';
import { Heart, Shield, Sparkles, ChevronRight, QrCode, Zap, Check, Star, Eye } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

// Silicone tag images
import orangeBone from '../assets/Materials/Silicone/orange_bone.png';
import turquoiseHex from '../assets/Materials/Silicone/turquoise_hex.png';
import blueCircle from '../assets/Materials/Silicone/blue_circ.jpg';
import pinkRect from '../assets/Materials/Silicone/pink_rect.png';
import greenTri from '../assets/Materials/Silicone/green_tri.png';

// Hero collection image
import heroCollection from '../assets/Materials/Silicone/Examples/hero_collection.png';

import DarkModeToggle from './DarkModeToggle';

function App() {
  const [hoveredTag, setHoveredTag] = useState(null);
  const navigate = useNavigate();

  const tagStyles = [
    { id: 1, name: 'Bone', shape: 'bone', image: orangeBone },
    { id: 2, name: 'Hexagon', shape: 'hex', image: turquoiseHex },
    { id: 3, name: 'Circle', shape: 'circle', image: blueCircle },
    { id: 4, name: 'Rectangle', shape: 'rect', image: pinkRect },
    { id: 5, name: 'Triangle', shape: 'tri', image: greenTri },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-charcoal-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-charcoal-800/95 backdrop-blur-md border-b border-gray-200 dark:border-charcoal-700 shadow-sm dark:shadow-dark">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
          </div>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <button 
              onClick={() => navigate('/create-tag')} 
              className="bg-coral-500 hover:bg-coral-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-coral transform hover:scale-105 active:scale-95"
            >
              Create Your Tag
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-charcoal-900 dark:via-charcoal-800 dark:to-charcoal-900 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            Keep Your Pet Safe with
            <span className="block text-coral-500 mt-2">Smart ID Tags</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Laser-engraved tags with QR codes that connect finders directly to you.
            <br className="hidden md:block" />
            Durable, weatherproof, and designed to last a lifetime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => navigate('/create-tag')} 
              className="group px-8 py-4 bg-coral-500 hover:bg-coral-600 text-white font-bold text-lg rounded-xl shadow-coral transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              Create Your Tag
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => {
                const element = document.getElementById('examples');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-gray-900 dark:text-white font-bold text-lg rounded-xl border-2 border-gray-300 dark:border-charcoal-600 hover:border-gray-400 dark:hover:border-charcoal-500 transition-all duration-200 flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              See Examples
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-coral-500" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-coral-500" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-coral-500" />
              <span>5-Star Quality</span>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-charcoal-900 to-transparent"></div>
      </section>

      {/* HERO IMAGE SHOWCASE */}
      <section id="examples" className="py-20 bg-white dark:bg-charcoal-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left: Hero Image */}
            <div className="order-2 md:order-1">
              <div className="bg-neutral-100 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={heroCollection}
                  alt="LaserTags Collection - Professional Laser Engraved Pet ID Tags"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right: Benefits */}
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Professional Laser Engraving
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                Every tag is precision-engraved in our workshop. Never fades, never wears off.
              </p>
              
              <ul className="space-y-6 mb-8">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-coral-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">QR Code or Text</h4>
                    <p className="text-gray-600 dark:text-gray-400">Choose instant scan-to-contact or custom engraving with up to 3 lines per side</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-coral-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">30 Colors & Shapes</h4>
                    <p className="text-gray-600 dark:text-gray-400">Find the perfect match for your pet's personality with our huge selection</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-coral-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Lifetime Guarantee</h4>
                    <p className="text-gray-600 dark:text-gray-400">If the engraving fades or wears off, we'll replace it free - that's our promise</p>
                  </div>
                </li>
              </ul>

              <button
                onClick={() => navigate('/create-tag')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-coral-500 hover:bg-coral-600 text-white font-bold text-lg rounded-xl shadow-coral transform hover:scale-105 transition-all duration-200"
              >
                Design Your Tag Now
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="max-w-6xl mx-auto px-4 py-16 bg-gray-50 dark:bg-charcoal-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Choose Your Style
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Select from durable silicone tags in multiple shapes and vibrant colors
        </p>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {tagStyles.map((tag) => (
            <button
              key={tag.id}
              onClick={() => navigate('/create-tag')}
              onMouseEnter={() => setHoveredTag(tag.id)}
              onMouseLeave={() => setHoveredTag(null)}
              className="group bg-white dark:bg-charcoal-800 rounded-2xl border-2 border-gray-200 dark:border-charcoal-700 hover:border-coral-500 overflow-hidden shadow-sm dark:hover:shadow-dark transform hover:scale-105 transition-all duration-200"
            >
              {/* Tag Image Area */}
              <div className="h-48 relative flex items-center justify-center p-6 bg-neutral-200">
                <img 
                  src={tag.image} 
                  alt={`${tag.name} tag`}
                  className="w-28 h-28 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              
              {/* Tag Name */}
              <div className="p-4 bg-white dark:bg-charcoal-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{tag.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available in multiple colors</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-100 dark:bg-charcoal-800 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Why Choose LaserTags?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Professional laser engraving that never fades
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-charcoal-900 p-8 rounded-2xl border border-gray-200 dark:border-charcoal-700 hover:border-coral-500 dark:hover:border-coral-500/50 transition-all duration-200">
              <div className="w-16 h-16 bg-coral-500/10 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-coral-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Weatherproof & Durable</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Laser engraving never fades, chips, or wears off - guaranteed for life
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-charcoal-900 p-8 rounded-2xl border border-gray-200 dark:border-charcoal-700 hover:border-coral-500 dark:hover:border-coral-500/50 transition-all duration-200">
              <div className="w-16 h-16 bg-coral-500/10 rounded-full flex items-center justify-center mb-6">
                <QrCode className="w-8 h-8 text-coral-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Smart QR Codes</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Anyone can scan to contact you instantly - no app required
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-charcoal-900 p-8 rounded-2xl border border-gray-200 dark:border-charcoal-700 hover:border-coral-500 dark:hover:border-coral-500/50 transition-all duration-200">
              <div className="w-16 h-16 bg-coral-500/10 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-coral-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Fast Turnaround</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Most orders ship within 2-3 business days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white dark:bg-charcoal-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Simple, Affordable Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-16">
            One price, unlimited peace of mind
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl border-2 border-coral-500 shadow-xl dark:shadow-coral">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">$11.99</div>
                <div className="text-gray-600 dark:text-gray-400">per tag</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-coral-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Lifetime laser engraving warranty</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-coral-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">QR code or text engraving</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-coral-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Weatherproof silicone material</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-coral-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Free shipping on 2+ tags</span>
                </li>
              </ul>
              
              <button 
                onClick={() => navigate('/create-tag')}
                className="block w-full py-4 bg-coral-500 hover:bg-coral-600 text-white font-bold text-lg rounded-xl text-center shadow-coral transform hover:scale-105 transition-all duration-200"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-charcoal-900 dark:to-charcoal-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Protect Your Pet?
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of pet owners who trust LaserTags to keep their furry friends safe.
          </p>
          
          <button 
            onClick={() => navigate('/create-tag')}
            className="inline-flex items-center gap-2 px-10 py-5 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xl rounded-xl shadow-coral transform hover:scale-105 transition-all duration-200"
          >
            Create Your Tag Now
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-charcoal-900 border-t border-gray-200 dark:border-charcoal-700 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Keeping pets safe, one tag at a time.</p>
          <p className="text-xs text-gray-500">© 2025 LaserTags. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
