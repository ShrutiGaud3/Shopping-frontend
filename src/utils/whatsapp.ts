import type { Product, CartItem, StitchOption } from '../types';

export const WHATSAPP_NUMBER = '919876543210'; // Store Whatsapp Contact Number

/**
 * Generates WhatsApp click-to-chat URL for ordering a single product
 */
export const getWhatsAppProductUrl = (
  product: Product,
  selectedSize: string = 'M',
  selectedColor: string = 'Default',
  customNumber?: string,
  stitchingOption?: StitchOption | null
): string => {
  const targetNumber = (customNumber || WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
  const productUrl = window.location.href;
  const itemPrice = product.price + (stitchingOption?.price || 0);
  const stitchingLine = stitchingOption
    ? `\n🧵 *Stitching Option:* ${stitchingOption.type} (+₹${stitchingOption.price})`
    : '';

  const message = `Hello Weavera Store! 👋\n\nI would like to order this item directly via WhatsApp:\n\n🛍️ *Product:* ${product.name}\n🏷️ *Brand:* ${product.brand}\n💰 *Price:* ₹${itemPrice.toLocaleString()}${stitchingLine}\n📏 *Size:* ${selectedSize}\n🎨 *Color:* ${selectedColor}\n🔗 *Link:* ${productUrl}\n\nPlease confirm availability and payment details. Thank you!`;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Generates WhatsApp click-to-chat URL for ordering all cart items
 */
export const getWhatsAppCartUrl = (cartItems: CartItem[], totalAmount: number, customNumber?: string): string => {
  const targetNumber = (customNumber || WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
  let itemsList = '';
  cartItems.forEach((item, index) => {
    const pName = item.product.name;
    const itemUnit = item.product.price + (item.selectedStitchOption?.price || 0);
    const stitchNote = item.selectedStitchOption ? ` [${item.selectedStitchOption.type}]` : '';
    itemsList += `${index + 1}. *${pName}* (Qty: ${item.quantity}, Size: ${item.selectedSize}, Color: ${item.selectedColor}${stitchNote}) - ₹${(itemUnit * item.quantity).toLocaleString()}\n`;
  });

  const message = `Hello Weavera Express Support! 🛍️\n\nI would like to place an order for my Shopping Bag items:\n\n${itemsList}\n💳 *Total Order Amount:* ₹${totalAmount.toLocaleString()}\n\nPlease verify my cart items and share order payment link!`;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Open WhatsApp URL in a new window/tab
 */
export const openWhatsApp = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
