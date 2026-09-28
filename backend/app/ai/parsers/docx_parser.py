def extract_docx_text(file_path: str):
    try:
        from docx import Document
    except ImportError as error:
        raise RuntimeError("DOCX parsing requires the python-docx package") from error

    document = Document(file_path)

    return "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
    )
