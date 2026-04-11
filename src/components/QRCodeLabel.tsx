'use client';

import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Printer } from 'lucide-react';
import { escapeHtml } from '@/lib/utils';

interface QRCodeLabelProps {
  value: string;
  label: string;
  subLabel?: string;
  type?: 'strain' | 'box';
}

export default function QRCodeLabel({ value, label, subLabel, type = 'strain' }: QRCodeLabelProps) {
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
    const svgElement = printContent.querySelector('svg');
    const svgHtml = svgElement ? svgElement.outerHTML : '';

    const safeLabel = escapeHtml(label);
    const safeSubLabel = escapeHtml(subLabel || '');

    let printBody = '';

    if (type === 'strain') {
      // Strain: Rectangular (Tube) + Circular (Cap)
      printBody = `
        <div class="print-page">
          <!-- Rectangular Label for Tube Wall (e.g., 30mm x 20mm or similar small size) -->
          <div class="label-rect">
            <div class="qr-code-rect">${svgHtml}</div>
            <div class="info-rect">
              <div class="label-main">${safeLabel}</div>
              <div class="label-sub">${safeSubLabel}</div>
            </div>
          </div>

          <!-- Circular Label for Tube Cap (e.g., 10mm-12mm diameter) -->
          <div class="label-circle">
            <div class="circle-content">
              <div class="circle-text">${safeLabel}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Box: Large Rectangular
      printBody = `
         <div class="print-page">
          <div class="label-box">
            <div class="qr-code-box">${svgHtml}</div>
            <div class="info-box">
              <div class="box-title">${safeLabel}</div>
              <div class="box-sub">${safeSubLabel}</div>
            </div>
          </div>
        </div>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Label - ${safeLabel}</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { margin: 0; }
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 20px;
            }
            
            .print-page {
              display: flex;
              flex-direction: column;
              gap: 20px;
              align-items: flex-start;
            }

            /* Strain Rectangular Label (Tube Wall) */
            /* Dimensions: approx 40mm x 15mm depending on paper, adjusted for CSS px */
            .label-rect {
              width: 150px; 
              height: 60px;
              border: 1px dashed #ccc; /* Dashed border for cutting guide if needed, or remove for thermal printer */
              display: flex;
              align-items: center;
              padding: 4px;
              box-sizing: border-box;
              page-break-inside: avoid;
            }
            .qr-code-rect {
              width: 50px;
              height: 50px;
              flex-shrink: 0;
            }
            .qr-code-rect svg {
              width: 100%;
              height: 100%;
            }
            .info-rect {
              margin-left: 8px;
              overflow: hidden;
            }
            .label-main {
              font-weight: bold;
              font-size: 14px;
              white-space: nowrap;
            }
            .label-sub {
              font-size: 10px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            /* Strain Circular Label (Cap) */
            /* Dimensions: approx 12mm diameter */
            .label-circle {
              width: 48px; /* ~12-13mm */
              height: 48px;
              border: 1px dashed #ccc;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              page-break-inside: avoid;
            }
            .circle-content {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .circle-text {
              font-size: 10px;
              font-weight: bold;
              line-height: 1;
              word-break: break-all;
            }

            /* Box Label (Large Rectangular) */
            .label-box {
              width: 300px;
              height: 150px;
              border: 2px solid #000;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 10px;
              box-sizing: border-box;
              text-align: center;
            }
            .qr-code-box {
              width: 80px;
              height: 80px;
              margin-bottom: 10px;
            }
            .qr-code-box svg {
              width: 100%;
              height: 100%;
            }
            .box-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .box-sub {
              font-size: 14px;
              color: #555;
            }

          </style>
        </head>
        <body>
          ${printBody}
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
        <p className="text-xs text-gray-400 mt-1 uppercase">{type === 'box' ? '盒子标签' : '菌株标签 (管壁+管盖)'}</p>
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
