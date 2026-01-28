import React from "react";

const SpacingGuide = () => {
  const spacingItems = [
    {
      value: "4px",
      description: "Smallest spacing for elements",
      className: "h-1",
    },
    {
      value: "8px",
      description: "Small spacing for elements",
      className: "h-2",
    },
    {
      value: "16px",
      description: "Small spacing for elements",
      className: "h-4",
    },
    {
      value: "24px",
      description: "Spacing for small cards padding",
      className: "h-6",
    },
    {
      value: "32px",
      description: "Spacing for medium cards padding",
      className: "h-8",
    },
    {
      value: "48px",
      description: "Large spacing for components",
      className: "h-12",
    },
    {
      value: "64px",
      description: "Spacing between section title and component group",
      className: "h-16",
    },
    {
      value: "120px",
      description: "Spacing between sections",
      className: "h-30",
    },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Spacing Guide</h1>

      <div className="space-y-6">
        {spacingItems.map((item, index) => (
          <div key={index} className="flex items-center gap-6">
            <div className="w-16 text-right font-mono text-sm">
              {item.value}
            </div>
            <div
              className={`w-full bg-red-primary ${item.className} rounded`}
            ></div>
            <div className="w-80 text-sm text-gray-600">{item.description}</div>
          </div>
        ))}
      </div>

      {/* Usage Examples */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Usage Examples</h2>

        <div className="space-y-8">
          {/* Small spacing example */}
          <div className="p-6 bg-gray-lighter rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Small Spacing (4px, 8px, 16px)
            </h3>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-red-primary rounded"></div>
              <div className="w-4 h-4 bg-red-primary rounded"></div>
              <div className="w-4 h-4 bg-red-primary rounded"></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Elements with 4px spacing
            </p>
          </div>

          {/* Medium spacing example */}
          <div className="p-6 bg-gray-lighter rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Medium Spacing (24px, 32px)
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded border">
                <h4 className="font-medium mb-2">Small Card</h4>
                <p className="text-sm text-gray-600">24px padding</p>
              </div>
              <div className="p-8 bg-white rounded border">
                <h4 className="font-medium mb-2">Medium Card</h4>
                <p className="text-sm text-gray-600">32px padding</p>
              </div>
            </div>
          </div>

          {/* Large spacing example */}
          <div className="p-6 bg-gray-lighter rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Large Spacing (48px, 64px, 120px)
            </h3>
            <div className="space-y-12">
              <div>
                <h4 className="text-lg font-semibold mb-4">Section Title</h4>
                <div className="p-6 bg-white rounded border">
                  <p>Component group with 64px spacing from title</p>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Another Section</h4>
                <div className="p-6 bg-white rounded border">
                  <p>
                    Another component group with 120px spacing between sections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacingGuide;
