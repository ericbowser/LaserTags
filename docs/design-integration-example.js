// Integration Example: Adding Custom Design Selection to MaterialSelection.js
// This shows how to integrate the TagDesignSelector with your existing flow

/*
STEP 1: Add these imports to your MaterialSelection.js:
*/
import TagDesignSelector from './TagDesignSelector';
import EnhancedTagPreview from './EnhancedTagPreview';
// Keep your existing TagPreview import as backup:
// import TagPreview from './TagPreview'; 

/*
STEP 2: Add design selection state to your MaterialSelection component:
Add these state variables to your existing useState declarations:
*/
const [selectedDesign, setSelectedDesign] = useState(null);
const [showDesignSelector, setShowDesignSelector] = useState(false);

/*
STEP 3: Add a design selection step to your form flow:
After material selection but before the final form, add:
*/

{/* Design Selection Step - Add this after material selection */}
{selectedMaterial && (
  <div className="mt-8">
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          Choose Your Tag Design
        </h2>
        <button
          onClick={() => setShowDesignSelector(!showDesignSelector)}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          {showDesignSelector ? 'Use Default Design' : 'Browse Custom Designs'}
        </button>
      </div>
      
      {/* Show design selector or default design info */}
      {showDesignSelector ? (
        <TagDesignSelector
          material={selectedMaterial}
          shape={selectedMaterial.shape}
          selectedDesign={selectedDesign}
          onDesignSelect={setSelectedDesign}
        />
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">Using default design</p>
          <p className="text-sm text-gray-500">
            Clean, simple text layout perfect for laser engraving
          </p>
          <button
            onClick={() => setShowDesignSelector(true)}
            className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Browse Custom Designs →
          </button>
        </div>
      )}
    </div>
  </div>
)}

/*
STEP 4: Update your TagPreview usage:
Replace your existing TagPreview with EnhancedTagPreview:
*/

{/* Replace existing TagPreview with this: */}
<EnhancedTagPreview
  material={selectedMaterial}
  orderType={orderType}
  formData={{
    petname: petName,
    userid: userid // for QR code generation
  }}
  qrCodePosition={qrCodePosition}
  onQrPositionChange={setQrCodePosition}
  side1Config={{
    petName: petName,
    fontType: selectedDesign?.id || 'classic' // Use design preset
  }}
  side2Config={{
    line1: orderType === 'engrave' ? tagTextLine1 : '',
    line2: orderType === 'engrave' ? tagTextLine2 : '',
    line3: orderType === 'engrave' ? tagTextLine3 : '',
    addressText: `${address1 || ''} ${address2 || ''}`.trim()
  }}
  qrCodeSide={2}
  selectedDesign={selectedDesign} // Pass the selected design preset
  className="sticky top-4" // Keep it visible while scrolling
/>

/*
STEP 5: Include design info in order creation:
Update your createOrder API call to include design information:
*/
const orderData = {
  contactid: createdContact.id,
  stripe_payment_intent_id: null,
  status: "pending",
  amount: totalAmount,
  currency: 'usd',
  tag_text_line_1: orderType === 'engrave' ? tagTextLine1 : null,
  tag_text_line_2: orderType === 'engrave' ? tagTextLine2 : null,
  tag_text_line_3: orderType === 'engrave' ? tagTextLine3 : null,
  has_qr_code: orderType === 'database',
  // NEW: Add design information
  design_preset: selectedDesign?.id || 'default',
  design_name: selectedDesign?.name || 'Default',
  qr_code_position_x: qrCodePosition.x,
  qr_code_position_y: qrCodePosition.y
};

/*
STEP 6: Optional Database Changes:
Add design tracking columns to your orders table:
*/
/*
SQL to add design tracking:

ALTER TABLE lasertg.orders ADD COLUMN design_preset VARCHAR(50) DEFAULT 'default';
ALTER TABLE lasertg.orders ADD COLUMN design_name VARCHAR(100) DEFAULT 'Default';
ALTER TABLE lasertg.orders ADD COLUMN qr_code_position_x DECIMAL(5,2) DEFAULT 50.0;
ALTER TABLE lasertg.orders ADD COLUMN qr_code_position_y DECIMAL(5,2) DEFAULT 50.0;

CREATE INDEX idx_orders_design_preset ON lasertg.orders(design_preset);
*/

/*
STEP 7: Enhanced Validation:
Add design-aware validation to your form:
*/
const validateDesign = () => {
  if (selectedDesign) {
    // Check text length based on design requirements
    const maxLineLength = selectedDesign.id === 'minimal' ? 15 : 
                         selectedDesign.id === 'bold' ? 12 : 25;
    
    if (tagTextLine1 && tagTextLine1.length > maxLineLength) {
      setErrors(prev => ({
        ...prev,
        tagTextLine1: `Line 1 too long for ${selectedDesign.name} design (max ${maxLineLength} chars)`
      }));
      return false;
    }
  }
  return true;
};

/*
PROGRESSIVE ENHANCEMENT APPROACH:
1. Deploy with design selector hidden by default (showDesignSelector = false)
2. Test with existing customers using default design
3. Gradually enable design selector for new customers
4. Add more preset designs based on customer feedback
5. Eventually add custom design builder

BENEFITS:
✅ Professional design options increase perceived value
✅ Differentiation from competitors
✅ Higher customer satisfaction
✅ Potential for premium pricing on designer presets
✅ Scalable system - easy to add new presets
✅ Backward compatible with existing orders
*/

export const integrationNotes = {
  // This file is for reference only
  deployment: "Test thoroughly before deploying to production",
  performance: "Design presets are lightweight and won't slow down the app",
  customization: "Easy to add new presets by editing tagDesignPresets.js"
};
