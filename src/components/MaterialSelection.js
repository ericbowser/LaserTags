import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ArrowRight, Database, FileText, CheckCircle, RotateCcw } from "lucide-react";
import axios from "axios";
import { LASER_BACKEND_BASE_URL } from "../../env.json";
import StripeCheckout from "./StripeCheckout";
import TagPreview from "./TagPreview";
import FontDropdown from "./FontDropdown";
import { generateQrCodeSVG, generateQrCodeUrl } from "../utils/qrCodeUtils";
import { formatPhoneNumber, validatePhoneNumber, getUnformattedPhone } from "../utils/phoneUtils";
import { saveContact, saveQrCode, createOrder, saveTag } from "../api/tagApi";
import DarkModeToggle from "./DarkModeToggle";
import { DEFAULT_FONT, AVAILABLE_FONTS } from "../config/fonts";
import "../styles/fonts.css";

// Import all silicone tag images
// Bone shapes
import darkblueBone from "../assets/Materials/Silicone/darkblue_bone.png";
import grayBone from "../assets/Materials/Silicone/gray_bone.png";
import lightpinkBone from "../assets/Materials/Silicone/lightpink_bone.png";
import offwhiteBone from "../assets/Materials/Silicone/offwhite_bone.png";
import orangeBone from "../assets/Materials/Silicone/orange_bone.png";
import whiteBone from "../assets/Materials/Silicone/white_bone.png";
import yellowBone from "../assets/Materials/Silicone/yellow_bone.png";

// Circle shapes
import blueCircle from "../assets/Materials/Silicone/blue_circ.jpg";
import orangeCircle from "../assets/Materials/Silicone/orange_circ.png";
import redCircle from "../assets/Materials/Silicone/red_circ.png";
import whiteCircle from "../assets/Materials/Silicone/white_circ.png";

// Rectangle shapes
import blueRect from "../assets/Materials/Silicone/blue_rect.png";
import darkblueRect from "../assets/Materials/Silicone/darkblue_rect.png";
import grayRect from "../assets/Materials/Silicone/gray_rect.png";
import greenRect from "../assets/Materials/Silicone/green_rect.png";
import lightpinkRect from "../assets/Materials/Silicone/lightpink_rect.png";
import lightpurpleRect from "../assets/Materials/Silicone/lightpurple_rect.png";
import orangeRect from "../assets/Materials/Silicone/orange_rect.png";
import pinkRect from "../assets/Materials/Silicone/pink_rect.png";
import purpleRect from "../assets/Materials/Silicone/purple_rect.png";
import redRect from "../assets/Materials/Silicone/red_rect.png";
import turquoiseRect from "../assets/Materials/Silicone/turquoise_rect.png";
import yellowRect from "../assets/Materials/Silicone/yellow_rect.jpg";

// Triangle shapes
import greenTri from "../assets/Materials/Silicone/green_tri.png";

// Hexagon shapes
import purpleHex from "../assets/Materials/Silicone/purple_hex.png";
import turquoiseHex from "../assets/Materials/Silicone/turquoise_hex.png";

// Organized by shape, then by color - TWO-STEP SELECTION
const siliconeShapes = {
  bone: {
    name: "Bone",
    description: "Classic bone shape with rounded edges - a timeless favorite",
    defaultImage: orangeBone,
    colors: [
      { name: "Dark Blue", color: "darkblue", image: darkblueBone, id: "bone-darkblue" },
      { name: "Gray", color: "gray", image: grayBone, id: "bone-gray" },
      { name: "Light Pink", color: "lightpink", image: lightpinkBone, id: "bone-lightpink" },
      { name: "Off-White", color: "offwhite", image: offwhiteBone, id: "bone-offwhite" },
      { name: "Orange", color: "orange", image: orangeBone, id: "bone-orange" },
      { name: "White", color: "white", image: whiteBone, id: "bone-white" },
      { name: "Yellow", color: "yellow", image: yellowBone, id: "bone-yellow" },
    ],
  },
  circle: {
    name: "Circle",
    description: "Timeless circular tag - simple and elegant",
    defaultImage: blueCircle,
    colors: [
      { name: "Blue", color: "blue", image: blueCircle, id: "circle-blue" },
      { name: "Orange", color: "orange", image: orangeCircle, id: "circle-orange" },
      { name: "Red", color: "red", image: redCircle, id: "circle-red" },
      { name: "White", color: "white", image: whiteCircle, id: "circle-white" },
    ],
  },
  rectangle: {
    name: "Rectangle",
    description: "Clean rectangular design - maximum engraving space",
    defaultImage: orangeRect,
    colors: [
      { name: "Blue", color: "blue", image: blueRect, id: "rect-blue" },
      { name: "Dark Blue", color: "darkblue", image: darkblueRect, id: "rect-darkblue" },
      { name: "Gray", color: "gray", image: grayRect, id: "rect-gray" },
      { name: "Green", color: "green", image: greenRect, id: "rect-green" },
      { name: "Light Pink", color: "lightpink", image: lightpinkRect, id: "rect-lightpink" },
      { name: "Light Purple", color: "lightpurple", image: lightpurpleRect, id: "rect-lightpurple" },
      { name: "Orange", color: "orange", image: orangeRect, id: "rect-orange" },
      { name: "Pink", color: "pink", image: pinkRect, id: "rect-pink" },
      { name: "Purple", color: "purple", image: purpleRect, id: "rect-purple" },
      { name: "Red", color: "red", image: redRect, id: "rect-red" },
      { name: "Turquoise", color: "turquoise", image: turquoiseRect, id: "rect-turquoise" },
      { name: "Yellow", color: "yellow", image: yellowRect, id: "rect-yellow" },
    ],
  },
  triangle: {
    name: "Triangle",
    description: "Unique triangular shape - stands out from the crowd",
    defaultImage: greenTri,
    colors: [
      { name: "Green", color: "green", image: greenTri, id: "tri-green" },
    ],
  },
  hexagon: {
    name: "Hexagon",
    description: "Distinctive hexagonal design - modern and stylish",
    defaultImage: turquoiseHex,
    colors: [
      { name: "Purple", color: "purple", image: purpleHex, id: "hex-purple" },
      { name: "Turquoise", color: "turquoise", image: turquoiseHex, id: "hex-turquoise" },
    ],
  },
};

const PRICE = 11.99; // Consistent price for all silicone tags


