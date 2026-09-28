def extract_pdf_text(file_path: str) -> str:
    try:
        import fitz
    except ImportError as error:
        raise RuntimeError("PDF parsing requires the PyMuPDF package") from error

    document = fitz.open(file_path)

    pages = []

    for page in document:
        pages.append(
            page.get_text("text")
        )

    document.close()

    return "\n".join(pages)
