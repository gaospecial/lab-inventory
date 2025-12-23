'use client';

import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Printer } from 'lucide-react';

interface QRCodeLabelProps {
  value: string;
  label: string;
  subLabel?: string;
}

export default function QRCodeLabel({ value, label, subLabel }: QRCodeLabelProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('请允许弹出窗口以打印标签');
      return;
    }

    // Get the SVG content
    const svgContent = printContent.innerHTML;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Label - ${label}</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { margin: 0; }
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .label-container {
              border: 1px solid #000;
              padding: 10px;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              width: fit-content;
            }
            .qr-code {
              width: 100px;
              height: 100px;
              margin-bottom: 5px;
            }
            .qr-code svg {
              width: 100%;
              height: 100%;
            }
            .label-text {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 2px;
            }
            .sub-label-text {
              font-size: 10px;
              color: #000;
            }
          </style>
        </head>
        <body>
          <div class="label-container">
            <div class="qr-code">
              ${svgContent}
            </div>
            <div class="label-text">${label}</div>
            ${subLabel ? `<div class="sub-label-text">${subLabel}</div>` : ''}
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="mb-4 text-center">
        <div ref={printRef} className="bg-white p-2 inline-block">
          <QRCode
            value={value}
            size={128}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 256 256`}
          />
        </div>
        <p className="mt-2 font-bold text-gray-900">{label}</p>
        {subLabel && <p className="text-sm text-gray-500">{subLabel}</p>}
      </div>
      
      <button
        onClick={handlePrint}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Printer size={16} />
        <span>打印标签</span>
      </button>
    </div>
  );
}
