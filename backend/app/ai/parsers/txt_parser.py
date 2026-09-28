from pathlib import Path


def extract_txt_text(file_path: str) -> str:
    raw = Path(file_path).read_bytes()
    for encoding in ("utf-8-sig", "utf-16", "utf-32", "cp1252", "latin-1"):
        try:
            return raw.decode(encoding).replace("\r\n", "\n").replace("\r", "\n")
        except UnicodeDecodeError:
            continue
    raise ValueError("Unable to decode text file")
