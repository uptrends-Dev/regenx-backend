// utils/email.js
import "dotenv/config";
import nodemailer from "nodemailer";

/* =============== Transporter =============== */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // مثال: smtp.gmail.com
  port: Number(process.env.SMTP_PORT ?? 465), // 465 SSL أو 587 TLS
  secure: (process.env.SMTP_SECURE ?? "true") !== "false",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  family: 4,
});

/* =============== Contact Us HTML ===============

contact = {
  _id?: "6744a1...abcd",   // اختياري لتوليد رقم مرجعي
  name: "Ahmed Ali",
  email: "ahmed@example.com",
  phone: "+20 100 123 4567",
  subject: "Inquiry about Orange Island",
  message: "I have a question about availability next Friday."
}
*/
export function contactEmailHtml(contact = {}) {
  const {
    _id,
    name = "ضيف",
    email = "",
    phone = "",
    subject = "",
    message = "",
  } = contact;

  const ref =
    typeof _id === "string"
      ? _id.slice(-8).toUpperCase()
      : String(_id ?? "")
          .slice(-8)
          .toUpperCase() || "REFXXXX";

  const receivedAt = new Date().toLocaleString("en-GB", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;direction:rtl;text-align:right;background:#f7f7f7;padding:30px">
    <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 26px rgba(0,0,0,0.08);border:1px solid #f0f0f0">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1E90FF,#0b6cd6);color:#fff;padding:22px 28px">
        <h2 style="margin:0;font-size:22px;font-weight:700">📩 رسالة تواصل جديدة</h2>
        <p style="margin:6px 0 0;font-size:14px;opacity:.95">رقم المرجع: <b style="color:#FFD700">${ref}</b></p>
      </div>

      <!-- Body -->
      <div style="padding:28px;color:#333;line-height:1.9">
        <p style="margin:0 0 10px">مرحباً فريق الدعم، تم استلام رسالة تواصل جديدة من <b>${name}</b> ✅</p>

        <h3 style="color:#1E90FF;margin:20px 0 10px;font-size:18px">بيانات المُرسل</h3>
        <table style="border-collapse:collapse;width:100%;background:#fbfdff;border-radius:10px;overflow:hidden">
          <tr style="background:#e9f4ff">
            <td style="border:1px solid #e6e6e6;padding:12px;font-weight:600">الاسم</td>
            <td style="border:1px solid #e6e6e6;padding:12px">${name}</td>
          </tr>
          <tr>
            <td style="border:1px solid #e6e6e6;padding:12px;background:#f5f9ff">البريد الإلكتروني</td>
            <td style="border:1px solid #e6e6e6;padding:12px">
              ${
                email
                  ? `<a href="mailto:${email}" style="color:#1E90FF">${email}</a>`
                  : "—"
              }
            </td>
          </tr>
          <tr>
            <td style="border:1px solid #e6e6e6;padding:12px;background:#f5f9ff">رقم الجوال</td>
            <td style="border:1px solid #e6e6e6;padding:12px">${
              phone || "—"
            }</td>
          </tr>
          <tr>
            <td style="border:1px solid #e6e6e6;padding:12px;background:#f5f9ff">الموضوع</td>
            <td style="border:1px solid #e6e6e6;padding:12px">${
              subject || "—"
            }</td>
          </tr>
          <tr>
            <td style="border:1px solid #e6e6e6;padding:12px;background:#f5f9ff">تاريخ الاستلام</td>
            <td style="border:1px solid #e6e6e6;padding:12px">${receivedAt} (Africa/Cairo)</td>
          </tr>
        </table>

        <h3 style="color:#1E90FF;margin:22px 0 10px;font-size:18px">نص الرسالة</h3>
        <div style="background:#fafafa;border:1px solid #eee;border-radius:10px;padding:16px;white-space:pre-wrap">
          ${message || "—"}
        </div>

        <p style="margin-top:22px;font-size:14px;color:#666">
          يمكن الرد مباشرة على المُرسل عبر الضغط على بريده الإلكتروني أعلاه ✉️
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f6f7f9;padding:14px 28px;font-size:12px;color:#667085;text-align:center;border-top:1px solid #ececec">
        رقم المرجع: <b>${ref}</b> • تم الإرسال تلقائياً من نموذج “اتصل بنا”
      </div>
    </div>
  </div>
  `;
}

/* =============== Send Contact Email Helper =============== */
export async function sendContactEmail({
  contact,
  to,
  subject,
  attachments = [],
}) {
  const html = contactEmailHtml(contact);

  
  // Get 3 recipient emails from environment variables
  const recipients = [
    process.env.SUPPORT_EMAIL_1,
    process.env.SUPPORT_EMAIL_2,
    process.env.SUPPORT_EMAIL_3,
  ].filter(Boolean); // Remove any undefined/null values

  // Use the provided 'to' or fall back to the 3 support emails
  const emailTo = to || recipients.join(", ") || process.env.CONTACT_TO;

  return transporter.sendMail({
    from: `"Support" <${process.env.MAIL_FROM}>`,
    to: emailTo,
    subject:
      subject || `رسالة تواصل جديدة - ${contact?.subject || "بدون عنوان"}`,
    html,
    attachments,
    // اجعل الرد يذهب للعميل مباشرة عند الضغط Reply
    replyTo: contact?.email || process.env.REPLY_TO || undefined,
    // نسخة إدارية مخفية إن رغبت
    bcc: process.env.ADMIN_BCC || undefined,
  });
}
