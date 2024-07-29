import pandas as pd
import xml.etree.ElementTree as ET
from xml.dom import minidom


# resource
path = '../resources/syllabus_match.csv'

def update_android_resources(res_path: str):
    # read csv
    df = pd.read_csv(path)

    keys = df['key'].tolist()
    ja_value = df['ja'].tolist()
    en_value = df['en'].tolist()

    # Parse the existing XML file
    tree = ET.parse(res_path)
    root = tree.getroot()

    def update_or_create_array(name, values):
        array = root.find(f"./string-array[@name='{name}']")
        if array is None:
            array = ET.SubElement(root, 'string-array', {'name': name})
        else:
            array.clear()  # Clear existing elements
            array.attrib['name'] = name

        for value in values:
            ET.SubElement(array, 'item').text = value

    # update by key
    for key, ja, en in zip(keys, ja_value, en_value):
        update_or_create_array(f'syllabus_{key}', [ja, en])
        
    # Write the updated XML back to the file
    tree.write(res_path, encoding='utf-8', xml_declaration=True)


def format_xml(file_path):
    # Parse the existing XML file
    tree = ET.parse(file_path)
    root = tree.getroot()

    # Function to prettify the XML
    def prettify(elem):
        rough_string = ET.tostring(elem, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        pretty_string = reparsed.toprettyxml(indent="    ")
        lines = pretty_string.split('\n')
        non_blank_lines = [line for line in lines if line.strip() != '']
        return '\n'.join(non_blank_lines)

    # Get the formatted XML string
    formatted_xml_str = prettify(root)

    # Write the formatted XML back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(formatted_xml_str)


# Run the async function
update_android_resources(
    res_path='../android/app/src/main/res/values/arrays.xml'
)
format_xml('../android/app/src/main/res/values/arrays.xml')