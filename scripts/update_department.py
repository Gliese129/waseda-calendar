import re
import aiohttp
import asyncio
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET
from xml.dom import minidom


# URL to crawl
url = "https://www.wsl.waseda.jp/syllabus/JAA101.php"


async def fetch(session, url, params=None, data=None):
    async with session.get(url, params=params) as response:
        return await response.text()


async def post(session, url, data=None):
    async with session.post(url, data=data) as response:
        return await response.text()


async def parse(lang: str, keywords: list[str]):
    async with aiohttp.ClientSession() as session:
        # Get the initial page
        response_text = await fetch(session, url, params={'pLng': lang})
        soup = BeautifulSoup(response_text, 'html.parser')

        # Get the cell next to the one with the word "School"
        school_cell = list(filter(
            lambda cell: keywords.count(cell.text.strip()) > 0,
            soup.find_all('th')
        ))[0]
        next_cell = school_cell.find_next_sibling('td')

        # Get all values and labels from <option> tags
        options = next_cell.find_all('option')
        option_list = [{'value': option['value'], 'abbr': option.text, 'name': ''} for option in options if
                       option['value']]

        async def process_option(option):
            value = option['value']
            form_data = {
                'ControllerParameters': 'JAA103SubCon',
                'p_gakubu': value,
                'pLng': lang,
            }
            response_text = await post(session, url, data=form_data)
            result_soup = BeautifulSoup(response_text, 'html.parser')

            # Get the table with class 'ct-vh'
            table = result_soup.find('table', class_='ct-vh')
            if table:
                # Get the first 'a' tag and its href
                first_a_tag = table.find('a')
                if first_a_tag:
                    onClickStr = first_a_tag['onclick']
                    pKey = re.search(r"post_submit\('(.+?)', '(.+?)'\)", onClickStr)[2]
                    href = f'https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey={pKey}&pLng={lang}'

                    response_text = await fetch(session, href)
                    result_soup = BeautifulSoup(response_text, 'html.parser')

                    # Get the cell next to the one with the word "School"
                    school_cell = list(filter(
                        lambda cell: keywords.count(cell.text.strip()) > 0,
                        result_soup.find_all('th')
                    ))[0]
                    if school_cell:
                        next_cell_value = school_cell.find_next_sibling('td').text.strip()
                        option['name'] = next_cell_value

        # Iterate the array and process each option
        tasks = [process_option(option) for option in option_list]
        await asyncio.gather(*tasks)

        return option_list


def update_android_resources(lang: str, keywords: list[str], res_path: str):
    # update en
    results = asyncio.run(parse(lang, keywords))

    # Parse the existing XML file
    tree = ET.parse(res_path)
    root = tree.getroot()

    # Find or create int-array elements
    def find_or_create_array(name):
        array = root.find(f"./string-array[@name='{name}']")
        if array is None:
            array = ET.SubElement(root, 'string-array', {'name': name})
        else:
            array.clear()  # Clear existing elements
            array.attrib['name'] = name
        return array

    school_value_array = find_or_create_array('school_value')
    school_abbr_array = find_or_create_array('school_abbr')
    school_name_array = find_or_create_array('school_name')

    # Update the arrays with the new values
    for option in results:
        ET.SubElement(school_value_array, 'item').text = option['value']
        ET.SubElement(school_abbr_array, 'item').text = option['abbr']
        ET.SubElement(school_name_array, 'item').text = option['name']

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
    lang='ja', keywords=['学部', 'School', '開講箇所'], res_path='../android/app/src/main/res/values/arrays.xml'
)
format_xml('../android/app/src/main/res/values/arrays.xml')