import json
import os
import requests
from .items import WebPageItem
from .settings import SVG_STORE

class WebPagePipeline:
    def open_spider(self, spider):
        self.output = open("brand_keywords.jsonl", "w")
        
    def process_item(self, item, spider):
        if isinstance(item, WebPageItem):
            if item.get('brand_keywords') is not None:
                self.output.write(json.dumps(dict(item)) + "\n")
        return item

    def close_spider(self, spider):
        self.output.close()

class DirectSVGDownloadPipeline:
    def process_item(self, item, spider):
        print('PROCESSING SVG ITEMS NOW')
        if 'svg_urls' in item:
            for svg_url in item['svg_urls']:
                response = requests.get(svg_url)
                file_name = os.path.basename(svg_url)
                folder_path = SVG_STORE
                os.makedirs(folder_path, exist_ok=True)
                file_path = os.path.join(folder_path, file_name)
                with open(file_path, 'wb') as f:
                    f.write(response.content)
        return item