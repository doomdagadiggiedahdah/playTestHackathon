import scrapy

class WebPageItem(scrapy.Item):
    url = scrapy.Field()
    brand_keywords = scrapy.Field()
    item_type = scrapy.Field(default='web_page')

class ImageItem(scrapy.Item):
    image_urls = scrapy.Field()
    images = scrapy.Field()
    svg_urls = scrapy.Field()
    svgs = scrapy.Field()

class SVGItem(scrapy.Item):
    svg_urls = scrapy.Field()
    files = scrapy.Field()