import React, { useState } from 'react';
import { Heart, Shield, Sparkles, Star, ChevronRight } from 'lucide-react';
import bone from '../assets/Materials/Silicone/orange_bone.png';
import tri from '../assets/Materials/Silicone/red_tri.jpg';
import bar from '../assets/Materials/Silicone/blue_rect.jpg';
import hex from '../assets/Materials/Silicone/orange_circ.jpg';
import logo from '../assets/collarculture.jpg';
import {useNavigate} from 'react-router-dom';

function App() {
  const [hoveredTag, setHoveredTag] = useState(null);
  const navigate = useNavigate();

  const tagStyles = [
    { id: 1, name: 'Bone', shape: 'bone', popular: true, price: 11.99 },
    { id: 2, name: 'Tri', shape: 'tri', popular: false, price: 11.99 },
    { id: 3, name: 'Circle', shape: 'circle', popular: false, price: 11.99 },
    { id: 4, name: 'Bar', shape: 'rect', popular: false, price: 11.99 },
  ];

  const sampleEngravings = [
    { name: 'TRIGGER', phone: '555-0123', style: 'bold' },
    { name: 'ABRAHAM', phone: '555-555-0456', style: 'elegant' },
    { name: 'DIGGER', phone: '555-555-0789', style: 'playful' },
    { name: 'TINKER', phone: '555-555-1234', style: 'playful' },
  ];

  return (
    <div className={'text-center mr-24 ml-24 relative'}>
      {/* Gradient overlay - black to white gradient across the page (left to right) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(to right, #000000 0%, rgba(0, 0, 0, 0.6) 30%, rgba(255, 255, 255, 0.2) 70%, rgba(255, 255, 255, 0.05) 100%)'
          }}
        ></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
      {/* Header */}
      <header className="transparent backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Collar Culture Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>
          <button onClick={() => navigate('/create-tag')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          Premium Laser Engraving
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
          Keep Your Best Friend Safe
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Custom laser-engraved pet ID tags that last a lifetime. Beautiful designs, crystal-clear engraving, and peace of mind.
        </p>
        <button onClick={() => navigate('/create-tag')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-2">
          Create Your Tag
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <Shield className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Durable & Safe</h3>
            <p className="text-gray-600">Laser engraving that won't fade or scratch. Your pet's info stays readable forever.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <Sparkles className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Custom Designs</h3>
            <p className="text-gray-600">Choose from multiple shapes, materials, and engraving styles to match your pet's personality.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <Heart className="w-12 h-12 text-blue-600 mb-4" fill="currentColor" />
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Your custom tag ships within 24 hours. Get your peace of mind delivered fast.</p>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Choose Your Style</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Select from our most popular designs</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tagStyles.map((tag) => (
            <div
              key={tag.id}
              onClick={() => navigate('/create-tag')}
              onMouseEnter={() => setHoveredTag(tag.id)}
              onMouseLeave={() => setHoveredTag(null)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer relative"
            >
              <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-8">
                {tag.shape === 'bone' && (
                  <img src={bone} alt={'orange_bone_tag'} className="w-40 h-40 object-contain"/>
                )}
                {tag.shape === 'tri' && (
                  <img src={tri} alt={'triangle_tag'} className="w-40 h-40 object-contain"/>
                )}
                {tag.shape === 'circle' && (
                  <img src={hex} alt={'silicone_circle'} className="w-40 h-40 object-contain"/>
                )}
                {tag.shape === 'rect' && (
                  <img src={bar} alt={'bar_tag'} className="w-40 h-40 object-contain"/>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{tag.name}</h3>
                  {tag.popular && (
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">Popular</span>
                  )}
                </div>
                <p className="text-2xl font-bold text-purple-600">${tag.price} <span className="text-sm text-gray-500">+ shipping</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Engravings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white/40 backdrop-blur-sm rounded-3xl my-20">
        <h2 className="text-4xl font-bold text-center mb-4">See Our Craftsmanship</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Real examples of our precision laser engraving</p>

        <div className="grid md:grid-cols-3 gap-12">
          {sampleEngravings.map((sample, idx) => (
            <div key={idx} className="text-center">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl p-12 shadow-2xl mb-6 transform hover:rotate-3 transition-transform">
                <div className={`text-3xl font-bold text-gray-700 mb-4 ${
                  sample.style === 'bold' ? 'tracking-wider' :
                    sample.style === 'elegant' ? 'font-serif' :
                      'font-mono'
                }`}>
                  {sample.name}
                </div>
                <div className="text-lg text-gray-600">{sample.phone}</div>
                <div className="mt-4 text-sm text-gray-500">
                  {sample.style === 'bold' ? '❤️ Bold Style' :
                    sample.style === 'elegant' ? '✨ Elegant Style' :
                      '🐾 Playful Style'}
                </div>
              </div>
              <p className="text-gray-600 capitalize">{sample.style} Engraving</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Protect Your Pet?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Create your custom tag in minutes. No design experience needed.
        </p>
        <button onClick={() => navigate('/create-tag')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full text-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-2">
          Start Designing Now
          <ChevronRight className="w-6 h-6" />
        </button>
        <p className="text-sm text-gray-500 mt-4">Free shipping on orders over $25</p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src={logo} 
              alt="Collar Culture Logo" 
              className="h-16 w-auto object-contain brightness-0 invert"
            />
          </div>
          <p className="text-gray-400 mb-4">Keeping pets safe, one tag at a time.</p>
          <p className="text-sm text-gray-500">© 2025 Collar Culture Tags. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;