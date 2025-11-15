import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Database, FileText, Download, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { LASER_BACKEND_BASE_URL } from '../../env.json';
import StripeCheckout from './StripeCheckout';
import bone from '../assets/Materials/Silicone/orange_bone.png';
import blueCircle from '../assets/Materials/Silicone/blue_circ_small.jpg';
import redTri from '../assets/Materials/Silicone/red_tri.jpg';
import blueRect from '../assets/Materials/Silicone/blue_rect.jpg';

const siliconeOptions = [
  { 
    id: 1, 
    name: 'Bone', 
    shape: 'bone',
    image: bone,
    price: 11.99,
    colors: ['Orange'],
    description: 'Classic bone shape with rounded edges'
  },
  { 
    id: 2, 
    name: 'Triangle', 
    shape: 'tri',
    image: redTri,
    price: 11.99,
    colors: ['Red'],
    description: 'Modern triangular design'
  },
  { 
    id: 3, 
    name: 'Circle', 
    shape: 'circle',
    image: blueCircle,
    price: 11.99,
    colors: ['Blue', 'Yellow', 'Orange'],
    description: 'Timeless circular tag'
  },
  { 
    id: 4, 
    name: 'Rectangle', 
    shape: 'rect',
    image: blueRect,
    price: 11.99,
    colors: ['Blue', 'Turquoise'],
    description: 'Clean rectangular design'
  },
];