function MaterialSelection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get parameters from URL
  const stepFromUrl = parseInt(searchParams.get("step") || "1", 10);
  const shapeFromUrl = searchParams.get("shape");
  const materialIdFromUrl = searchParams.get("material");
  const orderTypeFromUrl = searchParams.get("type");

  const [step, setStep] = useState(stepFromUrl);
  const [selectedShape, setSelectedShape] = useState(shapeFromUrl);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [orderType, setOrderType] = useState(orderTypeFromUrl);

  // Form states
  const [qrForm, setQrForm] = useState({
    firstname: "",
    lastname: "",
    petname: "",
    address_line_1: "",
    address_line_2: "",
    address_line_3: "",
    phone: "",
    email: "",
  });

  const [engraveForm, setEngraveForm] = useState({
    petname: "",
    line1: "",
    line2: "",
    line3: "",
    name: "",
    email: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    address_line_3: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [qrCodePosition, setQrCodePosition] = useState({ x: 50, y: 50 });
  const [phoneErrors, setPhoneErrors] = useState({ qr: null, engrave: null });

  const [selectedFont, setSelectedFont] = useState(DEFAULT_FONT.id);
  const [textCase, setTextCase] = useState('title'); // 'title' or 'uppercase'
  const [designingSide, setDesigningSide] = useState(1); // Which side is currently being designed (1 or 2)
  const [side1Config, setSide1Config] = useState({
    line1: '',
    line2: '',
    line3: '',
    fontId: DEFAULT_FONT.id
  });
  const [side2Config, setSide2Config] = useState({
    line1: '',
    line2: '',
    line3: '',
    fontId: DEFAULT_FONT.id
  });
  const [qrCodeSide, setQrCodeSide] = useState(2);
  const [qrCodeText, setQrCodeText] = useState({
    line1: '',
    line2: '',
    line3: ''
  });

  // Listen to URL changes (browser back/forward buttons)
  useEffect(() => {
    const urlStep = parseInt(searchParams.get("step") || "1", 10);
    const urlShape = searchParams.get("shape");
    const urlMaterialId = searchParams.get("material");
    const urlOrderType = searchParams.get("type");

    if (urlStep !== step) {
      setStep(urlStep);
    }

    if (urlShape !== selectedShape) {
      setSelectedShape(urlShape);
    }

    // Update material from URL
    if (urlMaterialId && urlShape) {
      const shapeData = siliconeShapes[urlShape];
      const material = shapeData?.colors.find((c) => c.id === urlMaterialId);
      if (material && material.id !== selectedMaterial?.id) {
        // Map shape keys to shape IDs for TagPreview
        const shapeMap = {
          'bone': 'bone',
          'rectangle': 'rect',
          'circle': 'circ',
          'triangle': 'tri',
          'hexagon': 'hex'
        };
        setSelectedMaterial({
          ...material,
          shapeName: shapeData.name,
          shape: shapeMap[urlShape] || urlShape,
          price: PRICE,
        });
      }
    } else if (selectedMaterial && urlStep <= 1) {
      setSelectedMaterial(null);
    }

    if (urlOrderType !== orderType) {
      setOrderType(urlOrderType);
    } else if (!urlOrderType && orderType && urlStep <= 3) {
      setOrderType(null);
    }
  }, [searchParams]);

  // Sync step to URL
  useEffect(() => {
    const urlStep = parseInt(searchParams.get("step") || "1", 10);
    if (step !== urlStep) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("step", step.toString());
      setSearchParams(newParams, { replace: true });
    }
  }, [step]);

  // Sync orderType to URL
  useEffect(() => {
    const urlOrderType = searchParams.get("type");
    if (orderType && orderType !== urlOrderType) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("type", orderType);
      setSearchParams(newParams, { replace: true });
    }
  }, [orderType]);

  const handleShapeSelect = (shapeKey) => {
    setSelectedShape(shapeKey);
    const newParams = new URLSearchParams();
    newParams.set("step", "2");
    newParams.set("shape", shapeKey);
    setSearchParams(newParams);
    setStep(2);
  };

  const handleColorSelect = (shapeKey, colorOption) => {
    const shapeData = siliconeShapes[shapeKey];
    // Map shape keys to shape IDs for TagPreview
    const shapeMap = {
      'bone': 'bone',
      'rectangle': 'rect',
      'circle': 'circ',
      'triangle': 'tri',
      'hexagon': 'hex'
    };
    const material = {
      ...colorOption,
      shapeName: shapeData.name,
      shape: shapeMap[shapeKey] || shapeKey,
      price: PRICE,
    };
    setSelectedMaterial(material);
    const newParams = new URLSearchParams();
    newParams.set("step", "3");
    newParams.set("shape", shapeKey);
    newParams.set("material", colorOption.id);
    setSearchParams(newParams);
    setStep(3);
  };

  const handleOrderTypeSelect = async (type) => {
    setOrderType(type);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("step", "4");
    newParams.set("type", type);
    setSearchParams(newParams);
    setStep(4);
  };

  // Unified handler for tag text input (both sides)
  const handleTagTextChange = (side, line, value) => {
    if (side === 1) {
      setSide1Config((prev) => ({ ...prev, [line]: value }));
    } else {
      setSide2Config((prev) => ({ ...prev, [line]: value }));
    }
  };

  const handleQrCodeTextChange = (line, value) => {
    setQrCodeText((prev) => ({ ...prev, [line]: value }));
  };

  // Handle font change - applies to both sides
  const handleFontChange = (fontId) => {
    setSelectedFont(fontId);
    setSide1Config((prev) => ({ ...prev, fontId: fontId }));
    setSide2Config((prev) => ({ ...prev, fontId: fontId }));
  };

  // Flip to design the other side
  const handleFlipDesignSide = () => {
    setDesigningSide(designingSide === 1 ? 2 : 1);
  };

  const handleQrFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setQrForm((prev) => ({ ...prev, [name]: formatted }));
      const validation = validatePhoneNumber(formatted);
      setPhoneErrors((prev) => ({ ...prev, qr: validation.isValid ? null : validation.error }));
    } else {
      setQrForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEngraveChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      setEngraveForm((prev) => ({ ...prev, [name]: formatted }));
      const validation = validatePhoneNumber(formatted);
      setPhoneErrors((prev) => ({ ...prev, engrave: validation.isValid ? null : validation.error }));
    } else {
      setEngraveForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Unified submit handler for tag design
  const handleSubmitTagDesign = async (e) => {
    e.preventDefault();
    setError(null);

    if (orderType === 'database') {
      // For database orders, validate QR code text
      if (!qrCodeText.line1 && !qrCodeText.line2 && !qrCodeText.line3) {
        setError("Please enter at least one line of text to encode in the QR code");
        return;
      }
      
      // Validate that the non-QR side has text
      const nonQrSide = qrCodeSide === 1 ? side2Config : side1Config;
      const nonQrSideHasText = nonQrSide.line1 || nonQrSide.line2 || nonQrSide.line3;
      
      if (!nonQrSideHasText) {
        setError(`Please enter at least one line of text for Side ${qrCodeSide === 1 ? 2 : 1} (the side without the QR code)`);
        return;
      }
    } else {
      // For engrave orders, validate both sides have text
      const side1HasText = side1Config.line1 || side1Config.line2 || side1Config.line3;
      const side2HasText = side2Config.line1 || side2Config.line2 || side2Config.line3;

      if (!side1HasText) {
        setError("Please enter at least one line of text for Side 1");
        return;
      }

      if (!side2HasText) {
        setError("Please enter at least one line of text for Side 2");
        return;
      }
    }

    // Move to review step
    const newParams = new URLSearchParams(searchParams);
    newParams.set("step", "5");
    setSearchParams(newParams);
    setStep(5);
  };

  const handleSubmitQr = async (e) => {
    e.preventDefault();
    setError(null);

    if (!qrForm.firstname || !qrForm.phone || !qrForm.email) {
      setError("Please fill in all required fields (First Name, Phone, Email)");
      return;
    }

    const phoneValidation = validatePhoneNumber(qrForm.phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error);
      setPhoneErrors((prev) => ({ ...prev, qr: phoneValidation.error }));
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.set("step", "5");
    setSearchParams(newParams);
    setStep(5);
  };

  const handleSubmitEngrave = async (e) => {
    e.preventDefault();
    setError(null);

    if (!engraveForm.name || !engraveForm.email || !engraveForm.phone) {
      setError("Please fill in all required fields (Your Name, Email, Phone)");
      return;
    }

    const phoneValidation = validatePhoneNumber(engraveForm.phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error);
      setPhoneErrors((prev) => ({ ...prev, engrave: phoneValidation.error }));
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.set("step", "5");
    setSearchParams(newParams);
    setStep(5);
  };

  const generateUserId = () => {
    // Prefer cryptographically secure randomness for user IDs
    const cryptoObj =
      (typeof window !== "undefined" && window.crypto) ||
      (typeof self !== "undefined" && self.crypto) ||
      null;

    if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
      return `user_${cryptoObj.randomUUID()}`;
    }

    if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
      const array = new Uint32Array(3);
      cryptoObj.getRandomValues(array);
      const randomPart = Array.from(array)
        .map((n) => n.toString(36))
        .join("")
        .substr(0, 16);
      return `user_${Date.now()}_${randomPart}`;
    }

    // Fallback for environments without Web Crypto API
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const saveContactAndCreateOrder = async (contactData, hasQrCode) => {
    const saveResponse = await saveContact(contactData);
    if (!saveResponse) {
      throw new Error("Failed to save contact information");
    }

    const contactid = saveResponse?.id;
    if (!contactid) {
      throw new Error("Failed to get contact ID");
    }

    const orderid = await createOrder({
      id: contactid,
      has_qr_code: hasQrCode,
      amount: Math.round(selectedMaterial.price * 100),
      currency: "usd",
      stripe_payment_intent_id: null,  // CRITICAL: null instead of "pending"
      status: "pending",
    });

    if (!orderid) {
      throw new Error("Failed to create order");
    }

    return { contactid, orderid };
  };

  // Helper function to map tag data to tag table format
  const mapTagData = (orderid, side1Config, side2Config, orderType, qrCodeSide = 2) => {
    console.log('mapTagData - Input parameters:', {
      orderid,
      side1Config,
      side2Config,
      orderType,
      qrCodeSide
    });

    const tagData = {
      orderid: orderid,
      tagside: [],
      text_line_1: [],
      text_line_2: '',
      text_line_3: '',
      text_line_4: [],
      text_line_5: '',
      text_line_6: '',
      notes: ''
    };

    // Side 1: Up to 3 lines of text
    const side1Line1 = side1Config?.line1 || '';
    const side1Line2 = side1Config?.line2 || '';
    const side1Line3 = side1Config?.line3 || '';
    
    if (side1Line1 || side1Line2 || side1Line3) {
      tagData.tagside.push('1');
      if (side1Line1) {
        tagData.text_line_1.push(side1Line1);
      }
      if (side1Line2) {
        tagData.text_line_2 = side1Line2;
      }
      if (side1Line3) {
        tagData.text_line_3 = side1Line3;
      }
    }

    // Side 2: Up to 3 lines of text (QR code handled separately for database orders)
    const side2Line1 = side2Config?.line1 || '';
    const side2Line2 = side2Config?.line2 || '';
    const side2Line3 = side2Config?.line3 || '';
    
    if (side2Line1 || side2Line2 || side2Line3) {
      tagData.tagside.push('2');
      if (side2Line1) {
        tagData.text_line_4.push(side2Line1);
      }
      if (side2Line2) {
        tagData.text_line_5 = side2Line2;
      }
      if (side2Line3) {
        tagData.text_line_6 = side2Line3;
      }
    }

    console.log('mapTagData - Mapped tag data:', JSON.stringify(tagData, null, 2));
    return tagData;
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    setError(null);

    // Validate required checkout fields
    if (orderType === "database") {
      if (!qrForm.firstname || !qrForm.email || !qrForm.phone || !qrForm.address_line_1) {
        setError("Please fill in all required checkout fields (First Name, Email, Phone, Street Address)");
        setIsSubmitting(false);
        return;
      }

      const phoneValidation = validatePhoneNumber(qrForm.phone);
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error);
        setPhoneErrors((prev) => ({ ...prev, qr: phoneValidation.error }));
        setIsSubmitting(false);
        return;
      }

      let userId = qrForm.userid || generateUserId();
      setQrForm((prev) => ({ ...prev, userid: userId }));

      const fullname = [qrForm.firstname, qrForm.lastname].filter(Boolean).join(" ");
      const unformattedPhone = getUnformattedPhone(qrForm.phone);

      const contactData = {
        firstname: qrForm.firstname,
        lastname: qrForm.lastname || "",
        fullname: fullname,
        petname: "", // No longer using petname in contact
        phone: unformattedPhone,
        address_line_1: qrForm.address_line_1 || "",
        address_line_2: qrForm.address_line_2 || "",
        address_line_3: qrForm.address_line_3 || "",
      };

      try {
        const { contactid, orderid } = await saveContactAndCreateOrder(contactData, true);

        // Save tag information to tag table
        if (orderid) {
          const tagData = mapTagData(orderid, side1Config, side2Config, "database", qrCodeSide);
          console.log('handleConfirmOrder (database) - Calling saveTag with:', JSON.stringify(tagData, null, 2));
          const tagResult = await saveTag(tagData);
          if (!tagResult) {
            console.warn("Failed to save tag information, but continuing with order");
          } else {
            console.log("Tag information saved successfully:", tagResult);
          }
        }

        const orderData = {
          material: selectedMaterial,
          orderType: "database",
          contactInfo: {
            firstname: qrForm.firstname,
            lastname: qrForm.lastname || "",
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
      // Validate required checkout fields for engrave orders
      if (!engraveForm.name || !engraveForm.email || !engraveForm.phone || !engraveForm.address_line_1) {
        setError("Please fill in all required checkout fields (Name, Email, Phone, Street Address)");
        setIsSubmitting(false);
        return;
      }

      const phoneValidation = validatePhoneNumber(engraveForm.phone);
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error);
        setPhoneErrors((prev) => ({ ...prev, engrave: phoneValidation.error }));
        setIsSubmitting(false);
        return;
      }

      try {
        const firstname = engraveForm.name.split(" ")[0] || engraveForm.name;
        const lastname = engraveForm.name.split(" ").slice(1).join(" ") || "";
        const unformattedPhone = getUnformattedPhone(engraveForm.phone);

        const contactData = {
          firstname: firstname,
          lastname: lastname,
          fullname: engraveForm.name,
          petname: "", // No longer using petname in contact
          phone: unformattedPhone,
          address_line_1: engraveForm.address_line_1 || "",
          address_line_2: engraveForm.address_line_2 || "",
          address_line_3: engraveForm.address_line_3 || "",
        };

        console.log("contactData: ", contactData);
        const { contactid: savedContactId, orderid: savedOrderId } = await saveContactAndCreateOrder(
          contactData,
          false
        );

        // Save tag information to tag table
        if (savedOrderId) {
          const tagData = mapTagData(savedOrderId, side1Config, side2Config, "engrave", 2);
          console.log('handleConfirmOrder (engrave) - Calling saveTag with:', JSON.stringify(tagData, null, 2));
          const tagResult = await saveTag(tagData);
          if (!tagResult) {
            console.warn("Failed to save tag information, but continuing with order");
          } else {
            console.log("Tag information saved successfully:", tagResult);
          }
        }

        const orderData = {
          material: selectedMaterial,
          orderType: "engrave",
          contactInfo: {
            firstname: firstname,
            lastname: lastname,
            fullname: engraveForm.name,
            email: engraveForm.email,
            phone: engraveForm.phone,
            address_line_1: engraveForm.address_line_1 || "",
            address_line_2: engraveForm.address_line_2 || "",
          },
          notificationEmail: engraveForm.email,
          contactid: savedContactId,
          orderid: savedOrderId,
          side1Config,
          side2Config,
        };

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

  const handleStripeSuccess = async () => {
    sessionStorage.removeItem("pendingOrderData");
    setSuccess(true);
    setShowStripe(false);
  };

  const handleStripeCancel = () => {
    setShowStripe(false);
    setOrderData(null);
  };

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
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark py-6 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => {
              if (step === 1) {
                navigate("/");
              } else {
                const newStep = step - 1;
                const newParams = new URLSearchParams(searchParams);
                newParams.set("step", newStep.toString());
                if (newStep <= 3) {
                  newParams.delete("type");
                  if (newStep === 1) {
                    newParams.delete("shape");
                    newParams.delete("material");
                  } else if (newStep === 2) {
                    newParams.delete("material");
                  }
                }
                setSearchParams(newParams);
                setStep(newStep);
              }
            }}
            className="flex items-center gap-1.5 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <DarkModeToggle />
        </div>

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 text-xs">
            {/* Step 1: Shape */}
            <div className={`flex items-center gap-1 ${step >= 1 ? "text-light-primary dark:text-dark-primary" : "text-light-textMuted dark:text-dark-textMuted"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-btn-primary dark:bg-btn-primary-dark text-white shadow-md" : "bg-light-surface dark:bg-dark-surface text-light-textMuted dark:text-dark-textMuted border border-light-border dark:border-dark-border"}`}>
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
              </div>
              <span className="font-semibold">Shape</span>
            </div>
            <div className="flex-1 h-1 mx-1 bg-light-border dark:bg-dark-border rounded-full">
              <div className={`h-full rounded-full transition-all ${step >= 2 ? "bg-btn-primary dark:bg-btn-primary-dark" : ""}`} style={{ width: step >= 2 ? "100%" : "0%" }} />
            </div>

            {/* Step 2: Color */}
            <div className={`flex items-center gap-1 ${step >= 2 ? "text-light-primary dark:text-dark-primary" : "text-light-textMuted dark:text-dark-textMuted"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-btn-primary dark:bg-btn-primary-dark text-white shadow-md" : "bg-light-surface dark:bg-dark-surface text-light-textMuted dark:text-dark-textMuted border border-light-border dark:border-dark-border"}`}>
                {step > 2 ? <CheckCircle className="w-4 h-4" /> : "2"}
              </div>
              <span className="font-semibold">Color</span>
            </div>
            <div className="flex-1 h-1 mx-1 bg-light-border dark:bg-dark-border rounded-full">
              <div className={`h-full rounded-full transition-all ${step >= 3 ? "bg-btn-primary dark:bg-btn-primary-dark" : ""}`} style={{ width: step >= 3 ? "100%" : "0%" }} />
            </div>

            {/* Step 3: Type */}
            <div className={`flex items-center gap-1 ${step >= 3 ? "text-light-primary dark:text-dark-primary" : "text-light-textMuted dark:text-dark-textMuted"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 3 ? "bg-btn-primary dark:bg-btn-primary-dark text-white shadow-md" : "bg-light-surface dark:bg-dark-surface text-light-textMuted dark:text-dark-textMuted border border-light-border dark:border-dark-border"}`}>
                {step > 3 ? <CheckCircle className="w-4 h-4" /> : "3"}
              </div>
              <span className="font-semibold">Type</span>
            </div>

            {step >= 4 && (
              <>
                <div className="flex-1 h-1 mx-1 bg-light-border dark:bg-dark-border rounded-full">
                  <div className={`h-full rounded-full transition-all ${step >= 4 ? "bg-btn-primary dark:bg-btn-primary-dark" : ""}`} style={{ width: step >= 4 ? "100%" : "0%" }} />
                </div>

                {/* Step 4: Info */}
                <div className={`flex items-center gap-1 ${step >= 4 ? "text-light-primary dark:text-dark-primary" : "text-light-textMuted dark:text-dark-textMuted"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 4 ? "bg-btn-primary dark:bg-btn-primary-dark text-white shadow-md" : "bg-light-surface dark:bg-dark-surface text-light-textMuted dark:text-dark-textMuted border border-light-border dark:border-dark-border"}`}>
                    {step > 4 ? <CheckCircle className="w-4 h-4" /> : "4"}
                  </div>
                  <span className="font-semibold">Info</span>
                </div>
                <div className="flex-1 h-1 mx-1 bg-light-border dark:bg-dark-border rounded-full">
                  <div className={`h-full rounded-full transition-all ${step >= 5 ? "bg-btn-primary dark:bg-btn-primary-dark" : ""}`} style={{ width: step >= 5 ? "100%" : "0%" }} />
                </div>

                {/* Step 5: Review */}
                <div className={`flex items-center gap-1 ${step >= 5 ? "text-light-primary dark:text-dark-primary" : "text-light-textMuted dark:text-dark-textMuted"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${step >= 5 ? "bg-btn-primary dark:bg-btn-primary-dark text-white shadow-md" : "bg-light-surface dark:bg-dark-surface text-light-textMuted dark:text-dark-textMuted border border-light-border dark:border-dark-border"}`}>
                    5
                  </div>
                  <span className="font-semibold">Review</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step 1: Shape Selection */}
        {step === 1 && (
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-card dark:shadow-card-dark p-6 border-2 border-light-border dark:border-dark-border">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-light-text dark:text-dark-text">
              Choose Your Tag Shape
            </h1>
            <p className="text-light-textMuted dark:text-dark-textMuted mb-6">
              Select the shape that best suits your pet's style
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(siliconeShapes).map(([shapeKey, shapeData]) => (
                <div
                  key={shapeKey}
                  onClick={() => handleShapeSelect(shapeKey)}
                  className="bg-white dark:bg-dark-surfaceHover border-2 border-light-border dark:border-dark-border rounded-xl p-5 hover:border-light-primary dark:hover:border-dark-primary hover:shadow-card-hover dark:hover:shadow-card-hover-dark cursor-pointer transition-all group"
                >
                  <div className="w-full h-32 bg-light-tagBg dark:bg-dark-tagBg border border-light-tagBorder dark:border-dark-tagBorder rounded-lg flex items-center justify-center overflow-hidden mb-4 group-hover:scale-105 transition-transform">
                    <img
                      src={shapeData.defaultImage}
                      alt={shapeData.name}
                      className="max-w-full max-h-full object-contain dark:brightness-110 dark:contrast-105"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-light-text dark:text-dark-text text-center">
                    {shapeData.name}
                  </h3>
                  <p className="text-light-textMuted dark:text-dark-textMuted text-sm text-center mb-3">
                    {shapeData.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-light-textMuted dark:text-dark-textMuted">
                      {shapeData.colors.length} {shapeData.colors.length === 1 ? 'color' : 'colors'}
                    </span>
                    <ArrowRight className="w-5 h-5 text-light-textMuted group-hover:text-light-primary dark:group-hover:text-dark-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Color Selection */}
        {step === 2 && selectedShape && (
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-card dark:shadow-card-dark p-6 border-2 border-light-border dark:border-dark-border">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2 text-light-text dark:text-dark-text">
                Choose Your {siliconeShapes[selectedShape].name} Color
              </h1>
              <p className="text-light-textMuted dark:text-dark-textMuted">
                {siliconeShapes[selectedShape].description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {siliconeShapes[selectedShape].colors.map((colorOption) => (
                <div
                  key={colorOption.id}
                  onClick={() => handleColorSelect(selectedShape, colorOption)}
                  className="bg-white dark:bg-dark-surfaceHover border-2 border-light-border dark:border-dark-border rounded-xl p-3 hover:border-light-primary dark:hover:border-dark-primary hover:shadow-card-hover dark:hover:shadow-card-hover-dark cursor-pointer transition-all group"
                >
                  <div className="w-full h-24 bg-light-tagBg dark:bg-dark-tagBg border border-light-tagBorder dark:border-dark-tagBorder rounded-lg flex items-center justify-center overflow-hidden mb-3 group-hover:scale-105 transition-transform">
                    <img
                      src={colorOption.image}
                      alt={`${siliconeShapes[selectedShape].name} - ${colorOption.name}`}
                      className="max-w-full max-h-full object-contain dark:brightness-110 dark:contrast-105"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-center text-light-text dark:text-dark-text">
                    {colorOption.name}
                  </h3>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between">
                <span className="text-light-textMuted dark:text-dark-textMuted font-medium">Price:</span>
                <span className="text-2xl font-bold text-light-primary dark:text-dark-primary">
                  ${PRICE}
                </span>
              </div>
            </div>
          </div>
        )}


        {/* Step 3: Order Type Selection */}
        {step === 3 && selectedMaterial && (
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-card dark:shadow-card-dark p-6 border-2 border-light-border dark:border-dark-border">
            <div className="mb-4 flex items-center gap-3 pb-3 border-b border-light-border dark:border-dark-border">
              <div className="w-14 h-14 bg-light-tagBg dark:bg-dark-tagBg border border-light-tagBorder dark:border-dark-tagBorder rounded-lg flex items-center justify-center">
                <img
                  src={selectedMaterial.image}
                  alt={`${selectedMaterial.shapeName} - ${selectedMaterial.name}`}
                  className="max-w-full max-h-full object-contain dark:brightness-110 dark:contrast-105"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-light-text dark:text-dark-text">
                  {selectedMaterial.shapeName} - {selectedMaterial.name}
                </h3>
                <p className="text-light-primary dark:text-dark-primary text-sm font-semibold">
                  ${selectedMaterial.price}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">
              How would you like to proceed?
            </h2>
            <p className="text-light-textMuted dark:text-dark-textMuted mb-6">
              Choose how we should handle your contact information
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              <div
                onClick={() => handleOrderTypeSelect("database")}
                className="bg-white dark:bg-dark-surfaceHover border-2 border-light-border dark:border-dark-border rounded-xl p-5 hover:border-light-primary dark:hover:border-dark-primary hover:shadow-card-hover dark:hover:shadow-card-hover-dark cursor-pointer transition-all group"
              >
                <Database className="w-8 h-8 text-light-primary dark:text-dark-primary mb-3" />
                <h3 className="text-base font-bold mb-2 text-light-text dark:text-dark-text">QR Code Tag</h3>
                <p className="text-light-textMuted dark:text-dark-textMuted mb-3 text-sm">
                  QR code engraved on tag. Scannable with any smartphone to display your pet's info.
                </p>
                <ul className="text-xs text-light-textMuted dark:text-dark-textMuted space-y-1.5">
                  <li className="flex items-center gap-1">
                    <span className="text-light-primary dark:text-dark-primary font-bold">✓</span>
                    QR code engraved
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="text-light-primary dark:text-dark-primary font-bold">✓</span>
                    Update info anytime
                  </li>
                </ul>
              </div>

              <div
                onClick={() => handleOrderTypeSelect("engrave")}
                className="bg-white dark:bg-dark-surfaceHover border-2 border-light-border dark:border-dark-border rounded-xl p-5 hover:border-light-secondary dark:hover:border-dark-secondary hover:shadow-card-hover dark:hover:shadow-card-hover-dark cursor-pointer transition-all group"
              >
                <FileText className="w-8 h-8 text-light-secondary dark:text-dark-secondary mb-3" />
                <h3 className="text-base font-bold mb-2 text-light-text dark:text-dark-text">Text-Only Tag</h3>
                <p className="text-light-textMuted dark:text-dark-textMuted mb-3 text-sm">
                  Directly engrave your pet's information as text. Simple and traditional.
                </p>
                <ul className="text-xs text-light-textMuted dark:text-dark-textMuted space-y-1.5">
                  <li className="flex items-center gap-1">
                    <span className="text-light-secondary dark:text-dark-secondary font-bold">✓</span>
                    Up to 3 lines of text
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="text-light-secondary dark:text-dark-secondary font-bold">✓</span>
                    Traditional engraving
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}


        {/* Step 4: Form Entry */}
        {step === 4 && (
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-card dark:shadow-card-dark p-6 border-2 border-light-border dark:border-dark-border">
            <div className="mb-4 flex items-center gap-3 pb-3 border-b border-light-border dark:border-dark-border">
              <div className="w-14 h-14 bg-light-tagBg dark:bg-dark-tagBg border border-light-tagBorder dark:border-dark-tagBorder rounded-lg flex items-center justify-center">
                <img
                  src={selectedMaterial.image}
                  alt={`${selectedMaterial.shapeName} - ${selectedMaterial.name}`}
                  className="max-w-full max-h-full object-contain dark:brightness-110 dark:contrast-105"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-light-text dark:text-dark-text">
                  {selectedMaterial.shapeName} - {selectedMaterial.name}
                </h3>
                <p className="text-light-primary dark:text-dark-primary text-sm font-semibold">
                  ${selectedMaterial.price}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2 text-light-text dark:text-dark-text">
              Design Your Tag
            </h2>
            <p className="text-light-textMuted dark:text-dark-textMuted mb-6 text-sm">
              {orderType === 'database' 
                ? 'Enter the text to encode in the QR code (up to 3 lines), choose which side will have the QR code, and add text for the other side.'
                : 'Enter up to 3 lines of text for each side. Start with Side 1, then flip to design Side 2.'}
            </p>

            {/* Unified Tag Design Form */}
            <form onSubmit={handleSubmitTagDesign} className="space-y-4">
              {/* Side-by-side layout: Preview on left, Form on right */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Tag Preview */}
                <div className="lg:sticky lg:top-4 lg:self-start">
                  <TagPreview
                    material={selectedMaterial}
                    orderType={orderType}
                    formData={orderType === "database" ? qrForm : engraveForm}
                    qrCodePosition={qrCodePosition}
                    onQrPositionChange={setQrCodePosition}
                    side1Config={side1Config}
                    side2Config={side2Config}
                    qrCodeSide={qrCodeSide}
                    qrCodeText={qrCodeText}
                    selectedFont={selectedFont}
                    textCase={textCase}
                    onTextCaseChange={setTextCase}
                  />
                </div>

                {/* Right: Form Fields */}
                <div className="space-y-4">
                  {/* QR Code Side Selection - only for database orders */}
                  {orderType === 'database' && (
                    <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-3">
                        Choose QR Code Side
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setQrCodeSide(1)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            qrCodeSide === 1
                              ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-100 dark:bg-indigo-900/40'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-surfaceLight hover:border-indigo-400 dark:hover:border-indigo-600'
                          }`}
                        >
                          <div className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                            Side 1
                          </div>
                          <div className="text-xs text-light-textMuted dark:text-dark-textMuted">
                            QR code on front
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setQrCodeSide(2)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            qrCodeSide === 2
                              ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-100 dark:bg-indigo-900/40'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-surfaceLight hover:border-indigo-400 dark:hover:border-indigo-600'
                          }`}
                        >
                          <div className="text-sm font-medium text-light-text dark:text-dark-text mb-1">
                            Side 2
                          </div>
                          <div className="text-xs text-light-textMuted dark:text-dark-textMuted">
                            QR code on back
                          </div>
                        </button>
                      </div>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-2">
                        The QR code will encode the text you enter below. The other side will display regular engraved text.
                      </p>
                    </div>
                  )}

                  {/* QR Code Text Input - only for database orders */}
                  {orderType === 'database' && (
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-3">
                        Text to Encode in QR Code
                        <span className="text-xs font-normal text-light-textMuted dark:text-dark-textMuted ml-2">
                          (This text will be encoded in the QR code, not displayed as text)
                        </span>
                      </label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            Line 1 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={qrCodeText.line1}
                            onChange={(e) => handleQrCodeTextChange('line1', e.target.value)}
                            placeholder="e.g., Pet Name: Max"
                            maxLength={50}
                            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            Line 2 (Optional)
                          </label>
                          <input
                            type="text"
                            value={qrCodeText.line2}
                            onChange={(e) => handleQrCodeTextChange('line2', e.target.value)}
                            placeholder="e.g., Phone: 555-123-4567"
                            maxLength={50}
                            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            Line 3 (Optional)
                          </label>
                          <input
                            type="text"
                            value={qrCodeText.line3}
                            onChange={(e) => handleQrCodeTextChange('line3', e.target.value)}
                            placeholder="e.g., Address: 123 Main St"
                            maxLength={50}
                            className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                        When scanned, the QR code will display these three lines of text.
                      </p>
                    </div>
                  )}

                  {/* Font Selection - applies to both sides */}
                  <div>
                    <FontDropdown
                      selectedFont={selectedFont}
                      onFontChange={handleFontChange}
                      previewText={side1Config.line1 || side2Config.line1 || "Sample Text"}
                    />
                  </div>

                  {/* Side Indicator and Flip Button */}
                  <div className="flex items-center justify-between p-3 bg-light-surface dark:bg-dark-surfaceLight rounded-lg border border-light-border dark:border-dark-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                          designingSide === 1 
                            ? 'bg-btn-primary dark:bg-btn-primary-dark text-white scale-110' 
                            : 'bg-light-surface dark:bg-dark-surface text-light-textMuted dark:text-dark-textMuted'
                        }`}>
                          1
                        </div>
                        <span className={`text-xs font-medium ${
                          designingSide === 1 
                            ? 'text-light-primary dark:text-dark-primary' 
                            : 'text-light-textMuted dark:text-dark-textMuted'
                        }`}>
                          {side1Config.line1 || side1Config.line2 || side1Config.line3 ? '✓' : ''} Side 1
                        </span>
                      </div>
                      <div className="text-light-textMuted dark:text-dark-textMuted">|</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                          designingSide === 2 
                            ? 'bg-btn-primary dark:bg-btn-primary-dark text-white scale-110' 
                            : 'bg-light-surface dark:bg-dark-surface text-light-textMuted dark:text-dark-textMuted'
                        }`}>
                          2
                        </div>
                        <span className={`text-xs font-medium ${
                          designingSide === 2 
                            ? 'text-light-primary dark:text-dark-primary' 
                            : 'text-light-textMuted dark:text-dark-textMuted'
                        }`}>
                          {side2Config.line1 || side2Config.line2 || side2Config.line3 ? '✓' : ''} Side 2
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFlipDesignSide();
                      }}
                      className="flex items-center gap-1 text-sm text-light-primary dark:text-dark-primary hover:text-light-primaryHover dark:hover:text-dark-primaryHover transition-colors px-3 py-1.5 rounded hover:bg-light-surface dark:hover:bg-dark-surfaceHover"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Switch to Side {designingSide === 1 ? 2 : 1}</span>
                    </button>
                  </div>

                  {/* Side 1 Inputs */}
                  {designingSide === 1 && (
                    <div className="space-y-3 transition-opacity duration-300">
                      <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                        Side 1 Text (Front)
                        {orderType === "database" && qrCodeSide === 1 && (
                          <span className="text-xs text-light-textMuted dark:text-dark-textMuted ml-2">
                            (QR code will be on this side)
                          </span>
                        )}
                        {orderType === "database" && qrCodeSide === 2 && (
                          <span className="text-xs text-light-textMuted dark:text-dark-textMuted ml-2">
                            (Regular text engraving)
                          </span>
                        )}
                      </label>
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                          Line 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={side1Config.line1}
                          onChange={(e) => handleTagTextChange(1, 'line1', e.target.value)}
                          placeholder="e.g., Pet Name"
                          maxLength={25}
                          className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                          Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          value={side1Config.line2}
                          onChange={(e) => handleTagTextChange(1, 'line2', e.target.value)}
                          placeholder="e.g., Additional info"
                          maxLength={25}
                          className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                          Line 3 (Optional)
                        </label>
                        <input
                          type="text"
                          value={side1Config.line3}
                          onChange={(e) => handleTagTextChange(1, 'line3', e.target.value)}
                          placeholder="e.g., More details"
                          maxLength={25}
                          className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Side 2 Inputs */}
                  {designingSide === 2 && (
                    <div className="space-y-3 transition-opacity duration-300">
                      <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                        Side 2 Text (Back)
                        {orderType === "database" && qrCodeSide === 2 && (
                          <span className="text-xs text-light-textMuted dark:text-dark-textMuted ml-2">
                            (QR code will be on this side)
                          </span>
                        )}
                        {orderType === "database" && qrCodeSide === 1 && (
                          <span className="text-xs text-light-textMuted dark:text-dark-textMuted ml-2">
                            (Regular text engraving)
                          </span>
                        )}
                      </label>
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                          Line 1 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={side2Config.line1}
                          onChange={(e) => handleTagTextChange(2, 'line1', e.target.value)}
                          placeholder="e.g., Contact info"
                          maxLength={25}
                          className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                          Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          value={side2Config.line2}
                          onChange={(e) => handleTagTextChange(2, 'line2', e.target.value)}
                          placeholder="e.g., Additional info"
                          maxLength={25}
                          className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                          Line 3 (Optional)
                        </label>
                        <input
                          type="text"
                          value={side2Config.line3}
                          onChange={(e) => handleTagTextChange(2, 'line3', e.target.value)}
                          placeholder="e.g., More details"
                          maxLength={25}
                          className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-3 rounded">
                      <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Progress indicator */}
                  <div className="pt-3 border-t border-light-border dark:border-dark-border">
                    <div className="flex items-center justify-between text-xs text-light-textMuted dark:text-dark-textMuted mb-3">
                      <span>Design Progress:</span>
                      <span className="font-semibold text-light-text dark:text-dark-text">
                        {[
                          side1Config.line1 || side1Config.line2 || side1Config.line3 ? 'Side 1' : null,
                          side2Config.line1 || side2Config.line2 || side2Config.line3 ? 'Side 2' : null
                        ].filter(Boolean).join(' & ') || 'Not started'}
                      </span>
                    </div>
                    <div className="w-full bg-light-surface dark:bg-dark-surfaceLight rounded-full h-2">
                      <div 
                        className="bg-btn-primary dark:bg-btn-primary-dark h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${[
                            side1Config.line1 || side1Config.line2 || side1Config.line3,
                            side2Config.line1 || side2Config.line2 || side2Config.line3
                          ].filter(Boolean).length * 50}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set("step", "3");
                        setSearchParams(newParams);
                        setStep(3);
                      }}
                      className="flex-1 px-5 py-2.5 text-sm border-2 border-light-border dark:border-dark-border rounded-lg font-semibold text-light-text dark:text-dark-text bg-white dark:bg-dark-surface hover:bg-light-surface dark:hover:bg-dark-surfaceHover transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting || 
                        (orderType === 'database' 
                          ? (!qrCodeText.line1 && !qrCodeText.line2 && !qrCodeText.line3) ||
                            (qrCodeSide === 1 ? !(side2Config.line1 || side2Config.line2 || side2Config.line3) : !(side1Config.line1 || side1Config.line2 || side1Config.line3))
                          : !(side1Config.line1 || side1Config.line2 || side1Config.line3) || !(side2Config.line1 || side2Config.line2 || side2Config.line3)
                        )
                      }
                      className="flex-1 px-5 py-2.5 text-sm bg-btn-primary dark:bg-btn-primary-dark text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? "Submitting..." : "Continue to Review"}
                    </button>
                  </div>
                </div>
              </div>
            </form>

          </div>
        )}

        {/* Step 5: Review & Confirm */}
        {step === 5 && (orderType === "database" || orderType === "engrave") && (
          <div className="bg-white dark:bg-dark-surface rounded-xl shadow-card dark:shadow-card-dark p-6 border-2 border-light-border dark:border-dark-border">
            <h2 className="text-2xl font-bold mb-4 text-center text-light-text dark:text-dark-text">Review Your Design</h2>
            <p className="text-sm text-light-textMuted dark:text-dark-textMuted mb-6 text-center">
              Please review your tag design and information before proceeding to payment
            </p>

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
                qrCodeText={qrCodeText}
                selectedFont={selectedFont}
                textCase={textCase}
                onTextCaseChange={setTextCase}
              />
            </div>

            <div className="border-t border-light-border dark:border-dark-border pt-4 space-y-3">
              <h3 className="text-lg font-bold mb-4 text-light-text dark:text-dark-text">Order Summary</h3>

              <div className="bg-light-surface dark:bg-dark-surfaceLight border border-light-border dark:border-dark-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-light-textMuted dark:text-dark-textMuted font-medium">Tag Shape:</span>
                  <span className="font-bold text-light-text dark:text-dark-text">{selectedMaterial?.shapeName} - {selectedMaterial?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-textMuted dark:text-dark-textMuted font-medium">Order Type:</span>
                  <span className="font-bold text-light-text dark:text-dark-text">
                    {orderType === "database" ? "QR Code Tag" : "Text-Only Tag"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-textMuted dark:text-dark-textMuted font-medium">Side 1 Text:</span>
                  <span className="font-bold text-light-text dark:text-dark-text text-right">
                    {[side1Config.line1, side1Config.line2, side1Config.line3].filter(Boolean).join(' • ') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-textMuted dark:text-dark-textMuted font-medium">Side 2 Text:</span>
                  <span className="font-bold text-light-text dark:text-dark-text text-right">
                    {[side2Config.line1, side2Config.line2, side2Config.line3].filter(Boolean).join(' • ') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-textMuted dark:text-dark-textMuted font-medium">Font Style:</span>
                  <span className="font-bold text-light-text dark:text-dark-text">
                    {selectedFont ? AVAILABLE_FONTS.find(f => f.id === selectedFont)?.name || selectedFont : 'Default'}
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-light-border dark:border-dark-border">
                  <span className="text-light-text dark:text-dark-text font-semibold">Subtotal:</span>
                  <span className="font-bold text-light-primary dark:text-dark-primary">
                    ${selectedMaterial?.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Form - Contact Info & Address */}
            <div className="border-t border-light-border dark:border-dark-border pt-4 mt-4">
              <h3 className="text-lg font-bold mb-4 text-light-text dark:text-dark-text">Checkout Information</h3>
              <p className="text-sm text-light-textMuted dark:text-dark-textMuted mb-4">
                Please provide your contact information and shipping address
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); handleConfirmOrder(); }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={orderType === "database" ? qrForm.firstname : engraveForm.name?.split(" ")[0] || ""}
                      onChange={orderType === "database" ? handleQrFormChange : (e) => {
                        const firstname = e.target.value;
                        const lastname = engraveForm.name?.split(" ").slice(1).join(" ") || "";
                        setEngraveForm(prev => ({ ...prev, name: [firstname, lastname].filter(Boolean).join(" ") }));
                      }}
                      placeholder="John"
                      className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={orderType === "database" ? qrForm.lastname : engraveForm.name?.split(" ").slice(1).join(" ") || ""}
                      onChange={orderType === "database" ? handleQrFormChange : (e) => {
                        const firstname = engraveForm.name?.split(" ")[0] || "";
                        const lastname = e.target.value;
                        setEngraveForm(prev => ({ ...prev, name: [firstname, lastname].filter(Boolean).join(" ") }));
                      }}
                      placeholder="Doe"
                      className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={orderType === "database" ? qrForm.email : engraveForm.email}
                      onChange={orderType === "database" ? handleQrFormChange : handleEngraveChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderType === "database" ? qrForm.phone : engraveForm.phone}
                      onChange={orderType === "database" ? handleQrFormChange : handleEngraveChange}
                      placeholder="(555) 123-4567"
                      maxLength={14}
                      className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all text-light-text dark:text-dark-text ${
                        (orderType === "database" ? phoneErrors.qr : phoneErrors.engrave) ? 'border-red-500' : 'border-light-border dark:border-dark-border'
                      }`}
                      required
                    />
                    {(orderType === "database" ? phoneErrors.qr : phoneErrors.engrave) && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">{orderType === "database" ? phoneErrors.qr : phoneErrors.engrave}</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-light-border dark:border-dark-border">
                  <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-3">
                    Shipping Address
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address_line_1"
                        value={orderType === "database" ? qrForm.address_line_1 : engraveForm.address_line_1}
                        onChange={orderType === "database" ? handleQrFormChange : handleEngraveChange}
                        placeholder="123 Main St"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                          Apt/Unit
                        </label>
                        <input
                          type="text"
                          name="address_line_2"
                          value={orderType === "database" ? qrForm.address_line_2 : engraveForm.address_line_2}
                          onChange={orderType === "database" ? handleQrFormChange : handleEngraveChange}
                          placeholder="Apt 4B"
                          className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                          Additional Info
                        </label>
                        <input
                          type="text"
                          name="address_line_3"
                          value={orderType === "database" ? qrForm.address_line_3 : engraveForm.address_line_3}
                          onChange={orderType === "database" ? handleQrFormChange : handleEngraveChange}
                          placeholder="City, State, ZIP"
                          className="w-full px-4 py-2.5 text-sm bg-white dark:bg-dark-surfaceLight border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text rounded-lg focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:border-light-primary dark:focus:border-dark-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mt-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-6 mt-6 border-t border-light-border dark:border-dark-border">
              <button
                type="button"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("step", "4");
                  setSearchParams(newParams);
                  setStep(4);
                }}
                className="flex-1 px-5 py-2.5 text-sm border-2 border-light-border dark:border-dark-border rounded-lg font-semibold text-light-text dark:text-dark-text bg-white dark:bg-dark-surface hover:bg-light-surface dark:hover:bg-dark-surfaceHover transition-all"
              >
                Back to Edit
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="flex-1 px-5 py-2.5 text-sm bg-btn-primary dark:bg-btn-primary-dark text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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