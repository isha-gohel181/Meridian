import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { APP_DISPLAY_NAME, APP_TAGLINE } from "./appBrand.js";
dotenv.config();

/**
 * EmailService handles sending different types of emails from different sender addresses for the academy brand.
 * 
 * Transactional: process.env.TransactionalEmail / process.env.TransactionalEmailPass
 * Founder/Casual: process.env.FounderEmail / process.env.FounderEmailPass
 * Support: process.env.SupportEmail / process.env.SupportEmailPass
 */
class EmailService {
  constructor() {
    // Log environment variables for debugging (avoid logging passwords in production)
    //console.log("SMTP Configuration:", {
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: process.env.SMTP_SECURE,
    //   TransactionalEmail: process.env.TransactionalEmail,
    //   FounderEmail: process.env.FounderEmail,
    //   SupportEmail: process.env.SupportEmail,
    // });

    // Prepare transporters for each sender
    this.transporters = {
      transactional: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.TransactionalEmail,
          pass: process.env.TransactionalEmailPass,
        },
      }),
      founder: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.FounderEmail,
          pass: process.env.FounderEmailPass,
        },
      }),
      support: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SupportEmail,
          pass: process.env.SupportEmailPass,
        },
      }),
    };
  }

  /**
   * Helper to get the correct "from" field for each type of email.
   */
  getFrom(type = "transactional") {
    const appName = APP_DISPLAY_NAME;
    switch (type) {
      case "transactional":
        return `"${appName}" <${process.env.TransactionalEmail || "support@example.com"}>`;
      case "founder":
        return `"${appName}" <${process.env.FounderEmail || "support@example.com"}>`;
      case "support":
        return `"${appName} Support" <${process.env.SupportEmail || "support@example.com"}>`;
      default:
        return `"${appName}" <${process.env.TransactionalEmail || "support@example.com"}>`;
    }
  }

  /**
   * Helper to get the correct transporter for each type of email.
   */
  getTransporter(type = "transactional") {
    if (type === "transactional") return this.transporters.transactional;
    if (type === "founder") return this.transporters.founder;
    if (type === "support") return this.transporters.support;
    return this.transporters.transactional;
  }

  /**
   * Send OTP/verification email (Transactional)
   */
  async sendOtpEmail(email, otp, userName = 'User') {
    const mailOptions = {
      from: this.getFrom("transactional"),
      to: email,
      subject: `${APP_DISPLAY_NAME} - Your OTP for Verification`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification - ${APP_DISPLAY_NAME}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 30px 10px;">
                <table role="presentation" style="width: 100%; max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px 40px; text-align: center;">
                      <h1 style="color: #032746; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">${APP_DISPLAY_NAME.toUpperCase()}</h1>
                      <p style="color: #64748b; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">${APP_TAGLINE}</p>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 36px 40px; color: #334155;">
                      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5;">
                        Hello <strong style="color: #0f172a;">${userName}</strong>,
                      </p>
                      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                        Please use the following One-Time Password (OTP) to complete your verification on ${APP_DISPLAY_NAME}:
                      </p>
                      
                      <!-- OTP Box -->
                      <div style="background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #2563eb;">${otp}</span>
                        <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">Valid for 10 minutes</p>
                      </div>

                      <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                        If you didn't request this code, you can safely ignore this email or contact our support team.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                        This is an automated security message from <strong>${APP_DISPLAY_NAME}</strong>.<br>
                        Need help? Contact <a href="mailto:${process.env.SupportEmail || 'support@example.com'}" style="color: #2563eb; text-decoration: none;">${process.env.SupportEmail || 'support@example.com'}</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    try {
      const info = await this.getTransporter("transactional").sendMail(mailOptions);
      //console.log('✅ OTP email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  /**
   * Send password reset email (Transactional)
   */
  async sendPasswordResetEmail(email, resetToken, userName) {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"
      }/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: this.getFrom("transactional"),
      to: email,
      subject: `${APP_DISPLAY_NAME} - Password Reset`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - ${APP_DISPLAY_NAME}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 32px 12px;">
                <table role="presentation" style="width: 100%; max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15); border: 1px solid #e2e8f0;">
                  <tr>
                    <td style="padding: 32px 36px 24px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                      <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #032746; font-weight: 800;">${APP_DISPLAY_NAME}</p>
                      <h1 style="margin: 0; font-size: 28px; font-weight: 300; font-style: italic; color: #0f172a; font-family: Georgia, 'Times New Roman', serif;">Password reset</h1>
                      <p style="margin: 10px 0 0; font-size: 14px; color: #64748b;">${APP_TAGLINE}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 32px 36px; color: #334155;">
                      <p style="margin: 0 0 16px; font-size: 16px;">Hello <strong style="color: #0f172a;">${userName}</strong>,</p>
                      <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #475569;">
                        We received a request to reset the password for your ${APP_DISPLAY_NAME} account. Use the button below to choose a new password.
                      </p>
                      <table role="presentation" style="margin: 0 auto 28px;">
                        <tr>
                          <td style="text-align: center;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background-color: #032746; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;">
                              Reset password
                            </a>
                          </td>
                        </tr>
                      </table>
                      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                        <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">If the button does not work, copy this link:</p>
                        <p style="margin: 0; word-break: break-all; font-size: 13px;">
                          <a href="${resetUrl}" style="color: #032746;">${resetUrl}</a>
                        </p>
                      </div>
                      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                        This link expires in <strong>1 hour</strong>. If you did not request a reset, you can ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8fafc; padding: 20px 36px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                        Automated message from <strong>${APP_DISPLAY_NAME}</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    try {
      const info = await this.getTransporter("transactional").sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw new Error(`Failed to send reset email: ${error.message}`);
    }
  }

  /**
   * Send order confirmation email (Transactional)
   */
  async sendOrderConfirmationEmail(email, name, password) {
    const mailOptions = {
      from: this.getFrom("transactional"),
      to: email,
      subject: "Course Enrollment Confirmation",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>${APP_DISPLAY_NAME} - Course Enrollment Confirmation</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for enrolling in our course! Your enrollment is now confirmed and you can start learning right away.</p>
        ${
        password !== null && password !== undefined && password !== ''
          ? `
          <p>Your login details are as follows:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="padding: 10px 15px; background-color: #032746; color: white; border: none; border-radius: 5px; cursor: pointer; text-decoration: none;">
            Login to your account
          </a>
          `
          : ''
        }
        <p>Once logged in, you can access your enrolled courses from your dashboard and begin your learning journey.</p>
        <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        <hr />
        <p style="font-size: 12px; color: #777;">This is an automated email from ${APP_DISPLAY_NAME}, please do not reply.</p>
      </div>
      `,
    };

    try {
      const info = await this.getTransporter("transactional").sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw new Error(
        `Failed to send order confirmation email: ${error.message}`
      );
    }
  }

  /**
   * Send enrollment mail (not order confirmation, just enrollment info)
   */
  async sendEnrollmentMail(email, name, courseTitle) {
    const mailOptions = {
      from: this.getFrom("transactional"),
      to: email,
      subject: `Welcome to ${APP_DISPLAY_NAME} – Enrollment Successful!`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enrollment Successful - ${APP_DISPLAY_NAME}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background-color: #ffffff; color: #000000; line-height: 1.6; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #032746; }
        .header { background-color: #1e293b; color: #ffffff; padding: 30px 40px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px; color: #60a5fa; }
        .tagline { font-size: 14px; font-weight: normal; opacity: 0.9; }
        .content { padding: 40px; background-color: #ffffff; }
        .greeting { font-size: 20px; font-weight: bold; margin-bottom: 25px; color: #000000; }
        .message-text { font-size: 16px; margin-bottom: 20px; color: #333333; }
        .highlight-box { background-color: #f8fafc; border-left: 4px solid #032746; padding: 20px; margin: 30px 0; }
        .highlight-text { font-size: 16px; font-style: italic; color: #000000; }
        .course-title { font-size: 18px; font-weight: bold; color: #032746; margin-bottom: 10px; }
        .download-section { text-align: center; margin: 40px 0; padding: 30px 20px; background-color: #1e293b; color: #ffffff; border-radius: 8px; }
        .download-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; color: #ffffff; }
        .download-btn { display: inline-block; padding: 12px 25px; background-color: #032746; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 5px; }
        .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
        .signature-text { font-size: 16px; margin-bottom: 5px; }
        .signature-name { font-weight: bold; color: #000000; }
        .footer { background-color: #0f172a; color: #ffffff; padding: 20px 40px; text-align: center; }
        .support-info { font-size: 14px; margin-bottom: 10px; }
        .support-email { color: #60a5fa; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">${APP_DISPLAY_NAME.toUpperCase()}</div>
            <div class="tagline">${APP_TAGLINE}</div>
        </div>
        <div class="content">
            <div class="greeting">Hi ${name},</div>
            <p class="message-text">Congratulations! You have been successfully enrolled in:</p>
            <div class="course-title">${courseTitle || "Your Course"}</div>
            <div class="highlight-box">
                <p class="highlight-text">We're thrilled to have you join us. Your learning journey starts now!</p>
            </div>
          
            <div class="download-section">
                <div class="download-title">Access Your Course</div>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="download-btn" target="_blank">Go to Student Dashboard</a>
            </div>
            <p class="message-text">If you have any questions or need assistance, our support team is here for you.</p>
            <div class="signature">
                <p class="signature-text">Warm regards,</p>
                <p class="signature-name">${APP_DISPLAY_NAME} Team</p>
            </div>
        </div>
        <div class="footer">
            <p class="support-info">Need help? Contact us at</p>
            <a href="mailto:${process.env.SupportEmail || 'support@example.com'}" class="support-email">${process.env.SupportEmail || 'support@example.com'}</a>
        </div>
    </div>
</body>
</html>
      `,
    };

    try {
      const info = await this.getTransporter("transactional").sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error sending enrollment mail:", error);
      throw new Error(`Failed to send enrollment mail: ${error.message}`);
    }
  }

  /**
   * Send event registration email (Founder for event/casual, Transactional if login details)
   * If password is provided, it's a new user, so use transactional. Otherwise, use founder.
   */
  async sendEventRegistrationEmail(email, name, eventDetails, password = null) {
    // If password is present, it's a transactional email (new user), else it's a founder/casual info email
    const fromType = password ? "transactional" : "founder";
    const mailOptions = {
      from: this.getFrom(fromType),
      to: email,
      subject: `Registration Confirmation for ${eventDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Event Registration Confirmation</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for registering for the event: <strong>${eventDetails.title
        }</strong>.</p>
          <p>Event Details:</p>
          <ul>
            <li><strong>Date:</strong> ${eventDetails.startDate}</li>
            <li><strong>Location:</strong> ${eventDetails.venue.address}, ${eventDetails.venue.city
        }, ${eventDetails.venue.country}</li>
          ${eventDetails.onlineLink
          ? `
            <li><strong>Platform:</strong> ${eventDetails.onlineLink.platform
          }</li>
            <li><strong>Meeting URL:</strong> <a href="${eventDetails.onlineLink.url
          }" target="_blank">Join</a></li>
            ${eventDetails.onlineLink.meetingId
            ? `<li><strong>Meeting ID:</strong> ${eventDetails.onlineLink.meetingId}</li>`
            : ""
          }
            ${eventDetails.onlineLink.password
            ? `<li><strong>Password:</strong> ${eventDetails.onlineLink.password}</li>`
            : ""
          }
          `
          : ""
        }
          ${password
          ? `
          <p>Your login details are as follows:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
          `
          : ""
        }
          <p>If you have any questions or need assistance, feel free to contact our support team.</p>
          <hr />
          <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
        </div>
      `,
    };

    try {
      const info = await this.getTransporter(fromType).sendMail(mailOptions);
      //console.log("✅ Event registration email sent:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error sending email:", error);
      throw new Error(
        `Failed to send event registration email: ${error.message}`
      );
    }
  }

  /**
   * Send job proposal email to job creator (job feature is user-to-user, not from platform)
   * This email is sent from the applicant to the job creator, using the applicant's email as the "from" address.
   * Platform only relays the email; it is not a proposal to the academy.
   */
  async sendJobProposalEmail(jobCreatorEmail, jobCreatorName, jobTitle, proposalDetails, applicant) {
    // applicant: { name, email }
    const attachments = [];
    if (proposalDetails.cv) {
      attachments.push({
        filename: "CV.pdf",
        path: proposalDetails.cv, // Should be a file path or URL accessible to the server
      });
    }

    const mailOptions = {
      from: this.getFrom("support"),
      to: jobCreatorEmail,
      replyTo: applicant.email,
      subject: `New Proposal for Your Job: "${jobTitle}" from ${applicant.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>New Proposal for Your Job</h2>
          <p>Hello <strong>${jobCreatorName}</strong>,</p>
          <p><strong>${applicant.name}</strong> has submitted a proposal for your job post: <strong>${jobTitle}</strong>.</p>
          <p><strong>Proposal Details:</strong></p>
          <ul>
            <li><strong>Cover Letter:</strong> ${proposalDetails.coverLetter || "N/A"}</li>
            <li><strong>Proposed Amount:</strong> ${proposalDetails.proposedAmount ? proposalDetails.proposedAmount : "N/A"}</li>
            <li><strong>Status:</strong> ${proposalDetails.status || "pending"}</li>
            <li><strong>Submitted At:</strong> ${proposalDetails.submittedAt ? new Date(proposalDetails.submittedAt).toLocaleString() : "N/A"}</li>
            <li><strong>Applicant Email:</strong> ${applicant.email}</li>
          </ul>
          ${proposalDetails.cv
          ? `<p><strong>CV is attached to this email.</strong></p>`
          : ""
        }
          <p>You can reply directly to this email to contact the applicant.</p>
          <hr />
          <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
        </div>
      `,
      attachments,
      replyTo: applicant.email,
    };

    try {
      const info = await this.getTransporter("support").sendMail(mailOptions);
      //console.log("✅ Job proposal email relayed to job creator:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error relaying job proposal email:", error);
      throw new Error(`Failed to relay job proposal email: ${error.message}`);
    }
  }
}

export default new EmailService();
