import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Download, RefreshCw } from 'lucide-react';

const QrcodeGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get initial data from location state (if navigating from MaterialSelection)
  const initialData = location.state?.formData || null;
  
  const [formData, setFormData] = useState({
    petname: initialData?.petname || '',
    firstname: initialData?.firstname || '',
    lastname: initialData?.lastname || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    userid: initialData?.userid || ''
  });

  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [error, setError] = useState(null);
  const [qrSize, setQrSize] = useState(512); // High resolution for engraving
  const [marginSize, setMarginSize] = useState(4); // Quiet zone for better scanning
  const svgRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear QR code when form changes
    if (qrCodeUrl) {
      setQrCodeUrl(null);
    }
  };

  const generateQrCode = (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.petname || !formData.firstname || !formData.phone) {
      setError('Please fill in all required fields (Pet Name, First Name, Phone)');
      return;
    }

    // Generate userid if not provided (could be from backend or generate a unique ID)
    const userId = formData.userid || generateUserId();
    
    // Construct the URL that the QR code will point to
    // This should match your backend URL structure
    const baseUrl = window.location.origin;
    const contactUrl = `${baseUrl}/contact/${userId}`;
    
    setQrCodeUrl(contactUrl);
    setFormData(prev => ({ ...prev, userid: userId }));
  };

  const generateUserId = () => {
    // Generate a unique ID - in production, this should come from your backend
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const downloadSVG = () => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `qrcode_${formData.petname || 'tag'}_${Date.now()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const resetForm = () => {
    setFormData({
      petname: '',
      firstname: '',
      lastname: '',
      address: '',
      phone: '',
      email: '',
      userid: ''
    });
    setQrCodeUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/create-tag')}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Material Selection</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              QR Code Generator
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Enter your pet's information to generate a high-definition QR code for laser engraving
            </p>

            <form onSubmit={generateQrCode} className="space-y-6">
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
                    value={formData.petname}
                    onChange={handleInputChange}
                    placeholder="e.g., Max or Fluffy"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Owner First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    placeholder="Your first name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Owner Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    placeholder="Your last name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
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
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-6 border-t space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Contact Information
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="555-123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              {/* QR Code Settings */}
              <div className="pt-6 border-t space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  QR Code Settings (for Engraving)
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Size (pixels) - Higher = Better Quality
                  </label>
                  <input
                    type="number"
                    min="256"
                    max="2048"
                    step="64"
                    value={qrSize}
                    onChange={(e) => setQrSize(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 512-1024 for silicone engraving</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Margin Size (quiet zone)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={marginSize}
                    onChange={(e) => setMarginSize(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 4 for better scanning on silicone</p>
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
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
                >
                  Generate QR Code
                </button>
              </div>
            </form>
          </div>

          {/* QR Code Preview Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">QR Code Preview</h2>
            <p className="text-gray-600 mb-6">
              {qrCodeUrl 
                ? 'Preview your QR code. Download as SVG for laser engraving.'
                : 'Fill out the form and click "Generate QR Code" to see your QR code here.'}
            </p>

            {qrCodeUrl && (
              <div className="space-y-6">
                {/* QR Code Display */}
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
                  <div ref={svgRef} className="bg-white p-4 rounded-lg">
                    <QRCodeSVG
                      value={qrCodeUrl}
                      size={qrSize}
                      level="H" // High error correction for better scanning on silicone
                      marginSize={marginSize}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      includeMargin={true}
                    />
                  </div>
                </div>

                {/* QR Code Info */}
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm font-semibold text-indigo-900 mb-2">QR Code Details:</p>
                  <p className="text-xs text-indigo-700 break-all">
                    <span className="font-medium">URL:</span> {qrCodeUrl}
                  </p>
                  <p className="text-xs text-indigo-700 mt-2">
                    <span className="font-medium">Size:</span> {qrSize}px × {qrSize}px
                  </p>
                  <p className="text-xs text-indigo-700">
                    <span className="font-medium">Error Correction:</span> High (H) - Best for silicone engraving
                  </p>
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadSVG}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download SVG for Engraving
                </button>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Engraving Tips:</p>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li>Use the downloaded SVG file for laser engraving</li>
                    <li>Ensure sufficient contrast between QR code and silicone material</li>
                    <li>Test scan the QR code before final engraving</li>
                    <li>High error correction (H) ensures readability even with minor damage</li>
                  </ul>
                </div>
              </div>
            )}

            {!qrCodeUrl && (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-400 text-center">
                  QR code will appear here<br />
                  after generation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrcodeGenerator;

