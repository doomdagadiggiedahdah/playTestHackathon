import scrapy

class BrandScraperItem(scrapy.Item):
    url = scrapy.Field()              # Stores the URL of the webpage
    brand_keywords = scrapy.Field()   # Stores the extracted brand keywords

    # For storing image and media files metadata
    images = scrapy.Field()           # Stores image metadata
    files = scrapy.Field()            # Stores non-image media file metadata

    # For specifying image and media URLs to be downloaded
    image_urls = scrapy.Field()       # Stores the URLs of images to be downloaded
    file_urls = scrapy.Field()        # Stores the URLs of non-image media files to be downloaded