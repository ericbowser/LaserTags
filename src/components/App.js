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
    <div className="min-h-screen relative">
      {/* Gradient overlay - black to red gradient across the page (left to right) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(to right, #000000 0%, #1a0000 20%, #330000 40%, #660000 60%, #990000 80%, #cc0000 90%, #ff0000 100%)'
          }}
        ></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-sm border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Collar Culture Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <button onClick={() => navigate('/create-tag')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
          Keep Your Best Friend Safe
        </h1>
        <p className="text-sm md:text-base text-gray-200 mb-4 max-w-2xl mx-auto">
          Custom laser-engraved pet ID tags that last a lifetime.
        </p>
        <button onClick={() => navigate('/create-tag')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-base font-semibold transition-colors inline-flex items-center gap-2">
          Create Your Tag
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg">
            <Shield className="w-6 h-6 text-red-400 mb-2" />
            <h3 className="text-sm font-bold mb-1 text-white">Durable & Safe</h3>
            <p className="text-gray-300 text-xs">Laser engraving that won't fade or scratch.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg">
            <Sparkles className="w-6 h-6 text-red-400 mb-2" />
            <h3 className="text-sm font-bold mb-1 text-white">Custom Designs</h3>
            <p className="text-gray-300 text-xs">Multiple shapes, materials, and styles.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg">
            <Heart className="w-6 h-6 text-red-400 mb-2" fill="currentColor" />
            <h3 className="text-sm font-bold mb-1 text-white">Fast Delivery</h3>
            <p className="text-gray-300 text-xs">Ships within 24 hours.</p>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h2 className="text-xl font-bold text-center mb-2 text-white">Choose Your Style</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {tagStyles.map((tag) => (
            <div
              key={tag.id}
              onClick={() => navigate('/create-tag')}
              onMouseEnter={() => setHoveredTag(tag.id)}
              onMouseLeave={() => setHoveredTag(null)}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center p-4">
                {tag.shape === 'bone' && (
                  <img src={bone} alt={'orange_bone_tag'} className="w-20 h-20 object-contain"/>
                )}
                {tag.shape === 'tri' && (
                  <img src={tri} alt={'triangle_tag'} className="w-20 h-20 object-contain"/>
                )}
                {tag.shape === 'circle' && (
                  <img src={hex} alt={'silicone_circle'} className="w-20 h-20 object-contain"/>
                )}
                {tag.shape === 'rect' && (
                  <img src={bar} alt={'bar_tag'} className="w-20 h-20 object-contain"/>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{tag.name}</h3>
                  {tag.popular && (
                    <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">Popular</span>
                  )}
                </div>
                <p className="text-base font-bold text-red-600">${tag.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-red-900/30 py-4 mt-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-300 text-xs mb-1">Keeping pets safe, one tag at a time.</p>
          <p className="text-xs text-gray-400">© 2025 Collar Culture Tags. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;