import json
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from urllib.parse import urlparse
from ..utils import clean_html, read_prompt_text, num_tokens_from_messages_cl100kbase, run_prompt_with_retry

from brand_scraper.items import ImageItem, WebPageItem, SVGItem

class BrandSpider(CrawlSpider):
    name = 'brand_spider'
    allowed_domains = None
    start_urls = None

    rules = (
        Rule(LinkExtractor(), callback='parse_item', follow=True),
    )

    extract_brand_keywords_prompt = read_prompt_text("./extract_brand_keyword_prompt.txt")

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

        self.seen_image_urls = set()
        self.seen_svg_urls = set()
        self.seen_webpage_urls = set()

    def parse_item(self, response):
        self.logger.info('Processing: %s' % response.url)
        
        # Extract image URLs from the img tag
        image_urls = [
            img_url for img_url in response.css('img::attr(src)').getall()
            if not img_url.lower().endswith('.svg')
        ]
        svg_urls = response.css('img::attr(src)').re(".*\.svg$")
        print(svg_urls)

        # If new SVG URLs are found
        new_svg_urls = set(svg_urls) - self.seen_svg_urls
        if new_svg_urls:
            self.seen_svg_urls.update(new_svg_urls)

            # Download new SVGs
            svg_item = SVGItem()
            svg_item["svg_urls"] = [response.urljoin(svg_url) for svg_url in new_svg_urls]
            yield svg_item

        # If new image URLs are found
        new_image_urls = set(image_urls) - self.seen_image_urls
        if new_image_urls:
            self.seen_image_urls.update(new_image_urls)

            # Download new images
            image_item = ImageItem()
            image_item["image_urls"] = [response.urljoin(img_url) for img_url in new_image_urls]
            yield image_item

        # If new webpage URLs are found
        new_image_urls = set(image_urls) - self.seen_image_urls
        webpage_item = WebPageItem()
        webpage_item['url'] = response.url

        html_body_text = response.text
        cleaned_html = clean_html(html_body_text)

        # Extract brand keywords here (using GPT-3.5-turbo-16k API)
        replace_texts = {
            "COMPANY": "Red Bull",
            "INSERT": cleaned_html,
        }
        worthy_analysis_prompt = read_prompt_text("./worthy_analysis_prompt.txt", replace_texts)

        prompt_chain = [
            {
                "role": "user",
                "content": worthy_analysis_prompt,
            }
        ]

        initial_message_tokens = num_tokens_from_messages_cl100kbase(prompt_chain)

        is_worth_analysis_response = run_prompt_with_retry(prompt_chain, initial_message_tokens)

        if "TRUE" in is_worth_analysis_response:
            remainder_prompt_chain = [
                {"role": "assistant", "content": "TRUE"},
                {"role": "user", "content": self.extract_brand_keywords_prompt},
            ]
            prompt_chain += remainder_prompt_chain
            current_message_tokens = num_tokens_from_messages_cl100kbase(prompt_chain)
            prompt_response = run_prompt_with_retry(prompt_chain, current_message_tokens)
            extracted_brand_keywords = json.loads(prompt_response)
        else:
            extracted_brand_keywords = None
        
        webpage_item['brand_keywords'] = extracted_brand_keywords
        webpage_item['item_type'] = 'web_page'

        yield webpage_item