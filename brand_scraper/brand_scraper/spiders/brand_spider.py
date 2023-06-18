from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from urllib.parse import urlparse

from brand_scraper.items import BrandScraperItem

class BrandSpider(CrawlSpider):
    name = 'brand_spider'
    allowed_domains = None
    start_urls = None

    # Define the rules for the spider
    rules = (
        Rule(LinkExtractor(), callback='parse_item', follow=True),
    )

    def __init__(self, *args, **kwargs):
        super(BrandSpider, self).__init__(*args, **kwargs)
        input_url = kwargs.pop('url', None)
        self.start_urls = [input_url]
        parsed_url = urlparse(input_url)
        main_domain = parsed_url.netloc

        # Include subdomains related to the main domain
        self.allowed_domains = [
            main_domain,
            f"img.{main_domain}",
            # Add other common subdomains if needed
        ]

    # Define a function to filter image and media URLs
    def is_media(self, url):
        media_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        return any(url.endswith(ext) for ext in media_extensions)

    def parse_item(self, response):
        self.logger.info('Processing: %s' % response.url)

        # Filter image and media URLs
        if not self.is_media(response.url):
            # Save non-image and non-media URLs
            item = BrandScraperItem()
            item['url'] = response.url
            
            # Extract brand keywords here (using GPT-3.5-turbo-16k API)
            # item['brand_keywords'] = extracted_brand_keywords

            return item
        else:
            # Download image and media files
            item = BrandScraperItem()
            
            # Identify if the media url is an image
            image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            if any(response.url.endswith(ext) for ext in image_extensions):
                item["image_urls"] = [response.url]
            else:
                item["file_urls"] = [response.url]

            return item