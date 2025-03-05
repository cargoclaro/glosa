import pdfplumber
import re

def extract_pedimento_sections(pdf_path, num_pages=10):
    """
    Extract information from a Mexican customs document (pedimento)
    divided into specified sections. Stops after reaching PARTIDAS section.
    
    Args:
        pdf_path (str): Path to the PDF file
        num_pages (int): Number of pages to process (default: 10)
        
    Returns:
        dict: Dictionary with text organized by specified sections
    """
    sections = {
        "PEDIMENTO": [],
        "DATOS DEL IMPORTADOR/EXPORTADOR": [],
        "TASAS A NIVEL PEDIMENTO": [],
        "CUADRO DE LIQUIDACION": [],
        "ANEXO DEL PEDIMENTO": [],
        "DATOS DEL PROVEEDOR O COMPRADOR": [],
        "CANDADOS": [],
        "OBSERVACIONES": [],
        "PARTIDAS": []
    }
    
    # Keep track of current section
    current_section = "PEDIMENTO"
    partidas_started = False
    
    with pdfplumber.open(pdf_path) as pdf:
        section_counter = 1
        for i in range(min(num_pages, len(pdf.pages))):
            page = pdf.pages[i]
            text = page.extract_text()
            lines = text.splitlines()
            
            # Check if this is an annex page
            if "ANEXO DEL PEDIMENTO" in text and i > 0:
                current_section = f"Section {section_counter}"
                # Initialize the section key if it doesn't exist
                if current_section not in sections:
                    sections[current_section] = []
                section_counter += 1
            
            for line in lines:
                # Skip page headers/footers from annex pages
                if any(x in line for x in ["Pagina", "Fecha Impresión:", "NUM. PEDIMENTO:", "ANEXO DEL PEDIMENTO"]) and i > 0:
                    continue
                    
                # Section detection
                if "DATOS DEL IMPORTADOR/EXPORTADOR" in line:
                    current_section = f"Section {section_counter}"
                    # Initialize the section key if it doesn't exist
                    if current_section not in sections:
                        sections[current_section] = []
                    section_counter += 1
                    sections[current_section].append(line)
                elif "TASAS A NIVEL PEDIMENTO" in line:
                    current_section = f"Section {section_counter}"
                    # Initialize the section key if it doesn't exist
                    if current_section not in sections:
                        sections[current_section] = []
                    section_counter += 1
                    sections[current_section].append(line)
                elif "CUADRO DE LIQUIDACION" in line:
                    current_section = f"Section {section_counter}"
                    # Initialize the section key if it doesn't exist
                    if current_section not in sections:
                        sections[current_section] = []
                    section_counter += 1
                    sections[current_section].append(line)
                elif "DATOS DEL PROVEEDOR O COMPRADOR" in line:
                    current_section = f"Section {section_counter}"
                    # Initialize the section key if it doesn't exist
                    if current_section not in sections:
                        sections[current_section] = []
                    section_counter += 1
                    sections[current_section].append(line)
                elif "CANDADOS" in line and not line.strip().endswith("CANDADOS"):
                    current_section = f"Section {section_counter}"
                    # Initialize the section key if it doesn't exist
                    if current_section not in sections:
                        sections[current_section] = []
                    section_counter += 1
                    sections[current_section].append(line)
                elif "OBSERVACIONES" in line and not any(x in line for x in ["NIVEL PARTIDA", "A NIVEL PARTIDA"]):
                    current_section = f"Section {section_counter}"
                    # Initialize the section key if it doesn't exist
                    if current_section not in sections:
                        sections[current_section] = []
                    section_counter += 1
                    sections[current_section].append(line)
                elif "PARTIDAS" in line:
                    # Stop processing after finding PARTIDAS section
                    current_section = f"Section {section_counter}"
                    # Initialize the section key if it doesn't exist
                    if current_section not in sections:
                        sections[current_section] = []
                    sections[current_section].append(line)
                    return {k: v for k, v in sections.items() if v}
                # Section continuation
                elif current_section in sections:
                    # Handle the case for AGENTE ADUANAL sections that should be skipped
                    if "AGENTE ADUANAL" in line and current_section != f"Section {section_counter-1}":
                        continue
                    elif "IMPORTADOR O EXPORTADOR" in line and "DESTINO/ORIGEN:" in line and current_section != f"Section {section_counter-1}":
                        continue
                    else:
                        sections[current_section].append(line)
    
    # Clean up empty sections
    return {k: v for k, v in sections.items() if v}

