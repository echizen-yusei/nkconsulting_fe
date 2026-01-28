import React from "react";

const FontDemo = () => {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Font Demo - Noto JP</h1>

      {/* Default font (Noto Sans JP) */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Default Font (Noto Sans JP)
        </h2>
        <p className="text-gray-700">
          これはデフォルトフォント（Noto Sans
          JP）です。すべての要素に自動的に適用されます。
        </p>
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          ボタン (Button)
        </button>
      </div>

      {/* Noto Sans JP - Explicit */}
      <div className="font-noto-sans-jp">
        <h2 className="text-xl font-semibold mb-2">Noto Sans JP (Explicit)</h2>
        <p className="text-gray-700">
          これは明示的にNoto Sans JPを指定した例です。
        </p>
        <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
          ボタン (Button)
        </button>
      </div>

      {/* Noto Serif JP - Thích hợp cho nội dung, articles */}
      <div className="font-noto-serif-jp">
        <h2 className="text-xl font-semibold mb-2">
          Noto Serif JP (Content Font)
        </h2>
        <p className="text-gray-700">
          これはNoto Serif
          JPフォントです。記事、ブログ、長文のコンテンツに適しています。
        </p>
        <article className="mt-2 p-4 bg-gray-50 rounded">
          <h3 className="font-bold mb-2">記事のタイトル</h3>
          <p>
            このフォントは読みやすく、長い文章を読むのに適しています。
            日本語の文章に最適化されており、美しい文字の表示が可能です。
          </p>
        </article>
      </div>

      {/* Mixed usage */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Mixed Usage</h2>
        <div className="font-noto-sans-jp">
          <p className="text-sm text-gray-600 mb-2">UI要素 (Sans)</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-200 rounded text-sm">
              タグ1
            </button>
            <button className="px-3 py-1 bg-gray-200 rounded text-sm">
              タグ2
            </button>
          </div>
        </div>

        <div className="font-noto-serif-jp mt-4">
          <p className="text-sm text-gray-600 mb-2">コンテンツ (Serif)</p>
          <p className="text-sm">
            この部分は記事の内容として、読みやすいSerifフォントを使用しています。
          </p>
        </div>
      </div>
    </div>
  );
};

export default FontDemo;
