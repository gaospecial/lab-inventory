'use client';

export default function PrintButton() {
  return (
    <button 
      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
      onClick={() => window.print()}
    >
      打印标签
    </button>
  );
}
