import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ArrowRight, Database, FileText } from "lucide-react";
import axios from "axios";
import { LASER_BACKEND_BASE_URL } from "../../env.json";
import StripeCheckout from "./StripeCheckout";
import TagPreview from "./TagPreview";
import { generateQrCodeSVG, generateQrCodeUrl } from "../utils/qrCodeUtils";
import { formatPhoneNumber, validatePhoneNumber, getUnformattedPhone } from "../utils/phoneUtils";
import { saveContact, saveQrCode, createOrder } from "../api/tagApi";
import bone from "../assets/Materials/Silicone/orange_bone.png";
import blueCircle from "../assets/Materials/Silicone/blue_circ_small.jpg";
import redTri from "../assets/Materials/Silicone/red_tri.jpg";
import blueRect from "../assets/Materials/Silicone/blue_rect.jpg";

const siliconeOptions = [
  {
    id: 1,
    name: "Bone",
    shape: "bone",
    image: bone,
    price: 11.99,
    colors: ["Orange"],
    description: "Classic bone shape with rounded edges",
  },
  {
    id: 2,
    name: "Triangle",
    shape: "tri",
    image: redTri,
    price: 11.99,
    colors: ["Red"],
    description: "Modern triangular design",
  },
  {
    id: 3,
    name: "Circle",
    shape: "circle",
    image: blueCircle,
    price: 11.99,
    colors: ["Blue", "Yellow", "Orange"],
    description: "Timeless circular tag",
  },
  {
    id: 4,
    name: "Rectangle",
    shape: "rect",
    image: blueRect,
    price: 11.99,
    colors: ["Blue", "Turquoise"],
    description: "Clean rectangular design",
  },
];