function MaterialSelection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get step from URL, default to 1
  const stepFromUrl = parseInt(searchParams.get('step') || '1', 10);
  const materialIdFromUrl = searchParams.get('material');
  const orderTypeFromUrl = searchParams.get('type');
  
  const [step, setStep] = useState(stepFromUrl);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [orderType, setOrderType] = useState(orderTypeFromUrl); // 'database' or 'engrave'
  const qrSvgRef = useRef(null);
  
  // Listen to URL changes (browser back/forward buttons)
  useEffect(() => {
    const urlStep = parseInt(searchParams.get('step') || '1', 10);
    const urlMaterialId = searchParams.get('material');
    const urlOrderType = searchParams.get('type');
    
    // Update step from URL
    if (urlStep !== step) {
      setStep(urlStep);
    }
    
    // Update material from URL
    if (urlMaterialId) {
      const material = siliconeOptions.find(m => m.id.toString() === urlMaterialId);
      if (material && material.id !== selectedMaterial?.id) {
        setSelectedMaterial(material);
      }
    } else if (selectedMaterial && urlStep === 1) {
      // Clear material if we're back at step 1
      setSelectedMaterial(null);
    }
    
    // Update orderType from URL
    if (urlOrderType !== orderType) {
      setOrderType(urlOrderType);
    } else if (!urlOrderType && orderType && urlStep <= 2) {
      // Clear orderType if we're back at step 1 or 2
      setOrderType(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  
  // Sync step to URL when state changes (but not from URL change)
  useEffect(() => {
    const urlStep = parseInt(searchParams.get('step') || '1', 10);
    if (step !== urlStep) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('step', step.toString());
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  
  // Sync orderType to URL when state changes
  useEffect(() => {
    const urlOrderType = searchParams.get('type');
    if (orderType && orderType !== urlOrderType) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('type', orderType);
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType]);
  
  // For QR code orders (database) - matches contact table schema
  const [qrForm, setQrForm] = useState({
    firstname: '',
    lastname: '',
    petname: '',
    address: '',
    phone: '',
    email: '' // for notifications, not stored in contact table
  });

  // For engrave-only orders
  const [engraveForm, setEngraveForm] = useState({
    line1: '',
    line2: '',
    line3: '',
    name: '',
    email: '',
    phone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [qrSize, setQrSize] = useState(512);
  const [marginSize, setMarginSize] = useState(4);

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    const newParams = new URLSearchParams();
    newParams.set('step', '2');
    newParams.set('material', material.id.toString());
    setSearchParams(newParams);
    setStep(2);
  };

  const handleOrderTypeSelect = async (type) => {
    setOrderType(type);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('step', '3');
    newParams.set('type', type);
    setSearchParams(newParams);
    setStep(3); // Both options go to form step
  };

  const handleQrFormChange = (e) => {
    const { name, value } = e.target;
    setQrForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEngraveChange = (e) => {
    const { name, value } = e.target;
    setEngraveForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitQr = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    if (!qrForm.petname || !qrForm.firstname || !qrForm.phone || !qrForm.email) {
      setError('Please fill in all required fields (Pet Name, First Name, Phone, Email)');
      setIsSubmitting(false);
      return;
    }

    // Navigate to QR code generation page with form data
    navigate('/qrcode', {
      state: {
        formData: qrForm,
        material: selectedMaterial,
        orderType: 'database'
      }
    });
  };

  const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const downloadQrSVG = () => {
    if (!qrSvgRef.current) return;

    // Find the SVG element inside the ref container
    const svgElement = qrSvgRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `qrcode_${qrForm.petname || 'tag'}_${Date.now()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handleProceedToCheckout = () => {
    const orderData = {
      material: selectedMaterial,
      orderType: 'database',
      contactInfo: {
        firstname: qrForm.firstname,
        lastname: qrForm.lastname || '',
        petname: qrForm.petname,
        address: qrForm.address || '',
        phone: qrForm.phone
      },
      notificationEmail: qrForm.email,
      userid: qrForm.userid
    };

    setOrderData(orderData);
    setShowStripe(true);
  };

  const handleSubmitEngrave = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    if (!engraveForm.line1 || !engraveForm.name || !engraveForm.email || !engraveForm.phone) {
      setError('Please fill in all required fields (Line 1, Name, Email, Phone)');
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      material: selectedMaterial,
      orderType: 'engrave',
      engravingText: {
        line1: engraveForm.line1,
        line2: engraveForm.line2,
        line3: engraveForm.line3
      },
      contactInfo: {
        name: engraveForm.name,
        email: engraveForm.email,
        phone: engraveForm.phone
      }
    };

    console.log('Preparing engrave order:', orderData);
    setOrderData(orderData);
    setShowStripe(true);
    setIsSubmitting(false);
  };

  const handleStripeSuccess = async () => {
    // Save order to backend after successful payment
    try {
      await axios.post(`${LASER_BACKEND_BASE_URL}/saveLaserTag`, orderData);
      setSuccess(true);
      setShowStripe(false);
    } catch (error) {
      setError('Failed to save order. Please contact support.');
      setShowStripe(false);
      console.error('Order save error:', error);
    }
  };

  const handleStripeCancel = () => {
    setShowStripe(false);
    setOrderData(null);
  };

  // Show Stripe checkout if triggered
  if (showStripe && orderData) {
    return <StripeCheckout orderData={orderData} onSuccess={handleStripeSuccess} onCancel={handleStripeCancel} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => {
            if (step === 1) {
              navigate('/');
            } else {
              const newStep = step - 1;
              const newParams = new URLSearchParams(searchParams);
              newParams.set('step', newStep.toString());
              // Remove type param if going back to step 1 or 2
              if (newStep <= 2) {
                newParams.delete('type');
                if (newStep === 1) {
                  newParams.delete('material');
                }
              }
              setSearchParams(newParams);
              setStep(newStep);
            }
          }}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className="font-medium">Select Material</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full transition-all ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }} />
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="font-medium">Choose Type</span>
            </div>
            {(orderType === 'engrave' || orderType === 'database') && (
              <>
                <div className="flex-1 h-1 mx-4 bg-gray-200">
                  <div className={`h-full transition-all ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} style={{ width: step >= 3 ? '100%' : '0%' }} />
                </div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    3
                  </div>
                  <span className="font-medium">Enter Info</span>
                </div>
                {orderType === 'database' && (
                  <>
                    <div className="flex-1 h-1 mx-4 bg-gray-200">
                      <div className={`h-full transition-all ${step >= 4 ? 'bg-indigo-600' : 'bg-gray-200'}`} style={{ width: step >= 4 ? '100%' : '0%' }} />
                    </div>
                    <div className={`flex items-center gap-2 ${step >= 4 ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        step >= 4 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        4
                      </div>
                      <span className="font-medium">Generate QR Code</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Step 1: Material Selection */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your Silicone Tag
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Select a shape and color for your pet's custom laser-engraved tag
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {siliconeOptions.map((material) => (
                <div
                  key={material.id}
                  onClick={() => handleMaterialSelect(material)}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-600 hover:shadow-lg cursor-pointer transition-all group"
                >
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                      <img src={material.image} alt={material.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{material.name}</h3>
                      <p className="text-gray-600 mb-3">{material.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-indigo-600">${material.price} <span className="text-sm text-gray-500">+ shipping</span></span>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {material.colors.map((color, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Order Type Selection */}
        {step === 2 && selectedMaterial && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6 flex items-center gap-4 pb-6 border-b">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <img src={selectedMaterial.image} alt={selectedMaterial.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedMaterial.name}</h3>
                <p className="text-gray-600">${selectedMaterial.price} <span className="text-sm text-gray-500">+ shipping</span></p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">How would you like to proceed?</h2>
            <p className="text-gray-600 mb-8">Choose how we should handle your contact information</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Database Option */}
              <div
                onClick={() => handleOrderTypeSelect('database')}
                className="border-2 border-gray-200 rounded-xl p-8 hover:border-indigo-600 hover:shadow-lg cursor-pointer transition-all group"
              >
                <Database className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">QR Code Tag</h3>
                <p className="text-gray-600 mb-4">
                  We'll laser engrave a QR code that links to your stored pet information. When scanned, it displays your pet's details instantly.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-600">✓</span>
                    QR code engraved on tag
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-600">✓</span>
                    Info stored securely in database
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-600">✓</span>
                    Scannable with any smartphone
                  </li>
                </ul>
              </div>

              {/* Engrave Only Option */}
              <div
                onClick={() => handleOrderTypeSelect('engrave')}
                className="border-2 border-gray-200 rounded-xl p-8 hover:border-indigo-600 hover:shadow-lg cursor-pointer transition-all group"
              >
                <FileText className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Text-Only Tag</h3>
                <p className="text-gray-600 mb-4">
                  Directly engrave your pet's information as text. Simple and traditional - no QR code needed.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span>
                    No account needed
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span>
                    Up to 3 lines of text
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span>
                    Traditional text engraving
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Form Entry (QR Code or Engrave) */}
        {step === 3 && (orderType === 'database' || orderType === 'engrave') && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6 flex items-center gap-4 pb-6 border-b">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <img src={selectedMaterial.image} alt={selectedMaterial.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedMaterial.name}</h3>
                <p className="text-gray-600">${selectedMaterial.price} <span className="text-sm text-gray-500">+ shipping</span></p>
              </div>
            </div>

            {orderType === 'database' ? (
              <h2 className="text-3xl font-bold mb-2">Enter Pet Information</h2>
            ) : (
              <h2 className="text-3xl font-bold mb-2">Enter Engraving Text</h2>
            )}
            <p className="text-gray-600 mb-8">
              {orderType === 'database' 
                ? 'Enter the information you want displayed when someone scans the QR code'
                : 'Tell us what to engrave (max 3 lines) and how to contact you'
              }
            </p>

            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-green-600">Order Submitted!</h3>
                <p className="text-gray-600 mb-8">We'll send you a confirmation email and notification when your tag is ready.</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            ) : (
              orderType === 'database' ? (
                <form onSubmit={handleSubmitQr} className="space-y-6">
                  {/* Pet Information */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Pet Information
                    </label>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Pet Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="petname"
                        value={qrForm.petname}
                        onChange={handleQrFormChange}
                        placeholder="e.g., Max or Fluffy"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Owner Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        value={qrForm.firstname}
                        onChange={handleQrFormChange}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="pt-6 border-t space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Address Information
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={qrForm.address}
                        onChange={handleQrFormChange}
                        placeholder="123 Main St"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                        name="lastname"
                        value={qrForm.lastname}
                          onChange={handleQrFormChange}
                          placeholder="City"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={qrForm.state}
                          onChange={handleQrFormChange}
                          placeholder="ST"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                        name="email"
                        value={qrForm.email}
                          onChange={handleQrFormChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-6 border-t space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Contact Information
                    </label>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={qrForm.email}
                          onChange={handleQrFormChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={qrForm.phone}
                          onChange={handleQrFormChange}
                          placeholder="555-123-4567"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <p className="text-red-800">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('step', '2');
                        setSearchParams(newParams);
                        setStep(2);
                      }}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Order'}
                    </button>
                  </div>
                </form>
              ) : (
              <form onSubmit={handleSubmitEngrave} className="space-y-6">
                {/* Engraving Text Lines */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Engraving Text (Max 3 lines)
                  </label>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="line1"
                      value={engraveForm.line1}
                      onChange={handleEngraveChange}
                      placeholder="e.g., Your Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      maxLength={25}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      name="line2"
                      value={engraveForm.line2}
                      onChange={handleEngraveChange}
                      placeholder="e.g., City, ST"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      maxLength={25}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Line 3 (Optional)
                    </label>
                    <input
                      type="text"
                      name="line3"
                      value={engraveForm.line3}
                      onChange={handleEngraveChange}
                      placeholder="e.g., Phone Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      maxLength={25}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-6 border-t space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Contact Information (for order notification)
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={engraveForm.name}
                      onChange={handleEngraveChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={engraveForm.email}
                        onChange={handleEngraveChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={engraveForm.phone}
                        onChange={handleEngraveChange}
                        placeholder="555-123-4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Order'}
                  </button>
                </div>
              </form>
              )
            )}
          </div>
        )}

        {/* Step 4: QR Code Generation (for database/QR code orders) */}
        {step === 4 && orderType === 'database' && qrCodeUrl && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6 flex items-center gap-4 pb-6 border-b">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <img src={selectedMaterial.image} alt={selectedMaterial.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedMaterial.name}</h3>
                <p className="text-gray-600">${selectedMaterial.price} <span className="text-sm text-gray-500">+ shipping</span></p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">Your QR Code is Ready!</h2>
            <p className="text-gray-600 mb-8">
              Download the high-definition SVG file for laser engraving on your silicone tag.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* QR Code Preview */}
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
                  <div ref={qrSvgRef} className="bg-white p-4 rounded-lg">
                    <QRCodeSVG
                      value={qrCodeUrl}
                      size={qrSize}
                      level="H"
                      marginSize={marginSize}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      includeMargin={true}
                    />
                  </div>
                </div>

                {/* QR Code Settings */}
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm font-semibold text-indigo-900 mb-3">QR Code Settings</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-indigo-700 mb-1">
                        Size (pixels)
                      </label>
                      <input
                        type="number"
                        min="256"
                        max="2048"
                        step="64"
                        value={qrSize}
                        onChange={(e) => setQrSize(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-indigo-700 mb-1">
                        Margin Size
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={marginSize}
                        onChange={(e) => setMarginSize(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-indigo-200">
                    <p className="text-xs text-indigo-700 break-all">
                      <span className="font-medium">URL:</span> {qrCodeUrl}
                    </p>
                    <p className="text-xs text-indigo-700 mt-2">
                      <span className="font-medium">Error Correction:</span> High (H) - Best for silicone engraving
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions and Info */}
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm font-semibold text-green-900 mb-2">Ready for Engraving</p>
                  <p className="text-xs text-green-700">
                    The QR code is optimized for laser engraving on silicone material with high error correction for reliable scanning.
                  </p>
                </div>

                <button
                  onClick={downloadQrSVG}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download SVG for Engraving
                </button>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Engraving Tips:</p>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li>Use the downloaded SVG file for laser engraving</li>
                    <li>Ensure sufficient contrast between QR code and silicone material</li>
                    <li>Test scan the QR code before final engraving</li>
                    <li>High error correction (H) ensures readability even with minor damage</li>
                  </ul>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('step', '3');
                      setSearchParams(newParams);
                      setStep(3);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MaterialSelection;

