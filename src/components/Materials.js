function MaterialSelector() {
  const materials = [
    { id: 1, name: "Stainless Steel", color: "silver", imageUrl: "/materials/steel.jpg", price: "$15" },
    { id: 2, name: "Aluminum", color: "light-gray", imageUrl: "/materials/aluminum.jpg", price: "$12" },
    { id: 3, name: "Wood", color: "brown", imageUrl: "/materials/wood.jpg", price: "$10" },
    { id: 4, name: "Brass", color: "gold", imageUrl: "/materials/brass.jpg", price: "$18" },
    { id: 5, name: "Silicone", color: "blue", imageUrl: "/materials/silicone.jpg", price: "$8" },
    { id: 6, name: "Leather", color: "brown", imageUrl: "/materials/leather.jpg", price: "$20" }
  ];

  const [selectedMaterial, setSelectedMaterial] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Select Tag Material</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedMaterial === material.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedMaterial(material.id)}
          >
            <div className="flex items-center mb-3">
              <div className="w-16 h-16 mr-4 bg-gray-200 rounded-md overflow-hidden">
                <img src={material.imageUrl} alt={material.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{material.name}</h3>
                <p className="text-gray-600">{material.price}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Perfect for durability and a premium look.</p>
          </div>
        ))}
      </div>
    </div>
  );
}