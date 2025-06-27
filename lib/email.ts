import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface PasswordResetData {
  resetLink: string;
  customerName: string;
}

interface WelcomeData {
  customerName: string;
  loginLink: string;
}

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email function
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@yourstore.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

// Order confirmation email
export async function sendOrderConfirmationEmail(
  email: string, 
  data: OrderEmailData
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p>Dear ${data.customerName},</p>
      <p>Thank you for your order! Your order number is: <strong>${data.orderNumber}</strong></p>
      
      <h3>Order Summary:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Quantity</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${item.price.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="text-align: right; font-weight: bold; font-size: 18px;">
        Total: $${data.total.toFixed(2)}
      </div>
      
      <p>We'll send you a shipping confirmation once your order is on its way.</p>
      <p>Thank you for shopping with us!</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: `Order Confirmation - ${data.orderNumber}`,
    html,
  });
}

// Password reset email
export async function sendPasswordResetEmail(
  email: string, 
  data: PasswordResetData
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Dear ${data.customerName},</p>
      <p>We received a request to reset your password. Click the link below to create a new password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.resetLink}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p>Thank you!</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
  });
}

// Welcome email
export async function sendWelcomeEmail(
  email: string, 
  data: WelcomeData
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Our Store!</h2>
      <p>Dear ${data.customerName},</p>
      <p>Welcome to our e-commerce platform! We're excited to have you as a customer.</p>
      
      <p>Here are some things you can do to get started:</p>
      <ul>
        <li>Browse our product catalog</li>
        <li>Create a wishlist of your favorite items</li>
        <li>Set up your profile and preferences</li>
        <li>Explore our AR features</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.loginLink}" 
           style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Start Shopping
        </a>
      </div>
      
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Happy shopping!</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to Our Store!',
    html,
  });
} 