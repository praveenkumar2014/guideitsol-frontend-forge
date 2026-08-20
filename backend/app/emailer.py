from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from .settings import get_settings

logger = logging.getLogger("guidesoft.email")


def send_email(to: str, subject: str, text_body: str, html_body: str | None = None) -> bool:
    """Send a transactional email via SMTP when configured.

    Returns True when delivery was attempted/accepted. When SMTP is not
    configured the message is logged and skipped so development works offline.
    """
    settings = get_settings()
    if not settings.email_smtp_host or not settings.email_smtp_user or not settings.email_smtp_password:
        logger.info("SMTP not configured - skipping email to %s: %s", to, subject)
        return False

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = settings.email_from
    message["To"] = to
    message.attach(MIMEText(text_body, "plain", "utf-8"))
    if html_body:
        message.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP(settings.email_smtp_host, settings.email_smtp_port, timeout=15) as client:
            client.starttls()
            client.login(settings.email_smtp_user, settings.email_smtp_password)
            client.send_message(message)
        return True
    except Exception:  # noqa: BLE001 - delivery failures must not break API responses
        logger.exception("Failed to send email to %s", to)
        return False


def notify_new_lead(lead: dict) -> None:
    settings = get_settings()
    name = lead.get("name", "A learner")
    email = lead.get("email", "")
    course_slug = lead.get("course_slug") or "General enquiry"
    subject = f"New GUIDESOFT enquiry from {name}"
    text = (
        f"New website enquiry\n\n"
        f"Name: {name}\nEmail: {email}\nPhone: {lead.get('phone') or '-'}\n"
        f"Course: {course_slug}\nSource: {lead.get('source', 'website')}\n"
        f"Message:\n{lead.get('message', '')}\n"
    )
    send_email(settings.email_admin_to, subject, text)


def send_enquiry_confirmation(email: str, name: str) -> None:
    subject = "We received your enquiry - GUIDESOFT"
    text = (
        f"Hi {name},\n\n"
        "Thanks for reaching out to GUIDESOFT. A career advisor will get back to you "
        "within three working days with a useful next step.\n\n"
        "You can browse the full course catalogue at https://guideitsol.com/courses\n\n"
        "Regards,\nGUIDESOFT Team"
    )
    html = (
        "<p>Hi " + name + ",</p>"
        "<p>Thanks for reaching out to <strong>GUIDESOFT</strong>. A career advisor will get back "
        "to you within three working days with a useful next step.</p>"
        '<p>You can browse the full course catalogue at <a href="https://guideitsol.com/courses">guideitsol.com/courses</a>.</p>'
        "<p>Regards,<br/>GUIDESOFT Team</p>"
    )
    send_email(email, subject, text, html)


def send_payment_receipt(email: str, name: str, order_id: str, course_title: str, amount: str) -> None:
    subject = f"Payment confirmed - {course_title}"
    text = (
        f"Hi {name},\n\n"
        f"Your payment for {course_title} was successful.\n"
        f"Order ID: {order_id}\nAmount: {amount}\n\n"
        "You will receive enrolment details from your batch coordinator shortly.\n\n"
        "Regards,\nGUIDESOFT Team"
    )
    html = (
        "<p>Hi " + name + ",</p>"
        f"<p>Your payment for <strong>{course_title}</strong> was successful.</p>"
        f"<p>Order ID: <code>{order_id}</code><br/>Amount: {amount}</p>"
        "<p>You will receive enrolment details from your batch coordinator shortly.</p>"
        "<p>Regards,<br/>GUIDESOFT Team</p>"
    )
    send_email(email, subject, text, html)