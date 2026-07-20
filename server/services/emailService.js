import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const EMAIL_FROM = process.env.EMAIL_FROM || 'Velora <onboarding@resend.dev>';

const STATUS_CONFIG = {
  pending: {
    emoji: '✅',
    label: 'Order Placed',
    subject: (id) => `✅ Order Confirmed – #${id}`,
    headline: 'Your order has been placed!',
    message: 'Thank you for shopping with Velora! We have received your order and it is being processed. You will receive another update once it is picked and packed.',
    color: '#8B5E3C',
    badge: '#FFF7ED',
  },
  packed: {
    emoji: '📦',
    label: 'Picked & Packed',
    subject: (id) => `📦 Order Picked & Packed – #${id}`,
    headline: 'Your order is packed & ready!',
    message: 'Great news! Your order has been carefully picked and packed by our team. It will be handed over to our delivery partner very soon.',
    color: '#2563eb',
    badge: '#EFF6FF',
  },
  shipped: {
    emoji: '🚚',
    label: 'Shipped',
    subject: (id) => `🚚 Order Shipped – #${id}`,
    headline: 'Your order is on its way!',
    message: 'Your order has been shipped and is on its way to you. Use the tracking number below to follow your shipment in real time.',
    color: '#7c3aed',
    badge: '#F5F3FF',
  },
  out_for_delivery: {
    emoji: '🛵',
    label: 'Out for Delivery',
    subject: (id) => `🛵 Out for Delivery – #${id}`,
    headline: 'Your order is out for delivery!',
    message: 'Exciting! Your order is with our delivery partner and will reach you today. Please keep your phone handy.',
    color: '#d97706',
    badge: '#FFFBEB',
  },
  delivered: {
    emoji: '🎉',
    label: 'Delivered',
    subject: (id) => `🎉 Order Delivered – #${id}`,
    headline: 'Your order has been delivered!',
    message: 'Your order has been successfully delivered. We hope you love your purchase! If you have any issues, please contact our support team.',
    color: '#059669',
    badge: '#ECFDF5',
  },
};

