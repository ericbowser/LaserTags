import React, { useState } from 'react';
import { Heart, Shield, Sparkles, ChevronRight, QrCode, Zap, Check, Star, Eye, Tag } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

// Hero collection image
import heroCollection from '../assets/Materials/Silicone/Examples/hero_collection.png';

import DarkModeToggle from './DarkModeToggle';

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-charcoal-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-charcoal-800/95 backdrop-blur-md border-b border-gray-200 dark:border-charcoal-700 shadow-sm dark:shadow-dark">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo Area - Enhanced with better contrast */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral-500 rounded-xl flex items-center justify-center shadow-lg">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">LaserTags</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">Smart Pet ID Tags</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <button 
              onClick={() => navigate('/create-tag')} 
              className="bg-coral-500 hover:bg-coral-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-coral transform hover:scale-105 active:scale-95 border-2 border-coral-500 hover:border-coral-600"
            >
              Create Your Tag
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Enhanced for better contrast */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-charcoal-900 dark:via-charcoal-800 dark:to-charcoal-900 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            Keep Your Pet Safe with
            <span className="block text-coral-500 mt-2 drop-shadow-lg">Smart ID Tags</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Laser-engraved tags with QR codes that connect finders directly to you.
            <br className="hidden md:block" />
            <span className="text-gray-900 dark:text-white font-bold">Durable, weatherproof, and designed to last a lifetime.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={() => navigate('/create-tag')} 
              className="group px-8 py-4 bg-coral-500 hover:bg-coral-600 text-white font-bold text-lg rounded-xl shadow-coral transform hover:scale-105 transition-all duration-200 flex items-center gap-2 border-2 border-coral-500 hover:border-coral-600"
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
              className="px-8 py-4 bg-white hover:bg-gray-100 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-gray-900 dark:text-white font-bold text-lg rounded-xl border-2 border-gray-300 dark:border-charcoal-600 hover:border-gray-400 dark:hover:border-charcoal-500 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Eye className="w-5 h-5" />
              See Examples
            </button>
          </div>
          
          {/* Enhanced Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-base text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-3 bg-white/50 dark:bg-charcoal-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 dark:border-charcoal-600">
              <Shield className="w-6 h-6 text-coral-500" />
              <span className="font-semibold">Secure Payments</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 dark:bg-charcoal-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 dark:border-charcoal-600">
              <Zap className="w-6 h-6 text-coral-500" />
              <span className="font-semibold">Fast Shipping</span>
            </div>
            <div className="flex items-center gap-3 bg-white/50 dark:bg-charcoal-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 dark:border-charcoal-600">
              <Star className="w-6 h-6 text-coral-500" />
              <span className="font-semibold">5-Star Quality</span>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-charcoal-900 to-transparent"></div>
      </section>

      {/* HERO IMAGE SHOWCASE - Enhanced contrast */}
      <section id="examples" className="py-20 bg-white dark:bg-charcoal-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left: Hero Image */}
            <div className="order-2 md:order-1">
              <div className="bg-neutral-100 dark:bg-charcoal-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200 dark:border-charcoal-700">
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
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 font-medium">
                Every tag is precision-engraved in our workshop. <span className="text-gray-900 dark:text-white font-bold">Never fades, never wears off.</span>
              </p>
              
              <ul className="space-y-6 mb-8">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-coral-400">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">QR Code or Text</h4>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Choose instant scan-to-contact or custom engraving with up to 3 lines per side</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-coral-400">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">30 Colors & Shapes</h4>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Find the perfect match for your pet's personality with our huge selection</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-coral-400">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Lifetime Guarantee</h4>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">If the engraving fades or wears off, we'll replace it free - that's our promise</p>
                  </div>
                </li>
              </ul>

              <button
                onClick={() => navigate('/create-tag')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-coral-500 hover:bg-coral-600 text-white font-bold text-lg rounded-xl shadow-coral transform hover:scale-105 transition-all duration-200 border-2 border-coral-500 hover:border-coral-600"
              >
                Design Your Tag Now
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced for high contrast */}
      <section id="features" className="bg-gray-50 dark:bg-charcoal-800 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Why Choose LaserTags?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-16 max-w-2xl mx-auto font-medium">
            <span className="text-gray-900 dark:text-white font-bold">Professional laser engraving that never fades</span>
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-charcoal-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-charcoal-700 hover:border-coral-500 dark:hover:border-coral-500 transition-all duration-200 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-coral-500/20 dark:bg-coral-500/30 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-coral-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Weatherproof & Durable</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                <span className="text-gray-900 dark:text-white font-bold">Laser engraving never fades, chips, or wears off</span> - guaranteed for life
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-charcoal-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-charcoal-700 hover:border-coral-500 dark:hover:border-coral-500 transition-all duration-200 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-coral-500/20 dark:bg-coral-500/30 rounded-full flex items-center justify-center mb-6">
                <QrCode className="w-8 h-8 text-coral-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Smart QR Codes</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                <span className="text-gray-900 dark:text-white font-bold">Anyone can scan to contact you instantly</span> - no app required
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-charcoal-900 p-8 rounded-2xl border-2 border-gray-200 dark:border-charcoal-700 hover:border-coral-500 dark:hover:border-coral-500 transition-all duration-200 shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 bg-coral-500/20 dark:bg-coral-500/30 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-coral-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Fast Turnaround</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                <span className="text-gray-900 dark:text-white font-bold">Most orders ship within 2-3 business days</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Enhanced contrast and updated price */}
      <section className="py-20 bg-white dark:bg-charcoal-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Simple, Affordable Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-16 font-medium">
            <span className="text-gray-900 dark:text-white font-bold">One price, unlimited peace of mind</span>
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl border-4 border-coral-500 shadow-2xl dark:shadow-coral relative">
              {/* Popular badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-coral-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Most Popular
                </span>
              </div>
              
              <div className="text-center mb-6 pt-4">
                <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">$11.99</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium text-lg">per tag</div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-coral-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium"><span className="text-gray-900 dark:text-white font-bold">Lifetime laser engraving warranty</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-coral-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium"><span className="text-gray-900 dark:text-white font-bold">QR code or text engraving</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-coral-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium"><span className="text-gray-900 dark:text-white font-bold">Weatherproof silicone material</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-coral-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium"><span className="text-gray-900 dark:text-white font-bold">Free shipping on 2+ tags</span></span>
                </li>
              </ul>
              
              <button 
                onClick={() => navigate('/create-tag')}
                className="block w-full py-4 bg-coral-500 hover:bg-coral-600 text-white font-bold text-lg rounded-xl text-center shadow-coral transform hover:scale-105 transition-all duration-200 border-2 border-coral-500 hover:border-coral-600"
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
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-medium">
            Join thousands of pet owners who trust LaserTags to <span className="text-gray-900 dark:text-white font-bold">keep their furry friends safe</span>.
          </p>
          
          <button 
            onClick={() => navigate('/create-tag')}
            className="inline-flex items-center gap-2 px-10 py-5 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xl rounded-xl shadow-coral transform hover:scale-105 transition-all duration-200 border-2 border-coral-500 hover:border-coral-600"
          >
            Create Your Tag Now
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-charcoal-900 border-t-2 border-gray-200 dark:border-charcoal-700 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-coral-500 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">LaserTags</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 font-medium">Keeping pets safe, one tag at a time.</p>
          <p className="text-xs text-gray-500">© 2025 LaserTags. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;