function MaterialSelection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get step from URL, default to 1
  const stepFromUrl = parseInt(searchParams.get("step") || "1", 10);
  const materialIdFromUrl = searchParams.get("material");
  const orderTypeFromUrl = searchParams.get("type");

  const [step, setStep] = useState(stepFromUrl);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [orderType, setOrderType] = useState(orderTypeFromUrl); // 'database' or 'engrave'

  // Listen to URL changes (browser back/forward buttons)
  useEffect(() => {
    const urlStep = parseInt(searchParams.get("step") || "1", 10);
    const urlMaterialId = searchParams.get("material");
    const urlOrderType = searchParams.get("type");

    // Update step from URL
    if (urlStep !== step) {
      setStep(urlStep);
    }

    // Update material from URL
    if (urlMaterialId) {
      const material = siliconeOptions.find(
        (m) => m.id.toString() === urlMaterialId
      );
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
    const urlStep = parseInt(searchParams.get("step") || "1", 10);
    if (step !== urlStep) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("step", step.toString());
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Sync orderType to URL when state changes
  useEffect(() => {
    const urlOrderType = searchParams.get("type");
    if (orderType && orderType !== urlOrderType) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("type", orderType);
      setSearchParams(newParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType]);

  // For QR code orders (database) - matches contact table schema
  const [qrForm, setQrForm] = useState({
    firstname: "",
    lastname: "",
    petname: "",
    address_line_1: "",
    address_line_2: "",
    address_line_3: "",
    phone: "",
    email: "", // for notifications, not stored in contact table
  });

  // For engrave-only orders
  const [engraveForm, setEngraveForm] = useState({
    petname: "",
    line1: "",
    line2: "",
    line3: "",
    name: "",
    email: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [qrCodePosition, setQrCodePosition] = useState({ x: 50, y: 50 });
  const [phoneErrors, setPhoneErrors] = useState({ qr: null, engrave: null });
  
  // Two-sided tag configuration
  const [side1Config, setSide1Config] = useState({
    petName: '',
    fontType: 'bold' // 'bold', 'elegant', 'playful'
  });
  const [side2Config, setSide2Config] = useState({
    addressText: '',
    line1: '',
    line2: '',
    line3: ''
  });
  const [qrCodeSide, setQrCodeSide] = useState(2); // QR code on side 2 by default

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    const newParams = new URLSearchParams();
    newParams.set("step", "2");
    newParams.set("material", material.id.toString());
    setSearchParams(newParams);
    setStep(2);
  };

  const handleOrderTypeSelect = async (type) => {
    setOrderType(type);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("step", "3");
    newParams.set("type", type);
    setSearchParams(newParams);
    setStep(3); // Both options go to form step
  };

  const handleQrFormChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number if it's the phone field
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setQrForm((prev) => ({
        ...prev,
        [name]: formatted,
      }));
      
      // Validate phone number
      const validation = validatePhoneNumber(formatted);
      setPhoneErrors((prev) => ({
        ...prev,
        qr: validation.isValid ? null : validation.error,
      }));
    } else {
      setQrForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      
      // Update side1Config when petname changes
      if (name === 'petname') {
        setSide1Config((prev) => ({ ...prev, petName: value }));
      }
      
      // Update side2Config when address changes
      if (name === 'address_line_1' || name === 'address_line_2') {
        const address = [qrForm.address_line_1, qrForm.address_line_2]
          .filter(Boolean)
          .join(', ');
        if (name === 'address_line_1') {
          const newAddress = [value, qrForm.address_line_2].filter(Boolean).join(', ');
          setSide2Config((prev) => ({ ...prev, addressText: newAddress }));
        } else {
          const newAddress = [qrForm.address_line_1, value].filter(Boolean).join(', ');
          setSide2Config((prev) => ({ ...prev, addressText: newAddress }));
        }
      }
    }
  };

  const handleEngraveChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number if it's the phone field
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setEngraveForm((prev) => ({
        ...prev,
        [name]: formatted,
      }));
      
      // Validate phone number
      const validation = validatePhoneNumber(formatted);
      setPhoneErrors((prev) => ({
        ...prev,
        engrave: validation.isValid ? null : validation.error,
      }));
    } else {
      setEngraveForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      
      // Update side1Config when petname changes
      if (name === 'petname') {
        setSide1Config((prev) => ({ ...prev, petName: value }));
      }
      
      // Update side2Config when engraving lines change
      if (name === 'line1' || name === 'line2' || name === 'line3') {
        setSide2Config((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmitQr = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (
      !qrForm.petname ||
      !qrForm.firstname ||
      !qrForm.phone ||
      !qrForm.email
    ) {
      setError(
        "Please fill in all required fields (Pet Name, First Name, Phone, Email)"
      );
      return;
    }

    // Validate phone number format
    const phoneValidation = validatePhoneNumber(qrForm.phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error);
      setPhoneErrors((prev) => ({ ...prev, qr: phoneValidation.error }));
      return;
    }

    // Go to review step instead of directly to Stripe
    const newParams = new URLSearchParams(searchParams);
    newParams.set("step", "4");
    setSearchParams(newParams);
    setStep(4);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    setError(null);

    if (orderType === "database") {
      // Generate userid if not already set
      let userId = qrForm.userid;
      if (!userId) {
        userId = generateUserId();
        setQrForm((prev) => ({ ...prev, userid: userId }));
      }

      // Prepare contact data
      const address = [qrForm.address_line_1, qrForm.address_line_2]
        .filter(Boolean)
        .join(", ");

      const fullname = [qrForm.firstname, qrForm.lastname]
        .filter(Boolean)
        .join(" ");

      // Get unformatted phone number for storage
      const unformattedPhone = getUnformattedPhone(qrForm.phone);
      
      const contactData = {
        firstname: qrForm.firstname,
        lastname: qrForm.lastname || "",
        fullname: fullname,
        petname: qrForm.petname,
        phone: unformattedPhone,
        address: address,
      };

      try {
        // Use shared function to save contact and create order
        const { contactid, orderid } = await saveContactAndCreateOrder(
          contactData,
          {
            tag_text_line_1: qrForm.petname || "",
            tag_text_line_2: qrForm.firstname || "",
            tag_text_line_3: qrForm.phone || "",
          },
          true
        );

        // Prepare order data and proceed to checkout
        const orderData = {
          material: selectedMaterial,
          orderType: "database",
          contactInfo: {
            firstname: qrForm.firstname,
            lastname: qrForm.lastname || "",
            petname: qrForm.petname,
            address_line_1: qrForm.address_line_1 || "",
            address_line_2: qrForm.address_line_2 || "",
            phone: qrForm.phone,
          },
          notificationEmail: qrForm.email,
          userid: userId,
          contactid,
          orderid,
          qrCodePosition,
          side1Config,
          side2Config,
          qrCodeSide,
        };

        // Store orderData in sessionStorage in case of redirect
        sessionStorage.setItem("pendingOrderData", JSON.stringify(orderData));

        setOrderData(orderData);
        setShowStripe(true);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error processing order:", error);
        setError(error.message || "Failed to process order. Please try again.");
        setIsSubmitting(false);
      }
    } else {
      // Engrave order confirmation
      let contactid = null;
      let orderid = null;

      try {
        const firstname = engraveForm.name.split(" ")[0] || engraveForm.name;
        const lastname = engraveForm.name.split(" ").slice(1).join(" ") || "";

        // Get unformatted phone number for storage
        const unformattedPhone = getUnformattedPhone(engraveForm.phone);
        
        const contactData = {
          firstname: firstname,
          lastname: lastname,
          fullname: engraveForm.name,
          petname: engraveForm.petname,
          phone: unformattedPhone,
          address: `${engraveForm.address_line_1} ${engraveForm.address_line_2} ${engraveForm.address_line_3}`,
        };

        const { contactid: savedContactId, orderid: savedOrderId } = await saveContactAndCreateOrder(
          contactData,
          {
            tag_text_line_1: engraveForm.line1 || "",
            tag_text_line_2: engraveForm.line2 || "",
            tag_text_line_3: engraveForm.line3 || "",
          },
          false
        );

        const orderData = {
          material: selectedMaterial,
          orderType: "engrave",
          petname: engraveForm.petname,
          engravingText: {
            line1: engraveForm.line1,
            line2: engraveForm.line2,
            line3: engraveForm.line3,
          },
          contactInfo: {
            firstname: firstname,
            lastname: lastname,
            fullname: engraveForm.name,
            petname: engraveForm.petname,
            email: engraveForm.email,
            phone: engraveForm.phone,
          },
          notificationEmail: engraveForm.email,
          contactid: savedContactId,
          orderid: savedOrderId,
          side1Config,
          side2Config,
        };

        // Store orderData in sessionStorage in case of redirect
        sessionStorage.setItem("pendingOrderData", JSON.stringify(orderData));

        setOrderData(orderData);
        setShowStripe(true);
        setIsSubmitting(false);
      } catch (orderError) {
        console.error("Error creating order:", orderError);
        setError("Failed to create order. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  const generateUserId = () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Shared function to save contact and create order
  const saveContactAndCreateOrder = async (contactData, orderData, hasQrCode) => {
    // Save contact
    const saveResponse = await saveContact(contactData);
    if (!saveResponse) {
      throw new Error("Failed to save contact information");
    }

    const contactid = saveResponse?.id;
    if (!contactid) {
      throw new Error("Failed to get contact ID");
    }

    // Create order
    const orderid = await createOrder({
      contactid,
      ...orderData,
      has_qr_code: hasQrCode,
      amount: Math.round(selectedMaterial.price * 100),
      currency: "usd",
      stripe_payment_intent_id: null,
      status: "pending",
    });

    if (!orderid) {
      throw new Error("Failed to create order");
    }

    return { contactid, orderid };
  };

  const handleSubmitEngrave = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (
      !engraveForm.petname ||
      !engraveForm.line1 ||
      !engraveForm.name ||
      !engraveForm.email ||
      !engraveForm.phone
    ) {
      setError(
        "Please fill in all required fields (Pet Name, Line 1, Your Name, Email, Phone)"
      );
      return;
    }

    // Validate phone number format
    const phoneValidation = validatePhoneNumber(engraveForm.phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error);
      setPhoneErrors((prev) => ({ ...prev, engrave: phoneValidation.error }));
      return;
    }

    // Go to review step instead of directly to Stripe
    const newParams = new URLSearchParams(searchParams);
    newParams.set("step", "4");
    setSearchParams(newParams);
    setStep(4);
  };

  const handleStripeSuccess = async () => {
    // Payment succeeded - Stripe webhook will handle updating order status and sending email
    // We just need to show success and clean up
    console.log("Payment successful! Webhook will process order:", {
      orderid: orderData.orderid,
      contactid: orderData.contactid,
    });

    // Clear sessionStorage since payment succeeded
    sessionStorage.removeItem("pendingOrderData");
    setSuccess(true);
    setShowStripe(false);
  };

  const handleStripeCancel = () => {
    setShowStripe(false);
    setOrderData(null);
  };

  // Show Stripe checkout if triggered
  if (showStripe && orderData) {
    return (
      <StripeCheckout
        orderData={orderData}
        onSuccess={handleStripeSuccess}
        onCancel={handleStripeCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => {
            if (step === 1) {
              navigate("/");
            } else {
              const newStep = step - 1;
              const newParams = new URLSearchParams(searchParams);
              newParams.set("step", newStep.toString());
              // Remove type param if going back to step 1 or 2
              if (newStep <= 2) {
                newParams.delete("type");
                if (newStep === 1) {
                  newParams.delete("material");
                }
              }
              setSearchParams(newParams);
              setStep(newStep);
            }
          }}
          className="mb-3 flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div
              className={`flex items-center gap-1.5 ${
                step >= 1 ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <span className="font-medium text-sm">Select Material</span>
            </div>
            <div className="flex-1 h-0.5 mx-2 bg-gray-200">
              <div
                className={`h-full transition-all ${
                  step >= 2 ? "bg-indigo-600" : "bg-gray-200"
                }`}
                style={{ width: step >= 2 ? "100%" : "0%" }}
              />
            </div>
            <div
              className={`flex items-center gap-1.5 ${
                step >= 2 ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 2
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span className="font-medium text-sm">Choose Type</span>
            </div>
            {(orderType === "engrave" || orderType === "database") && (
              <>
                <div className="flex-1 h-0.5 mx-2 bg-gray-200">
                  <div
                    className={`h-full transition-all ${
                      step >= 3 ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                    style={{ width: step >= 3 ? "100%" : "0%" }}
                  />
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    step >= 3 ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= 3
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    3
                  </div>
                  <span className="font-medium text-sm">Enter Info</span>
                </div>
                {step >= 3 && (
                  <>
                    <div className="flex-1 h-0.5 mx-2 bg-gray-200">
                      <div
                        className={`h-full transition-all ${
                          step >= 4 ? "bg-indigo-600" : "bg-gray-200"
                        }`}
                        style={{ width: step >= 4 ? "100%" : "0%" }}
                      />
                    </div>
                    <div
                      className={`flex items-center gap-1.5 ${
                        step >= 4 ? "text-indigo-600" : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step >= 4
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        4
                      </div>
                      <span className="font-medium text-sm">Review</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Step 1: Material Selection */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your Silicone Tag
            </h1>
            <p className="text-gray-600 mb-4 text-sm">
              Select a shape and color for your pet's custom laser-engraved tag
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {siliconeOptions.map((material) => (
                <div
                  key={material.id}
                  onClick={() => handleMaterialSelect(material)}
                  className="border-2 border-gray-200 rounded-lg p-3 hover:border-indigo-600 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                      <img
                        src={material.image}
                        alt={material.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold mb-1">
                        {material.name}
                      </h3>
                      <p className="text-gray-600 mb-2 text-xs">
                        {material.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-indigo-600">
                          ${material.price}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {material.colors.map((color, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full text-gray-600"
                          >
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
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="mb-4 flex items-center gap-3 pb-3 border-b">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <img
                  src={selectedMaterial.image}
                  alt={selectedMaterial.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold">{selectedMaterial.name}</h3>
                <p className="text-gray-600 text-sm">
                  ${selectedMaterial.price}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">
              How would you like to proceed?
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              Choose how we should handle your contact information
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {/* Database Option */}
              <div
                onClick={() => handleOrderTypeSelect("database")}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-600 hover:shadow-md cursor-pointer transition-all group"
              >
                <Database className="w-8 h-8 text-indigo-600 mb-2" />
                <h3 className="text-base font-bold mb-1">QR Code Tag</h3>
                <p className="text-gray-600 mb-3 text-xs">
                  QR code engraved on tag. Scannable with any smartphone to display your pet's info.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center gap-1">
                    <span className="text-indigo-600">✓</span>
                    QR code engraved
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="text-indigo-600">✓</span>
                    Update info anytime
                  </li>
                </ul>
              </div>

              {/* Engrave Only Option */}
              <div
                onClick={() => handleOrderTypeSelect("engrave")}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-600 hover:shadow-md cursor-pointer transition-all group"
              >
                <FileText className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="text-base font-bold mb-1">Text-Only Tag</h3>
                <p className="text-gray-600 mb-3 text-xs">
                  Directly engrave your pet's information as text. Simple and traditional.
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-center gap-1">
                    <span className="text-purple-600">✓</span>
                    Up to 3 lines of text
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="text-purple-600">✓</span>
                    Traditional engraving
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Form Entry (QR Code or Engrave) */}
        {step === 3 &&
          (orderType === "database" || orderType === "engrave") && (
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="mb-4 flex items-center gap-3 pb-3 border-b">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <img
                    src={selectedMaterial.image}
                    alt={selectedMaterial.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold">{selectedMaterial.name}</h3>
                  <p className="text-gray-600 text-sm">
                    ${selectedMaterial.price}
                  </p>
                </div>
              </div>

              {orderType === "database" ? (
                <h2 className="text-xl font-bold mb-1">
                  Enter Pet Information
                </h2>
              ) : (
                <h2 className="text-xl font-bold mb-1">
                  Enter Engraving Text
                </h2>
              )}
              <p className="text-gray-600 mb-4 text-sm">
                {orderType === "database"
                  ? "Enter the information you want displayed when someone scans the QR code"
                  : "Tell us what to engrave (max 3 lines) and how to contact you"}
              </p>

              {success ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-green-600">
                    Order Submitted!
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    We'll send you a confirmation email and notification when
                    your tag is ready.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              ) : orderType === "database" ? (
                <form onSubmit={handleSubmitQr} className="space-y-4">
                  {/* Tag Preview */}
                  <TagPreview
                    material={selectedMaterial}
                    orderType="database"
                    formData={qrForm}
                    qrCodePosition={qrCodePosition}
                    onQrPositionChange={setQrCodePosition}
                    side1Config={side1Config}
                    side2Config={side2Config}
                    qrCodeSide={qrCodeSide}
                  />
                  
                  {/* Side 1 Configuration - Pet Name with Font Selection */}
                  <div className="pt-3 border-t space-y-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Side 1: Pet Name (Front)
                    </label>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Font Style for Pet Name
                        <span className="text-gray-500 font-normal block mt-1">
                          Optimized for laser engraving readability
                        </span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSide1Config(prev => ({ ...prev, fontType: 'bold' }))}
                          className={`px-3 py-3 text-xs rounded-lg border-2 transition-colors ${
                            side1Config.fontType === 'bold'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                          style={side1Config.fontType === 'bold' ? { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' } : {}}
                        >
                          <div className="font-semibold mb-0.5">Bold</div>
                          <div className="text-xs opacity-75">Bebas Neue</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSide1Config(prev => ({ ...prev, fontType: 'elegant' }))}
                          className={`px-3 py-3 text-xs rounded-lg border-2 transition-colors ${
                            side1Config.fontType === 'elegant'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                          style={side1Config.fontType === 'elegant' ? { fontFamily: '"Playfair Display", serif', fontStyle: 'italic' } : {}}
                        >
                          <div className="font-semibold mb-0.5">Elegant</div>
                          <div className="text-xs opacity-75">Playfair Display</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSide1Config(prev => ({ ...prev, fontType: 'playful' }))}
                          className={`px-3 py-3 text-xs rounded-lg border-2 transition-colors ${
                            side1Config.fontType === 'playful'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                          style={side1Config.fontType === 'playful' ? { fontFamily: '"Quicksand", sans-serif', fontWeight: '600' } : {}}
                        >
                          <div className="font-semibold mb-0.5">Playful</div>
                          <div className="text-xs opacity-75">Quicksand</div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pet Information */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Pet Information
                    </label>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Pet Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="petname"
                        value={qrForm.petname}
                        onChange={handleQrFormChange}
                        placeholder="e.g., Max or Fluffy"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Owner Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        value={qrForm.firstname}
                        onChange={handleQrFormChange}
                        placeholder="Your full name"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="pt-3 border-t space-y-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Address Information
                    </label>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address_line_1"
                        value={qrForm.address_line_1}
                        onChange={handleQrFormChange}
                        placeholder="123 Main St"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Apt/Unit (Optional)
                      </label>
                      <input
                        type="text"
                        name="address_line_2"
                        value={qrForm.address_line_2}
                        onChange={handleQrFormChange}
                        placeholder="Apt 4B"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-3 border-t space-y-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Contact Information
                    </label>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={qrForm.email}
                          onChange={handleQrFormChange}
                          placeholder="your@email.com"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={qrForm.phone}
                          onChange={handleQrFormChange}
                          placeholder="(555) 123-4567"
                          maxLength={14}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
                            phoneErrors.qr ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {phoneErrors.qr && (
                          <p className="text-red-500 text-xs mt-1">{phoneErrors.qr}</p>
                        )}
                        {!phoneErrors.qr && qrForm.phone && (
                          <p className="text-green-600 text-xs mt-1">✓ Valid phone number</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set("step", "2");
                        setSearchParams(newParams);
                        setStep(2);
                      }}
                      className="flex-1 px-4 py-2 text-sm border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-md transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Order"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmitEngrave} className="space-y-4">
                  {/* Tag Preview */}
                  <TagPreview
                    material={selectedMaterial}
                    orderType="engrave"
                    formData={engraveForm}
                    side1Config={side1Config}
                    side2Config={side2Config}
                    qrCodeSide={qrCodeSide}
                  />
                  
                  {/* Side 1 Configuration - Pet Name with Font Selection */}
                  <div className="pt-3 border-t space-y-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Side 1: Pet Name (Front)
                    </label>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">
                        Font Style for Pet Name
                        <span className="text-gray-500 font-normal block mt-1">
                          Optimized for laser engraving readability
                        </span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSide1Config(prev => ({ ...prev, fontType: 'bold' }))}
                          className={`px-3 py-3 text-xs rounded-lg border-2 transition-colors ${
                            side1Config.fontType === 'bold'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                          style={side1Config.fontType === 'bold' ? { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' } : {}}
                        >
                          <div className="font-semibold mb-0.5">Bold</div>
                          <div className="text-xs opacity-75">Bebas Neue</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSide1Config(prev => ({ ...prev, fontType: 'elegant' }))}
                          className={`px-3 py-3 text-xs rounded-lg border-2 transition-colors ${
                            side1Config.fontType === 'elegant'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                          style={side1Config.fontType === 'elegant' ? { fontFamily: '"Playfair Display", serif', fontStyle: 'italic' } : {}}
                        >
                          <div className="font-semibold mb-0.5">Elegant</div>
                          <div className="text-xs opacity-75">Playfair Display</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSide1Config(prev => ({ ...prev, fontType: 'playful' }))}
                          className={`px-3 py-3 text-xs rounded-lg border-2 transition-colors ${
                            side1Config.fontType === 'playful'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                          style={side1Config.fontType === 'playful' ? { fontFamily: '"Quicksand", sans-serif', fontWeight: '600' } : {}}
                        >
                          <div className="font-semibold mb-0.5">Playful</div>
                          <div className="text-xs opacity-75">Quicksand</div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pet Information */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Pet Information
                    </label>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Pet Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="petname"
                        value={engraveForm.petname}
                        onChange={handleEngraveChange}
                        placeholder="e.g., Max or Fluffy"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Engraving Text Lines - Side 2 */}
                  <div className="pt-3 border-t space-y-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Side 2: Engraving Text (Back - Max 3 lines)
                    </label>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="line1"
                        value={engraveForm.line1}
                        onChange={handleEngraveChange}
                        placeholder="e.g., Your Name or Address"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        maxLength={25}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="line2"
                        value={engraveForm.line2}
                        onChange={handleEngraveChange}
                        placeholder="e.g., City, ST"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        maxLength={25}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Line 3 (Optional)
                      </label>
                      <input
                        type="text"
                        name="line3"
                        value={engraveForm.line3}
                        onChange={handleEngraveChange}
                        placeholder="e.g., Phone Number"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        maxLength={25}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-3 border-t space-y-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Contact Information (for order notification)
                    </label>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={engraveForm.name}
                        onChange={handleEngraveChange}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={engraveForm.email}
                          onChange={handleEngraveChange}
                          placeholder="john@example.com"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={engraveForm.phone}
                          onChange={handleEngraveChange}
                          placeholder="(555) 123-4567"
                          maxLength={14}
                          className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 ${
                            phoneErrors.engrave ? 'border-red-500' : 'border-gray-300'
                          }`}
                          required
                        />
                        {phoneErrors.engrave && (
                          <p className="text-red-500 text-xs mt-1">{phoneErrors.engrave}</p>
                        )}
                        {!phoneErrors.engrave && engraveForm.phone && (
                          <p className="text-green-600 text-xs mt-1">✓ Valid phone number</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 px-4 py-2 text-sm border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-md transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Order"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (orderType === "database" || orderType === "engrave") && (
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Review Your Design</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Please review your tag design and information before proceeding to payment
            </p>

            {/* Tag Preview - Both Sides */}
            <div className="mb-6">
              <TagPreview
                material={selectedMaterial}
                orderType={orderType}
                formData={orderType === "database" ? qrForm : engraveForm}
                qrCodePosition={qrCodePosition}
                onQrPositionChange={setQrCodePosition}
                side1Config={side1Config}
                side2Config={side2Config}
                qrCodeSide={qrCodeSide}
              />
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-base font-bold mb-3">Order Summary</h3>
              
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tag Shape:</span>
                  <span className="font-semibold">{selectedMaterial?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Type:</span>
                  <span className="font-semibold">
                    {orderType === "database" ? "QR Code Tag" : "Text-Only Tag"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pet Name:</span>
                  <span className="font-semibold">
                    {orderType === "database" ? qrForm.petname : engraveForm.petname}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Font Style:</span>
                  <span className="font-semibold capitalize">{side1Config.fontType}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-bold text-indigo-600">
                    ${selectedMaterial?.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info Summary */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-base font-bold mb-3">Contact Information</h3>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                {orderType === "database" ? (
                  <>
                    <div><span className="text-gray-600">Name:</span> {qrForm.firstname} {qrForm.lastname}</div>
                    <div><span className="text-gray-600">Email:</span> {qrForm.email}</div>
                    <div><span className="text-gray-600">Phone:</span> {qrForm.phone}</div>
                    {qrForm.address_line_1 && (
                      <div><span className="text-gray-600">Address:</span> {qrForm.address_line_1} {qrForm.address_line_2}</div>
                    )}
                  </>
                ) : (
                  <>
                    <div><span className="text-gray-600">Name:</span> {engraveForm.name}</div>
                    <div><span className="text-gray-600">Email:</span> {engraveForm.email}</div>
                    <div><span className="text-gray-600">Phone:</span> {engraveForm.phone}</div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mt-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-6 mt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("step", "3");
                  setSearchParams(newParams);
                  setStep(3);
                }}
                className="flex-1 px-4 py-2 text-sm border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Edit
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-md transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? "Processing..." : "Confirm & Proceed to Payment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MaterialSelection;
