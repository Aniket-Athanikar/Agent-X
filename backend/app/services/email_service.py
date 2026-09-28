import os
from dotenv import load_dotenv

# pyrefly: ignore [missing-import]
from fastapi_mail import (FastMail, MessageSchema, ConnectionConfig, MessageType)

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
)


async def send_otp(
    email: str,
    otp: str,
    name: str = None
):
    if not name:
        name = email.split("@")[0].title()
    
    first_name = name.split(" ")[0]
    
    # Generate box-by-box OTP HTML elements
    otp_boxes = ""
    for char in otp:
        otp_boxes += f"""
        <div style="display: inline-block; width: 44px; height: 48px; line-height: 48px; text-align: center; font-size: 24px; font-weight: 800; font-family: 'Courier New', Courier, monospace; color: #06B6D4; background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.5); border-radius: 8px; margin: 0 4px; box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);">{char}</div>
        """

    body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{
          background-color: #030712;
          background-image: 
            radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.08) 1px, transparent 0),
            linear-gradient(rgba(6, 182, 212, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.02) 1px, transparent 1px);
          background-size: 20px 20px, 40px 40px, 40px 40px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          margin: 0;
          padding: 60px 10px;
          color: #d1d5db;
        }}
        .floating-card {{
          max-width: 520px;
          margin: 0 auto;
          background-color: rgba(9, 17, 26, 0.85);
          border: 1px solid rgba(6, 182, 212, 0.4);
          border-top: 3px solid #06B6D4;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.1);
        }}
        .celebration-banner {{
          background: linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
          border-bottom: 1px solid rgba(6, 182, 212, 0.2);
          padding: 14px;
          text-align: center;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #06B6D4;
        }}
        .card-body {{
          padding: 40px 32px;
        }}
        .brand-section {{
          text-align: center;
          margin-bottom: 32px;
        }}
        .brand-logo-capsule {{
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(6, 182, 212, 0.04);
          border: 1px solid rgba(6, 182, 212, 0.25);
          border-radius: 12px;
        }}
        .brand-icon {{
          width: 14px;
          height: 14px;
          border: 2px solid #06B6D4;
          border-radius: 50%;
          display: inline-block;
          background: #030712;
          box-shadow: 0 0 8px #06B6D4;
        }}
        .brand-name {{
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #ffffff;
          text-transform: uppercase;
        }}
        .brand-accent {{
          color: #06B6D4;
        }}
        .handshake-title {{
          text-align: center;
          font-size: 13px;
          font-weight: 850;
          color: #10B981;
          text-transform: uppercase;
          letter-spacing: 4px;
          margin-top: 16px;
        }}
        .user-greeting {{
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
        }}
        .info-panel {{
          background: rgba(6, 182, 212, 0.02);
          border-left: 3px solid #06B6D4;
          padding: 16px;
          border-radius: 0 12px 12px 0;
          margin: 24px 0;
          font-size: 13px;
          line-height: 1.6;
          color: #9ca3af;
        }}
        .quote-panel {{
          border-top: 1px dashed rgba(255, 255, 255, 0.08);
          border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
          padding: 18px 10px;
          margin: 32px 0;
          text-align: center;
          font-style: italic;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }}
        .otp-section {{
          text-align: center;
          margin: 32px 0;
        }}
        .copyright-footer {{
          text-align: center;
          margin-top: 40px;
          font-size: 9px;
          color: #4b5563;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 24px;
          font-family: monospace;
          letter-spacing: 1.5px;
        }}
      </style>
    </head>
    <body>
      <div class="floating-card">
        <div class="celebration-banner">
          🎉 SECURE VERIFICATION TRANSMISSION 🚀
        </div>
        
        <div class="card-body">
          <div class="brand-section">
            <div class="brand-logo-capsule">
              <span class="brand-icon"></span>
              <span class="brand-name">AGENT-<span class="brand-accent">X</span></span>
            </div>
            <div class="handshake-title">Security Handshake</div>
          </div>
          
          <p class="user-greeting">Hello {name},</p>
          
          <div class="info-panel">
            Welcome to the <strong>Agent-X Elite Developer Workspace</strong>. A dynamic security verification has been initialized. Use the verification passcode below to authorize access to your sandbox enclave.
          </div>

          <p style="font-size: 13px; color: #9ca3af;">Dynamic One-Time Passcode (OTP):</p>
          
          <div class="otp-section">
            {otp_boxes}
          </div>

          <div class="quote-panel">
            "Orchestrating autonomous intelligence to build the future of software engineering."
          </div>
          
          <p style="font-size: 11px; color: #4b5563; text-align: center;">This code will expire in 5 minutes. If you did not trigger this request, please ignore this transmission.</p>
          
          <div class="copyright-footer">
            // SECURE PORTAL // SYSTEM READY // &copy; 2026 AGENT-X
          </div>
        </div>
      </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="[Agent-X] Security Handshake Verification Code",
        recipients=[email],
        body=body,
        subtype=MessageType.html
    )

    fm = FastMail(conf)

    await fm.send_message(
        message
    )
