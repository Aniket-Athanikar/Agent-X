import random

from app.core.redis import redis_client
from app.services.email_service import send_otp


async def send_email_verification(
    email: str,
    name: str = None
):

    otp = str(
        random.randint(
            100000,
            999999
        )
    )

    redis_client.setex(
        f"verify:{email}",
        600,
        otp
    )

    print(f"=====================================")
    print(f"GENERATED OTP FOR {email}: {otp}")
    print(f"=====================================")

    await send_otp(
        email,
        otp,
        name
    )


def verify_email_code(
    email: str,
    code: str
):
    print("EMAIL:", email)
    print("ENTERED OTP:", code)

    stored = redis_client.get(
        f"verify:{email}"
    )
    print("STORED OTP:", stored)
    if not stored:
        return False

    if stored != code:
        return False

    redis_client.delete(
        f"verify:{email}"
    )

    return True