import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { type Order } from '@/hooks/use-orders';

function buildInvoiceHtml(order: Order, currency: string): string {
  const shortId = order.id.slice(0, 8).toUpperCase();
  const date = new Date(order.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fmt = (amount: number) => `${currency} ${amount.toFixed(2)}`;

  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td class="center">${item.quantity}</td>
        <td class="right">${fmt(item.price)}</td>
        <td class="right">${fmt(item.quantity * item.price)}</td>
      </tr>`
    )
    .join('');

  const notesRow = order.notes
    ? `<div class="section-label">NOTES</div>
       <div class="info">${order.notes}</div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; color: #111; padding: 48px 56px; font-size: 14px; }
    .header { margin-bottom: 32px; }
    .title { font-size: 32px; font-weight: bold; color: #0a7ea4; letter-spacing: 2px; }
    .meta { margin-top: 6px; color: #555; font-size: 13px; }
    .section-label {
      font-size: 11px; font-weight: bold; letter-spacing: 1.2px;
      color: #888; text-transform: uppercase; margin: 24px 0 6px;
    }
    .info { font-size: 14px; line-height: 1.6; color: #222; }
    .divider { border: none; border-top: 1px solid #e0e0e0; margin: 24px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 4px; }
    thead tr { background: #f5f5f5; }
    th {
      text-align: left; font-size: 11px; font-weight: bold;
      letter-spacing: 0.8px; color: #666; padding: 10px 8px;
      text-transform: uppercase;
    }
    th.right, td.right { text-align: right; }
    th.center, td.center { text-align: center; }
    td { padding: 10px 8px; border-bottom: 1px solid #f0f0f0; color: #222; }
    .total-row td {
      border-top: 2px solid #ddd; border-bottom: none;
      font-weight: bold; font-size: 15px; padding-top: 14px;
    }
    .total-row .amount { color: #0a7ea4; font-size: 17px; }
    .payment-row {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 14px; background: #f9f9f9;
      border-radius: 8px; border: 1px solid #e5e5e5;
    }
    .footer {
      margin-top: 48px; text-align: center;
      font-size: 12px; color: #aaa;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">INVOICE</div>
    <div class="meta">Order #${shortId} &nbsp;&middot;&nbsp; ${date}</div>
  </div>

  <hr class="divider" />

  <div class="section-label">Deliver To</div>
  <div class="info">${order.delivery_address}</div>

  ${notesRow}

  <hr class="divider" />

  <div class="section-label">Items</div>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th class="center">Qty</th>
        <th class="right">Unit Price</th>
        <th class="right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
      <tr class="total-row">
        <td colspan="3">Order Total</td>
        <td class="right amount">${fmt(order.total)}</td>
      </tr>
    </tbody>
  </table>

  <hr class="divider" />

  <div class="section-label">Payment Method</div>
  <div class="info">Cash on Delivery</div>

  <div class="footer">Thank you for your order!</div>
</body>
</html>`;
}

export async function shareInvoice(order: Order, currency = 'USD'): Promise<void> {
  const html = buildInvoiceHtml(order, currency);
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `Invoice #${order.id.slice(0, 8).toUpperCase()}`,
    UTI: 'com.adobe.pdf',
  });
}
