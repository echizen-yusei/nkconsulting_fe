import React from "react";

const ColorPalette = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Color Palette</h1>

      {/* Primary Colors */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Primary Color</h2>
        <p className="text-gray-600 mb-6">Background, Texts, Accent, Buttons</p>

        {/* Grayscale Row */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Grayscale</h3>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-black-custom rounded-lg border"></div>
              <p className="text-sm mt-2 font-mono">#1A1A1A</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-dark rounded-lg border"></div>
              <p className="text-sm mt-2 font-mono">#4D4D4D</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-medium rounded-lg border"></div>
              <p className="text-sm mt-2 font-mono">#808080</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-light rounded-lg border"></div>
              <p className="text-sm mt-2 font-mono">#B3B3B3</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-lighter rounded-lg border"></div>
              <p className="text-sm mt-2 font-mono">#E6E6E6</p>
            </div>
          </div>
        </div>

        {/* Red/Pink Row */}
        <div>
          <h3 className="text-lg font-medium mb-3">Red/Pink</h3>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-primary rounded-lg border"></div>
              <p className="text-sm mt-2 font-mono">#CF2E2E</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-secondary rounded-lg border"></div>
              <p className="text-sm mt-2 font-mono">#DA5858</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-light rounded-lg border"></div>
              <p className="text-sm mt-2 font-mono">#E38282</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-lighter rounded-lg border"></div>
              <p className="text-sm mt-2 font-mono">#ECACAC</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-lightest rounded-lg border"></div>
              <p className="text-sm mt-2 font-mono">#F6D5D5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Colors */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Secondary Color</h2>
        <p className="text-gray-600 mb-6">Accent, Texts</p>

        <div className="flex gap-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-gold rounded-lg border"></div>
            <p className="text-sm mt-2 font-mono">Gold</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-cream rounded-lg border"></div>
            <p className="text-sm mt-2 font-mono">#F2F2F2</p>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Usage Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-black-custom text-white rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Dark Background</h3>
            <p className="text-gray-lighter">
              Text on dark background using grayscale colors
            </p>
            <button className="mt-4 px-4 py-2 bg-red-primary text-white rounded">
              Primary Button
            </button>
          </div>

          <div className="p-6 bg-cream text-black-custom rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Light Background</h3>
            <p className="text-gray-dark">
              Text on light background using grayscale colors
            </p>
            <button className="mt-4 px-4 py-2 bg-red-primary text-white rounded">
              Primary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