def format_sections_for_output(sections):
    """
    Format the extracted sections for easy reading and processing
    
    Args:
        sections (dict): Dictionary with text organized by sections
        
    Returns:
        str: Formatted string with sections
    """
    output = ["# PEDIMENTO INFORMATION\n"]
    
    # Define a mapping of current section keys to new display names and their order
    section_mapping = {
        "PEDIMENTO": {"name": "sec 1", "order": 1},
        "Section 1": {"name": "sec 2", "order": 2},
        "Section 2": {"name": "sec 3", "order": 3},
        "Section 3": {"name": "sec 4", "order": 4},  # Will be skipped but included for completeness
        "Section 4": {"name": "sec 5", "order": 5},
        "Section 5": {"name": "sec 6", "order": 6},
        "Section 6": {"name": "sec 7", "order": 7},
        "Section 7": {"name": "sec 8", "order": 8},
        "Section 8": {"name": "sec 9", "order": 9}
    }
    
    # Create a list of sections with their content and order information
    formatted_sections = []
    
    for section_key, section_lines in sections.items():
        # Skip Section 3 as requested
        if section_key == "Section 3":
            continue
            
        if section_lines:
            # Get the display name and order for this section
            if section_key in section_mapping:
                display_name = section_mapping[section_key]["name"]
                order = section_mapping[section_key]["order"]
            else:
                # For any sections not in our mapping, use sec + a high number
                display_name = f"sec {999}"
                order = 999
                
            section_content = []
            section_content.append(f"## {display_name}")
            section_content.append("```")
            
            # For Section 6, remove content from e.firma onwards
            if section_key == "Section 6":
                filtered_lines = []
                for line in section_lines:
                    if "e.firma:" in line:
                        # Stop at e.firma line
                        break
                    filtered_lines.append(line)
                section_content.append("\n".join(filtered_lines))
            else:
                section_content.append("\n".join(section_lines))
                
            section_content.append("```")
            section_content.append("")  # Add empty line between sections
            
            # Add this section and its order to our list
            formatted_sections.append({"content": "\n".join(section_content), "order": order})
    
    # Sort sections by their order and add to output
    formatted_sections.sort(key=lambda x: x["order"])
    for section in formatted_sections:
        output.append(section["content"])
    
    return "\n".join(output)

def extract_and_save_pedimento(pdf_path, output_path=None):
    """
    Extract pedimento by sections and save to a file if output_path is provided
    
    Args:
        pdf_path (str): Path to the PDF file
        output_path (str, optional): Path to save the output
    
    Returns:
        dict: The extracted sections
    """
    sections = extract_pedimento_sections(pdf_path)
    formatted_text = format_sections_for_output(sections)
    
    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(formatted_text)
    
    return sections, formatted_text

# Example usage
if __name__ == "__main__":
    # Replace with your actual PDF path
    pdf_path = "/Users/santipandal/Cursor/pdf2text/PEDIMENTO_AMAZON.pdf"
    
    # Extract sections
    sections, formatted_text = extract_and_save_pedimento(pdf_path)
    
    # Print the formatted text
    print(formatted_text)
    
    # Optionally save to a file
    extract_and_save_pedimento(pdf_path, "pedimento_sections.md")
    
    # If you want to access specific sections
    if "PARTIDAS" in sections:
        partidas_text = sections["PARTIDAS"]
        print(f"\nNumber of lines in PARTIDAS section: {len(partidas_text)}")
