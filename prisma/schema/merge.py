import os
import glob
import re
from pathlib import Path


def extract_block_content(content, start_marker, end_marker="}"):
    """Extract content between markers, handling nested braces."""
    if start_marker not in content:
        return None

    start_idx = content.index(start_marker)
    current_idx = start_idx
    brace_count = 0
    in_quotes = False
    quote_char = None

    while current_idx < len(content):
        char = content[current_idx]

        # Handle quotes
        if char in ['"', "'"] and (
            current_idx == 0 or content[current_idx - 1] != "\\"
        ):
            if not in_quotes:
                in_quotes = True
                quote_char = char
            elif char == quote_char:
                in_quotes = False

        if not in_quotes:
            if char == "{":
                brace_count += 1
            elif char == "}":
                brace_count -= 1
                if brace_count == 0:
                    return content[start_idx : current_idx + 1].strip()

        current_idx += 1

    return None


def parse_prisma_file(content):
    """Parse Prisma schema content into structured blocks."""
    blocks = {
        "datasource": [],
        "generator": [],
        "model": [],
        "enum": [],
        "indexes": [],
        "maps": [],
        "other": [],
    }

    # Remove comments
    content = re.sub(r"//.*$", "", content, flags=re.MULTILINE)
    content = re.sub(r"/\*[\s\S]*?\*/", "", content)

    # Extract complete blocks
    current_pos = 0
    while current_pos < len(content):
        # Skip whitespace
        while current_pos < len(content) and content[current_pos].isspace():
            current_pos += 1

        if current_pos >= len(content):
            break

        # Find next non-whitespace section
        remaining = content[current_pos:]

        # Check for model blocks
        if remaining.startswith("model "):
            block = extract_block_content(remaining, "model ")
            if block:
                blocks["model"].append(block)
                current_pos += len(block)
                continue

        # Check for enum blocks
        elif remaining.startswith("enum "):
            block = extract_block_content(remaining, "enum ")
            if block:
                blocks["enum"].append(block)
                current_pos += len(block)
                continue

        # Check for datasource block
        elif remaining.startswith("datasource "):
            block = extract_block_content(remaining, "datasource ")
            if block:
                blocks["datasource"].append(block)
                current_pos += len(block)
                continue

        # Check for generator block
        elif remaining.startswith("generator "):
            block = extract_block_content(remaining, "generator ")
            if block:
                blocks["generator"].append(block)
                current_pos += len(block)
                continue

        # Check for @@index
        elif remaining.startswith("@@index"):
            end_idx = remaining.find("\n")
            if end_idx == -1:
                end_idx = len(remaining)
            blocks["indexes"].append(remaining[:end_idx].strip())
            current_pos += end_idx
            continue

        # Check for @@map
        elif remaining.startswith("@@map"):
            end_idx = remaining.find("\n")
            if end_idx == -1:
                end_idx = len(remaining)
            blocks["maps"].append(remaining[:end_idx].strip())
            current_pos += end_idx
            continue

        # Move to next character if no block found
        current_pos += 1

    return blocks


def merge_prisma_schemas(schema_dir="schema"):
    """Merge all Prisma schema files in the given directory."""
    if not os.path.exists(schema_dir):
        raise Exception(f"Directory '{schema_dir}' not found!")

    # Get all .prisma files
    schema_files = glob.glob(os.path.join(schema_dir, "*.prisma"))
    if not schema_files:
        raise Exception(f"No .prisma files found in '{schema_dir}' directory!")

    # Collect all blocks from all files
    all_blocks = {
        "datasource": [],
        "generator": [],
        "model": [],
        "enum": [],
        "indexes": [],
        "maps": [],
        "other": [],
    }

    # Process each file
    for file_path in schema_files:
        with open(file_path, "r") as file:
            content = file.read()
            blocks = parse_prisma_file(content)
            for key, values in blocks.items():
                all_blocks[key].extend(values)

    # Remove duplicates while preserving order
    for key in all_blocks:
        all_blocks[key] = list(dict.fromkeys(all_blocks[key]))

    # Build the final schema
    final_schema_parts = []

    # Add datasource (take the first one if multiple exist)
    if all_blocks["datasource"]:
        final_schema_parts.append(all_blocks["datasource"][0])

    # Add generator (take the first one if multiple exist)
    if all_blocks["generator"]:
        final_schema_parts.append(all_blocks["generator"][0])

    # Add enums
    final_schema_parts.extend(all_blocks["enum"])

    # Add models
    final_schema_parts.extend(all_blocks["model"])

    # Add indexes
    final_schema_parts.extend(all_blocks["indexes"])

    # Add maps
    final_schema_parts.extend(all_blocks["maps"])

    # Write the merged schema
    final_schema = "\n\n".join(final_schema_parts)

    with open("schema-merged.prisma", "w") as f:
        f.write(final_schema)

    print(f"Successfully merged {len(schema_files)} schema files into schema.prisma")
    print(
        f"Found {len(all_blocks['model'])} models and {len(all_blocks['enum'])} enums"
    )


if __name__ == "__main__":
    try:
        merge_prisma_schemas()
    except Exception as e:
        print(f"Error: {str(e)}")
