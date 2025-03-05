import pdfplumber
import re

def extract_text_per_page(pdf_path, num_pages=10):
    """
    Extract text from each page of the PDF, returning a list of lines per page.
    
    Args:
        pdf_path (str): Path to the PDF file.
        num_pages (int): Number of pages to process (default: 10).
    Returns:
        list: List of lists, where each inner list contains the lines of a page.
    """
    with pdfplumber.open(pdf_path) as pdf:
        pages_text = []
        for i in range(min(num_pages, len(pdf.pages))):
            page = pdf.pages[i]
            text = page.extract_text()
            if text:
                pages_text.append(text.splitlines())
            else:
                print(f"Warning: No text extracted from page {i + 1}")
        return pages_text

def is_footer(line):
    """
    Check if a line is part of the footer.
    
    Args:
        line (str): A line of text from the document.
    Returns:
        bool: True if the line contains footer keywords, False otherwise.
    """
    footer_keywords = ["Página", "Fecha Impresión", "NUM. PEDIMENTO", "ANEXO DEL PEDIMENTO"]
    return any(keyword in line for keyword in footer_keywords)

def separate_partidas(pages_text):
    """
    Separate partidas within each page using SEC numbers, excluding headers and footers.
    
    Args:
        pages_text (list): List of lists, where each inner list contains the lines of a page.
    Returns:
        list: List of strings, where each string is a single partida.
    """
    partidas = []
    sec_pattern = re.compile(r'^\d+\s')  # Matches lines starting with a SEC number (e.g., "1 ", "68 ")
    footer_start_patterns = [
        "AGENTE ADUANAL",
        "IMPORTADOR O EXPORTADOR",
        "NUMERO DE SERIE DEL CERTIFICADO",
        "e.firma:"
    ]

    for page_lines in pages_text:
        in_partida_section = False
        current_partida = []
        for line in page_lines:
            # Start collecting lines after "PARTIDAS"
            if "PARTIDAS" in line:
                in_partida_section = True
                continue
            # Stop collecting if we reach the footer
            if is_footer(line):
                in_partida_section = False
                if current_partida:
                    # Remove any footer content from the current partida
                    cleaned_partida = []
                    for partida_line in current_partida:
                        if any(pattern in partida_line for pattern in footer_start_patterns):
                            break
                        cleaned_partida.append(partida_line)
                    partidas.append("\n".join(cleaned_partida))
                    current_partida = []
                continue
            # If inside the partida section, process lines
            if in_partida_section:
                if sec_pattern.match(line):
                    # If we have a current partida, save it before starting a new one
                    if current_partida:
                        # Remove any footer content before saving
                        cleaned_partida = []
                        for partida_line in current_partida:
                            if any(pattern in partida_line for pattern in footer_start_patterns):
                                break
                            cleaned_partida.append(partida_line)
                        partidas.append("\n".join(cleaned_partida))
                    current_partida = [line]  # Start a new partida
                elif current_partida:
                    current_partida.append(line)  # Add line to the current partida
        
        # Append the last partida on the page, if any
        if current_partida:
            # Remove any footer content before saving
            cleaned_partida = []
            for partida_line in current_partida:
                if any(pattern in partida_line for pattern in footer_start_patterns):
                    break
                cleaned_partida.append(partida_line)
            partidas.append("\n".join(cleaned_partida))

    return partidas

# Example usage
pdf_path = "/Users/santipandal/Cursor/pdf2text/PEDIMENTO_AMAZON.pdf"  # Replace with the actual path to your PDF
pages_text = extract_text_per_page(pdf_path, num_pages=10)  # Process first 10 pages
partidas = separate_partidas(pages_text)

# Print all partidas
for i, partida in enumerate(partidas, 1):
    print(f"Partida {i}:\n{partida}\n{'-'*40}")