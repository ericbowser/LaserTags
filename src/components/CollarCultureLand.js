import React, { useState } from 'react';
import { Heart, Shield, Sparkles, Star, ChevronRight } from 'lucide-react';
import bone from '../assets/Materials/Silicone/orange_bone.png';

function CollarCultureLand() {
  const [hoveredTag, setHoveredTag] = useState(null);

  const tagStyles = [
    { id: 1, name: 'Classic Bone', shape: 'bone', price: 14.99, popular: true },
    { id: 2, name: 'Heart Shape', shape: 'heart', price: 14.99, popular: false },
    { id: 3, name: 'Circle Classic', shape: 'circle', price: 12.99, popular: false },
    { id: 4, name: 'Star Shine', shape: 'star', price: 15.99, popular: false },
  ];

  const sampleEngravings = [
    { name: 'MAX', phone: '555-0123', style: 'bold' },
    { name: 'LUNA', phone: '555-0456', style: 'elegant' },
    { name: 'BUDDY', phone: '555-0789', style: 'playful' },
  ];

  return (
    <div className={'text-center mr-24 ml-24'}>
      {/* Header */}
      <header className="transparent backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-purple-600" fill="currentColor" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Collar Culture
            </span>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
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
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-2">
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
              onMouseEnter={() => setHoveredTag(tag.id)}
              onMouseLeave={() => setHoveredTag(null)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all cursor-pointer relative"
            >
              {tag.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                  <Star className="w-3 h-3" fill="currentColor" />
                  Popular
                </div>
              )}
              <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-8">
                {tag.shape === 'bone' && (
                  <div className="">
                    <div >
                      <img className={''} src={bone} alt={'orange_bone_tag'}/>
                    </div>
                  </div>
                )}
                {tag.shape === 'heart' && (
                  <Heart className="w-40 h-40 text-gray-400" fill="currentColor" />
                )}
                {tag.shape === 'circle' && (
                  <div className="w-40 h-40 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full shadow-xl"></div>
                )}
                {tag.shape === 'star' && (
                  <Star className="w-40 h-40 text-gray-400" fill="currentColor" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{tag.name}</h3>
                <p className="text-2xl font-bold text-purple-600">${tag.price}</p>
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
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full text-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-2">
          Start Designing Now
          <ChevronRight className="w-6 h-6" />
        </button>
        <p className="text-sm text-gray-500 mt-4">Free shipping on orders over $25</p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6" fill="currentColor" />
            <span className="text-xl font-bold">PawPrint Tags</span>
          </div>
          <p className="text-gray-400 mb-4">Keeping pets safe, one tag at a time.</p>
          <p className="text-sm text-gray-500">© 2025 PawPrint Tags. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default CollarCultureLand;