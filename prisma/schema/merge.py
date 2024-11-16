import os
import glob
from pathlib import Path


def merge_prisma_schemas(schema_dir="schema"):
    # Ensure the schema directory exists
    if not os.path.exists(schema_dir):
        raise Exception(f"Directory '{schema_dir}' not found!")

    # Dictionary to store different parts of the schema
    schema_parts = {
        "datasource": [],
        "generator": [],
        "model": [],
        "enum": [],
        "other": [],
    }

    # Read all .prisma files in the schema directory
    schema_files = glob.glob(os.path.join(schema_dir, "*.prisma"))

    if not schema_files:
        raise Exception(f"No .prisma files found in '{schema_dir}' directory!")

    # Process each file
    for file_path in schema_files:
        with open(file_path, "r") as file:
            content = file.read()
            blocks = content.split("\n\n")

            for block in blocks:
                block = block.strip()
                if not block:
                    continue

                if block.startswith("datasource"):
                    schema_parts["datasource"].append(block)
                elif block.startswith("generator"):
                    schema_parts["generator"].append(block)
                elif block.startswith("model"):
                    schema_parts["model"].append(block)
                elif block.startswith("enum"):
                    schema_parts["enum"].append(block)
                else:
                    schema_parts["other"].append(block)

    # Remove duplicates while preserving order
    for key in schema_parts:
        schema_parts[key] = list(dict.fromkeys(schema_parts[key]))

    # Ensure only one datasource and generator
    if len(schema_parts["datasource"]) > 1:
        print("Warning: Multiple datasource blocks found. Using the first one.")
    if len(schema_parts["generator"]) > 1:
        print("Warning: Multiple generator blocks found. Using the first one.")

    # Build the final schema
    final_schema = []

    # Add datasource (take the first one if multiple exist)
    if schema_parts["datasource"]:
        final_schema.append(schema_parts["datasource"][0])

    # Add generator (take the first one if multiple exist)
    if schema_parts["generator"]:
        final_schema.append(schema_parts["generator"][0])

    # Add other blocks
    final_schema.extend(schema_parts["other"])

    # Add enums
    final_schema.extend(schema_parts["enum"])

    # Add models
    final_schema.extend(schema_parts["model"])

    # Write the merged schema to schema.prisma in the current directory
    with open("schema-merged.prisma", "w") as f:
        f.write("\n\n".join(final_schema))

    print(f"Successfully merged {len(schema_files)} schema files into schema-merged.prisma")
    print(
        f"Found {len(schema_parts['model'])} models and {len(schema_parts['enum'])} enums"
    )


if __name__ == "__main__":
    try:
        merge_prisma_schemas()
    except Exception as e:
        print(f"Error: {str(e)}")
