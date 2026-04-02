/**
 * Email Service Configuration
 * SendGrid and Nodemailer setup
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

/**
 * Initialize email transporter
 */
const initializeEmailService = () => {
  const emailService = process.env.EMAIL_SERVICE || 'sendgrid';

  if (emailService === 'sendgrid') {
    // SendGrid configuration
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else if (emailService === 'smtp') {
    // Generic SMTP configuration
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  logger.info(`Email service initialized: ${emailService}`);
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {String} options.to - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.html - HTML content
 * @param {String} options.text - Plain text content
 * @param {Array} options.attachments - Attachments
 * @returns {Promise<Object>} Send result
 */
const sendEmail = async (options) => {
  if (!transporter) {
    initializeEmailService();
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Trivaro Prop Firm'}" <${process.env.EMAIL_FROM || 'noreply@trivaro.com'}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments || []
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email
 * @param {String} email - User email
 * @param {String} name - User name
 */
const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0A1628;">Welcome to Trivaro Prop Firm!</h1>
      <p>Dear ${name},</p>
      <p>Thank you for joining Trivaro Prop Firm. We're excited to have you on board!</p>
      <p>Get started by exploring our trading challenges and finding the perfect account size for you.</p>
      <p>Best regards,<br>The Trivaro Team</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: 'Welcome to Trivaro Prop Firm!',
    html
  });
};

/**
 * Send credentials email
 * @param {String} email - User email
 * @param {Object} credentials - Trading account credentials
 * @param {Number} accountSize - Account size
 * @param {String} phase - Challenge phase
 */
const sendCredentialsEmail = async (email, credentials, accountSize, phase) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0A1628;">Your Trading Account Credentials</h1>
      <p>Congratulations! Your ${'$'}${accountSize.toLocaleString()} Phase ${phase} challenge account is ready.</p>
      
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0A1628; margin-top: 0;">Account Details</h3>
        <p><strong>Platform:</strong> ${credentials.platform}</p>
        <p><strong>Login:</strong> ${credentials.login}</p>
        <p><strong>Password:</strong> ${credentials.password}</p>
        <p><strong>Server:</strong> ${credentials.server}</p>
      </div>
      
      <p style="color: #FF3B57;"><strong>Important:</strong> Please save these credentials securely. Do not share them with anyone.</p>
      
      <p>Good luck with your trading!</p>
      <p>Best regards,<br>The Trivaro Team</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: `Your Phase ${phase} Challenge Account Credentials`,
    html
  });
};

/**
 * Send rule violation email
 * @param {String} email - User email
 * @param {Object} challenge - Challenge details
 * @param {Array} violations - List of violations
 */
const sendRuleViolationEmail = async (email, challenge, violations) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF3B57;">Rule Violation Notice</h1>
      <p>We regret to inform you that your challenge account has violated one or more trading rules.</p>
      
      <div style="background-color: #fff3f3; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF3B57;">
        <h3 style="color: #FF3B57; margin-top: 0;">Violations</h3>
        <ul>
          ${violations.map(v => `<li>${v.message}</li>`).join('')}
        </ul>
      </div>
      
      <p><strong>Account:</strong> ${challenge.mt4Login}</p>
      <p><strong>Phase:</strong> ${challenge.phase}</p>
      <p><strong>Status:</strong> Failed</p>
      
      <p>Your account is scheduled for deletion in 3 days. You may have the option to retry the challenge.</p>
      
      <p>If you believe this is an error, please contact our support team.</p>
      <p>Best regards,<br>The Trivaro Team</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: 'Trading Rule Violation Notice',
    html
  });
};

/**
 * Send phase completion email
 * @param {String} email - User email
 * @param {Object} challenge - Challenge details
 */
const sendPhaseCompletionEmail = async (email, challenge) => {
  const isFunded = challenge.phase === 3;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #00FF88;">🎉 Congratulations!</h1>
      <p>You have successfully completed Phase ${challenge.phase - 1} of your challenge!</p>
      
      <div style="background-color: #f0fff4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00FF88;">
        <h3 style="color: #00FF88; margin-top: 0;">${isFunded ? 'You Are Now a Funded Trader!' : `Phase ${challenge.phase} Credentials`}</h3>
        ${isFunded 
          ? '<p>Welcome to the funded trader program! You can now earn real profits from your trading.</p>'
          : `<p>Your next phase account credentials will be sent shortly.</p>`
        }
      </div>
      
      <p>Keep up the great work!</p>
      <p>Best regards,<br>The Trivaro Team</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: isFunded ? 'Welcome to the Funded Trader Program!' : `Phase ${challenge.phase} Account Activated`,
    html
  });
};

/**
 * Send payout confirmation email
 * @param {String} email - User email
 * @param {Object} payout - Payout details
 */
const sendPayoutEmail = async (email, payout) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #00FF88;">Payout Processed</h1>
      <p>Your payout has been successfully processed!</p>
      
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Amount:</strong> $${payout.approvedAmount.toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${payout.paymentMethod}</p>
        <p><strong>Status:</strong> ${payout.status}</p>
        <p><strong>Date:</strong> ${new Date(payout.paymentDate).toLocaleDateString()}</p>
      </div>
      
      <p>Thank you for your excellent trading performance!</p>
      <p>Best regards,<br>The Trivaro Team</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: 'Payout Processed Successfully',
    html
  });
};

module.exports = {
  initializeEmailService,
  sendEmail,
  sendWelcomeEmail,
  sendCredentialsEmail,
  sendRuleViolationEmail,
  sendPhaseCompletionEmail,
  sendPayoutEmail
};
