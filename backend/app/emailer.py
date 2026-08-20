from __future__ import annotations

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from .email_templates import (
    enquiry_confirmation,
    lead_notification_admin,
    payment_receipt,
    welcome_student,
)
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
    course = lead.get("course_slug") or "General"
    message = lead.get("message", "")
    subject, html, text = lead_notification_admin(name, email, course, message)
    send_email(settings.email_admin_to, subject, text, html)


def send_enquiry_confirmation(email: str, name: str, course: str = "") -> None:
    subject, html, text = enquiry_confirmation(name, course)
    send_email(email, subject, text, html)


def send_payment_receipt(email: str, name: str, order_id: str, course_title: str, amount: str) -> None:
    subject, html, text = payment_receipt(name, order_id, course_title, amount)
    send_email(email, subject, text, html)


def send_welcome(email: str, name: str, course: str, batch_name: str) -> None:
    subject, html, text = welcome_student(name, course, batch_name)
    send_email(email, subject, text, html)