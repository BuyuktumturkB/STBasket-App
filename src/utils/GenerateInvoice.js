import RNHTMLtoPDF from 'react-native-html-to-pdf';

export const generateInvoicePdf = async (shoppingList, totalPrice, t) => {
  const date = new Date().toLocaleDateString('tr-TR');
  const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;

  const companyInfo = {
    name: 'Selfchart Teknoloji A.Ş.',
    address: 'Teknopark İstanbul, Pendik / İstanbul',
    taxOffice: 'Pendik Vergi Dairesi',
    taxNumber: '1234567890',
  };

  const productsHtml = shoppingList
    .map(item => {
      const quantity = item.quantity || 1;
      const baseUnitPrice = parseFloat(item.unitPrice || item.price || 0);
      const vatRate = parseFloat(item.vatRate || 20);

      const itemTotalBeforeVat = baseUnitPrice * quantity;
      const vatAmount = (itemTotalBeforeVat * vatRate) / 100;
      const itemTotalWithVat = itemTotalBeforeVat + vatAmount;

      return `
        <tr>
          <td>${item.name}</td>
          <td>${quantity}</td>
          <td>${baseUnitPrice.toFixed(2)}</td>
          <td>${vatRate}</td>
          <td>${vatAmount.toFixed(2)}</td>
          <td>${itemTotalWithVat.toFixed(2)}</td>
        </tr>
      `;
    })
    .join('');

  const formattedTotalPrice =
    typeof totalPrice === 'number' ? totalPrice.toFixed(2) + ' TL' : '0.00 TL';

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; color: #000; }
          .header { text-align: center; margin-bottom: 10px; }
          .header h1 { margin-bottom: 0; }
          .header p { margin-top: 0; font-size: 10px; }
          .info-table { width: 100%; margin-top: 20px; }
          .info-table td { padding: 4px; vertical-align: top; }
          table.products { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table.products th, table.products td { border: 1px solid #000; padding: 6px; text-align: left; }
          table.summary { width: 100%; margin-top: 10px; }
          .right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${t('invoice')}</h1>
          <p>T.C. Gelir İdaresi Başkanlığı'na uygun görsel fatura</p>
        </div>

        <table class="info-table">
          <tr>
            <td>
              <strong>Fatura No:</strong> ${invoiceNo}<br />
              <strong>${t('date')}:</strong> ${date}<br />
              <strong>${t('companyName')}:</strong> ${companyInfo.name}<br />
              <strong>${t('companyAddress')}:</strong> ${companyInfo.address}<br />
              <strong>${t('taxOffice')}:</strong> ${companyInfo.taxOffice}<br />
              <strong>Vergi No:</strong> ${companyInfo.taxNumber}
            </td>
          </tr>
        </table>

        <table class="products">
          <thead>
            <tr>
              <th>${t('product')}</th>
              <th>${t('quantity')}</th>
              <th>${t('unitPrice')}</th>
              <th>KDV %</th>
              <th>KDV Tutarı</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
        </table>

        <table class="summary">
          <tr>
            <td class="right"><strong>Genel Toplam (KDV dahil):</strong> ${formattedTotalPrice}</td>
          </tr>
        </table>

        <p style="margin-top: 20px; font-size: 10px;">
          Bu belge e-fatura yerine geçmez, sadece bilgilendirme amaçlıdır.
        </p>
      </body>
    </html>
  `;

  const options = {
    html: htmlContent,
    fileName: `gib_invoice_${Date.now()}`,
    directory: 'Documents',
  };

  const file = await RNHTMLtoPDF.convert(options);
  return file.filePath;
};
