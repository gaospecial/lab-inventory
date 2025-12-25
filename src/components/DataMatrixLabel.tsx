'use client';

import { useEffect, useRef, useState } from 'react';
import bwipjs from 'bwip-js';
import { Printer } from 'lucide-react';

interface DataMatrixLabelProps {
  value: string;
  label: string;
  subLabel?: string;
  latinName?: string;
  isolatedBy?: string;
  collectionDate?: string;
  type?: 'strain' | 'box';
}

export default function DataMatrixLabel({ 
  value, 
  label, 
  subLabel, 
  latinName, 
  isolatedBy, 
  collectionDate, 
  type = 'strain' 
}: DataMatrixLabelProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    try {
      // @ts-ignore: bwip-js types are missing toSVG definition
      const svg = (bwipjs as any).toSVG({
        bcid: 'datamatrix',
        text: value,
        scale: 5,
        includetext: false,
        padding: 5,
        backgroundcolor: 'ffffff',
      });
      setSvgContent(svg);
    } catch (e) {
      console.error('Error generating Data Matrix:', e);
    }
  }, [value]);

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

    let printBody = '';

    if (type === 'strain') {
      // Strain: Rectangular (Tube) + Circular (Cap)
      printBody = `
        <div class="print-page">
          <!-- Rectangular Label for Tube Wall -->
          <div class="label-rect">
            <div class="qr-code-rect">${svgHtml}</div>
            <div class="info-rect">
              <div class="label-latin">${latinName || ''}</div>
              <div class="label-main">${label}</div>
              <div class="label-meta">
                 ${isolatedBy ? `<span>${isolatedBy}</span>` : ''}
                 ${(isolatedBy && collectionDate) ? `<span class="separator">|</span>` : ''}
                 ${collectionDate ? `<span>${collectionDate}</span>` : ''}
              </div>
            </div>
          </div>

          <!-- Circular Label for Tube Cap -->
          <div class="label-circle">
            <div class="circle-content">
              <div class="circle-qr">${svgHtml}</div>
              <div class="circle-text">${label.replace(/^MGSC\s+/, '')}</div>
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
              <div class="box-title">${label}</div>
              <div class="box-sub">${subLabel || ''}</div>
            </div>
          </div>
        </div>
      `;
    }

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
            .label-rect {
              width: 40mm;
              height: 15mm;
              border: 1px dashed #eee; 
              display: flex;
              align-items: center;
              padding: 1mm;
              box-sizing: border-box;
              page-break-inside: avoid;
              font-family: Arial, sans-serif;
            }
            .qr-code-rect {
              width: 10mm;
              height: 10mm;
              flex-shrink: 0;
              margin-right: 2px;
            }
            .qr-code-rect svg {
              width: 100%;
              height: 100%;
            }
            .info-rect {
              flex: 1;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: center;
              line-height: 1;
            }
            .label-main {
              font-weight: bold;
              font-size: 8pt;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .label-latin {
              font-size: 7pt;
              font-style: italic;
              font-weight: bold;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-bottom: 1px;
            }
            .label-meta {
              font-size: 5pt;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #333;
            }
            .separator {
              margin: 0 1px;
              color: #ccc;
            }

            /* Strain Circular Label (Cap) */
            .label-circle {
              width: 13mm;
              height: 13mm;
              border: 1px dashed #eee;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              page-break-inside: avoid;
              margin-top: 5mm;
              font-family: Arial, sans-serif;
            }
            .circle-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
            }
            .circle-qr {
              width: 5mm;
              height: 5mm;
              margin-bottom: 0.2mm;
            }
            .circle-qr svg {
              width: 100%;
              height: 100%;
            }
            .circle-text {
              font-size: 4pt;
              font-weight: bold;
              line-height: 1;
              white-space: nowrap;
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
      <div className="mb-2 text-center">
        <div ref={printRef} className="bg-white p-1 inline-block">
          <div 
            dangerouslySetInnerHTML={{ __html: svgContent }} 
            className="w-24 h-24 flex items-center justify-center"
          />
        </div>
        <p className="mt-1 font-bold text-gray-900 leading-tight">{label}</p>
        {subLabel && <p className="text-sm text-gray-500 leading-tight">{subLabel}</p>}
        <p className="text-xs text-gray-400 mt-1 uppercase">{type === 'box' ? '盒子标签' : '菌株标签'}</p>
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
