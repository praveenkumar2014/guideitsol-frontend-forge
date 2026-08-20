"""HTML email templates for GUIDESOFT transactional emails.

Each function returns (subject, html_body, text_body) tuple.
"""


def _base_template(content: str, title: str) -> str:
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 20px; }}
  .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }}
  .header {{ background: linear-gradient(135deg, #0369a1, #0891b2); padding: 32px 24px; text-align: center; }}
  .header h1 {{ color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; }}
  .header p {{ color: rgba(255,255,255,0.8); font-size: 13px; margin: 4px 0 0; }}
  .body {{ padding: 32px 24px; color: #1e293b; line-height: 1.6; }}
  .body h2 {{ font-size: 18px; margin: 0 0 16px; color: #0f172a; }}
  .body p {{ font-size: 14px; margin: 0 0 12px; color: #475569; }}
  .cta {{ display: inline-block; background: #0369a1; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; margin: 16px 0; }}
  .footer {{ background: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; }}
  .footer a {{ color: #0369a1; text-decoration: none; }}
  .badge {{ display: inline-block; background: #ecfdf5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
  .card {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0; }}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>GUIDESOFT</h1>
    <p>Learn real technology. Build real skills.</p>
  </div>
  <div class="body">
    {content}
  </div>
  <div class="footer">
    <p>&copy; 2026 GuideSoft IT Solutions. All rights reserved.</p>
    <p><a href="https://guideitsol.in">guideitsol.in</a> | <a href="mailto:info@guideitsol.in">info@guideitsol.in</a></p>
    <p style="margin-top:8px"><a href="https://guideitsol.in/privacy">Privacy</a> | <a href="https://guideitsol.in/terms">Terms</a> | <a href="https://guideitsol.in/refund">Refund</a></p>
  </div>
</div>
</body>
</html>"""


def enquiry_confirmation(name: str, course: str = "") -> tuple[str, str, str]:
    subject = f"We received your enquiry - {course or 'GUIDESOFT'}"
    course_line = f"<p>Course of interest: <strong>{course}</strong></p>" if course else ""
    html = _base_template(f"""
        <h2>Hi {name}, we got your enquiry!</h2>
        <p>Thank you for reaching out to GUIDESOFT. Our admissions team will contact you within 24 hours.</p>
        {course_line}
        <div class="card">
            <p style="margin:0;font-size:13px;color:#64748b;"><strong>What happens next?</strong></p>
            <p style="margin:8px 0 0;font-size:13px;color:#475569;">1. Our counsellor will call you to understand your goals<br>2. We'll share a personalised course recommendation<br>3. You'll get access to a free demo class</p>
        </div>
        <a href="https://guideitsol.in/courses" class="cta">Browse All Courses</a>
        <p style="font-size:13px;color:#94a3b8;">Questions? Reply to this email or WhatsApp us.</p>
    """, subject)
    text = f"Hi {name},\n\nThank you for your enquiry{f' about {course}' if course else ''}. Our team will contact you within 24 hours.\n\nGUIDESOFT - Learn real technology. Build real skills."
    return subject, html, text


def payment_receipt(name: str, order_id: str, course: str, amount: str) -> tuple[str, str, str]:
    subject = f"Payment confirmed - {course} | GUIDESOFT"
    html = _base_template(f"""
        <h2>Payment Confirmed!</h2>
        <p>Hi {name}, your payment has been successfully received.</p>
        <div class="card">
            <table style="width:100%;font-size:14px;">
                <tr><td style="padding:4px 0;color:#64748b;">Order ID</td><td style="padding:4px 0;text-align:right;font-family:monospace;">{order_id}</td></tr>
                <tr><td style="padding:4px 0;color:#64748b;">Course</td><td style="padding:4px 0;text-align:right;font-weight:600;">{course}</td></tr>
                <tr><td style="padding:4px 0;color:#64748b;">Amount Paid</td><td style="padding:4px 0;text-align:right;font-weight:700;color:#059669;">{amount}</td></tr>
            </table>
        </div>
        <p>Your batch details and access credentials will be shared via email within 2 hours.</p>
        <a href="https://guideitsol.in/student-dashboard" class="cta">Go to Dashboard</a>
    """, subject)
    text = f"Hi {name},\n\nPayment confirmed!\nOrder: {order_id}\nCourse: {course}\nAmount: {amount}\n\nYour batch details will be shared soon.\n\nGUIDESOFT"
    return subject, html, text


def welcome_student(name: str, course: str, batch_name: str) -> tuple[str, str, str]:
    subject = f"Welcome to {course} - Your journey begins! | GUIDESOFT"
    html = _base_template(f"""
        <h2>Welcome to GUIDESOFT, {name}!</h2>
        <p>You're now enrolled in <strong>{course}</strong> — Batch: <strong>{batch_name}</strong></p>
        <div class="card">
            <p style="margin:0 0 8px;font-weight:600;color:#0f172a;">Your Learning Journey</p>
            <p style="margin:0;font-size:13px;color:#475569;">
                Access your dashboard for course materials<br>
                Join the batch Discord/WhatsApp group<br>
                Complete your profile and introduce yourself<br>
                Start with Module 1 whenever you're ready
            </p>
        </div>
        <a href="https://guideitsol.in/student-dashboard" class="cta">Start Learning</a>
        <p style="font-size:13px;color:#94a3b8;">Need help? Email info@guideitsol.in or reply to this message.</p>
    """, subject)
    text = f"Welcome to GUIDESOFT, {name}!\n\nYou're enrolled in {course} — Batch: {batch_name}\n\nStart learning at: https://guideitsol.in/student-dashboard\n\nGUIDESOFT - Learn real technology. Build real skills."
    return subject, html, text


def lead_notification_admin(name: str, email: str, course: str, message: str) -> tuple[str, str, str]:
    subject = f"New Enquiry: {name} — {course or 'General'}"
    html = _base_template(f"""
        <h2>New Enquiry Received</h2>
        <div class="card">
            <table style="width:100%;font-size:14px;">
                <tr><td style="padding:4px 0;color:#64748b;">Name</td><td style="padding:4px 0;text-align:right;">{name}</td></tr>
                <tr><td style="padding:4px 0;color:#64748b;">Email</td><td style="padding:4px 0;text-align:right;">{email}</td></tr>
                <tr><td style="padding:4px 0;color:#64748b;">Course</td><td style="padding:4px 0;text-align:right;">{course or 'General'}</td></tr>
            </table>
        </div>
        <p><strong>Message:</strong></p>
        <p style="background:#f8fafc;padding:12px;border-radius:8px;font-size:13px;">{message}</p>
        <a href="https://guideitsol.in/admin" class="cta">View in Admin Console</a>
    """, subject)
    text = f"New enquiry from {name} ({email})\nCourse: {course or 'General'}\nMessage: {message}\n\nAdmin: https://guideitsol.in/admin"
    return subject, html, text
