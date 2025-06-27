import nodemailer from 'nodemailer'

interface OrderData {
  order: {
    id: string
    createdAt: string
    total: number
    currency: string
    status: string
  }
  user: {
    name: string
  }
}

interface UserData {
  name: string
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(emailData: EmailData) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Email templates
export function getOrderConfirmationEmail(orderData: OrderData) {
  const { order, user } = orderData
  
  return {
    subject: `Order Confirmation - Order #${order.id.slice(0, 8)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Order Confirmation</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${user.name},</p>
          
          <p>Thank you for your order! We're excited to confirm that your order has been received and is being processed.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}...</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ${order.currency} ${order.total.toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <p>We'll send you another email once your order ships with tracking information.</p>
          
          <p>If you have any questions about your order, please don't hesitate to contact our customer support team.</p>
          
          <p>Best regards,<br>Your E-commerce Team</p>
        </div>
      </div>
    `,
    text: `
      Order Confirmation - Order #${order.id.slice(0, 8)}
      
      Dear ${user.name},
      
      Thank you for your order! We're excited to confirm that your order has been received and is being processed.
      
      Order Details:
      - Order ID: ${order.id.slice(0, 8)}...
      - Order Date: ${new Date(order.createdAt).toLocaleDateString()}
      - Total Amount: ${order.currency} ${order.total.toFixed(2)}
      - Status: ${order.status}
      
      We'll send you another email once your order ships with tracking information.
      
      If you have any questions about your order, please don't hesitate to contact our customer support team.
      
      Best regards,
      Your E-commerce Team
    `
  }
}

export function getPasswordResetEmail(userData: UserData, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`
  
  return {
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Password Reset</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${userData.name},</p>
          
          <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
          
          <p>To reset your password, click the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
          
          <p>This link will expire in 1 hour for security reasons.</p>
          
          <p>If you have any questions, please contact our support team.</p>
          
          <p>Best regards,<br>Your E-commerce Team</p>
        </div>
      </div>
    `,
    text: `
      Password Reset Request
      
      Dear ${userData.name},
      
      We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
      
      To reset your password, visit this link:
      ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you have any questions, please contact our support team.
      
      Best regards,
      Your E-commerce Team
    `
  }
}

export function getWelcomeEmail(userData: UserData) {
  return {
    subject: 'Welcome to Our E-commerce Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">Welcome!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${userData.name},</p>
          
          <p>Welcome to our e-commerce platform! We're thrilled to have you as a member of our community.</p>
          
          <p>Here's what you can do with your new account:</p>
          <ul>
            <li>Browse our extensive product catalog</li>
            <li>Save items to your wishlist</li>
            <li>Track your orders</li>
            <li>Write product reviews</li>
            <li>Enjoy exclusive member benefits</li>
          </ul>
          
          <p>Start exploring our products today!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/products" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Shopping
            </a>
          </div>
          
          <p>If you have any questions or need assistance, our customer support team is here to help.</p>
          
          <p>Best regards,<br>Your E-commerce Team</p>
        </div>
      </div>
    `,
    text: `
      Welcome to Our E-commerce Platform!
      
      Dear ${userData.name},
      
      Welcome to our e-commerce platform! We're thrilled to have you as a member of our community.
      
      Here's what you can do with your new account:
      - Browse our extensive product catalog
      - Save items to your wishlist
      - Track your orders
      - Write product reviews
      - Enjoy exclusive member benefits
      
      Start exploring our products today!
      
      If you have any questions or need assistance, our customer support team is here to help.
      
      Best regards,
      Your E-commerce Team
    `
  }
} 