function buildEmailHtml({ orderId, customerName, status, trackingNumber, items = [], totalAmount }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;

  const itemsRows = items.length > 0
    ? items.map(item => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #F5F1E8;font-size:14px;color:#2F2F2F;">
            ${item.product_name || item.name || 'Product'}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #F5F1E8;font-size:14px;color:#2F2F2F;text-align:center;">
            ×${item.quantity}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #F5F1E8;font-size:14px;color:#2F2F2F;text-align:right;">
            ₹${parseFloat(item.total_price || item.unit_price * item.quantity || 0).toFixed(2)}
          </td>
        </tr>
      `).join('')
    : '';

  const trackingSection = trackingNumber ? `
    <div style="background:#F5F1E8;border-radius:8px;padding:14px 18px;margin:20px 0;">
      <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#7A756B;font-weight:700;">Tracking Number</p>
      <p style="margin:6px 0 0;font-size:18px;font-weight:800;color:#2F2F2F;letter-spacing:0.05em;">${trackingNumber}</p>
    </div>
  ` : '';

  const itemsSection = itemsRows ? `
    <h3 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7A756B;margin:28px 0 12px;">Order Summary</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th style="padding:8px 0;border-bottom:2px solid #2F2F2F;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#7A756B;text-align:left;">Item</th>
          <th style="padding:8px 0;border-bottom:2px solid #2F2F2F;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#7A756B;text-align:center;">Qty</th>
          <th style="padding:8px 0;border-bottom:2px solid #2F2F2F;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#7A756B;text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>
    ${totalAmount ? `
      <div style="text-align:right;margin-top:12px;">
        <span style="font-size:16px;font-weight:800;color:#2F2F2F;">Total: ₹${parseFloat(totalAmount).toFixed(2)}</span>
      </div>
    ` : ''}
  ` : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${cfg.subject(orderId)}</title>
</head>
<body style="margin:0;padding:0;background:#F5F1E8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1E8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FAF8F3;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(47,47,47,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${cfg.color};padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:42px;line-height:1;">${cfg.emoji}</p>
              <h1 style="margin:12px 0 4px;font-size:24px;font-weight:800;color:#FAF8F3;letter-spacing:0.02em;">VELORA</h1>
              <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:rgba(250,248,243,0.7);">SIMPLE · SMART · SHOPPING</p>
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td style="padding:0 40px;">
              <div style="background:${cfg.badge};border:2px solid ${cfg.color};border-radius:50px;display:inline-block;padding:6px 18px;margin:24px 0 0;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:${cfg.color};">
                ${cfg.label}
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:16px 40px 32px;">
              <h2 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#2F2F2F;">${cfg.headline}</h2>
              <p style="margin:0 0 8px;font-size:15px;color:#7A756B;line-height:1.6;">Hi <strong style="color:#2F2F2F;">${customerName}</strong>,</p>
              <p style="margin:0 0 20px;font-size:15px;color:#7A756B;line-height:1.6;">${cfg.message}</p>

              <!-- Order ID -->
              <div style="background:#F5F1E8;border-left:4px solid ${cfg.color};border-radius:4px;padding:14px 18px;margin:0 0 20px;">
                <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#7A756B;font-weight:700;">Order ID</p>
                <p style="margin:6px 0 0;font-size:20px;font-weight:800;color:#2F2F2F;letter-spacing:0.05em;">#${orderId}</p>
              </div>

              ${trackingSection}
              ${itemsSection}
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="https://customer-iota-one.vercel.app/orders" style="display:inline-block;background:${cfg.color};color:#FAF8F3;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">
                View My Orders
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F5F1E8;padding:24px 40px;text-align:center;border-top:1px solid #E8E2D9;">
              <p style="margin:0 0 6px;font-size:12px;color:#7A756B;">Questions? Contact us at <a href="mailto:support@velora.shop" style="color:#8B5E3C;text-decoration:none;">support@velora.shop</a></p>
              <p style="margin:0;font-size:11px;color:#B5AFA8;">© ${new Date().getFullYear()} Velora. All rights reserved. Simple. Smart. Shopping.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send order status notification email.
 * @param {object} params
 * @param {string} params.orderId - The order ID
 * @param {string} params.customerEmail - Recipient email address
 * @param {string} params.customerName - Recipient's name
 * @param {string} params.status - New order status
 * @param {string|null} [params.trackingNumber] - Optional tracking number
 * @param {Array} [params.items] - Order line items
 * @param {number} [params.totalAmount] - Order total
 */
export async function sendOrderStatusEmail({ orderId, customerEmail, customerName, status, trackingNumber = null, items = [], totalAmount = null }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) {
    console.log(`[Email] No template for status "${status}", skipping.`);
    return;
  }

  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email send. (Order:', orderId, '| Status:', status, ')');
    return;
  }

  const html = buildEmailHtml({ orderId, customerName, status, trackingNumber, items, totalAmount });

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [customerEmail],
      subject: cfg.subject(orderId),
      html,
    });

    if (error) {
      console.error('[Email] Resend error:', error);
    } else {
      console.log(`[Email] Sent "${cfg.label}" email to ${customerEmail} (ID: ${data?.id})`);
    }
  } catch (err) {
    console.error('[Email] Failed to send email:', err.message);
  }
}

/**
 * Send Low Stock Warning Email to Admin/Seller
 */
export async function sendLowStockAlertEmail({ productName, stock, sku, recipientEmail }) {
  console.log(`[Email Alert] LOW STOCK ALERT for "${productName}" (SKU: ${sku}, Current Stock: ${stock}). Notifying ${recipientEmail || 'admin'}`);
  if (!resend || !recipientEmail) return;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: [recipientEmail],
      subject: `⚠️ Low Stock Warning: ${productName} (Qty: ${stock})`,
      html: `
        <div style="font-family:sans-serif;padding:20px;background:#FFFBEB;border:1px solid #FCD34D;border-radius:8px;">
          <h3 style="color:#B45309;margin-top:0;">⚠️ Inventory Alert</h3>
          <p>Product <strong>${productName}</strong> (SKU: ${sku}) has dropped to <strong>${stock}</strong> remaining units.</p>
          <p>Please restock soon to avoid stockouts.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('[Email] Low stock alert error:', err.message);
  }
}

