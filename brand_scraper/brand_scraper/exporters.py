from scrapy.exporters import JsonLinesItemExporter

class FilteredJsonLinesItemExporter(JsonLinesItemExporter):
    def __init__(self, file, **kwargs):
        self.item_filter_field = kwargs.pop("item_filter_field", None)
        self.item_filter_value = kwargs.pop("item_filter_value", None)
        super().__init__(file, **kwargs)

    def export_item(self, item):
        if not (self.item_filter_field and self.item_filter_value):
            super().export_item(item)
            return

        if item.get(self.item_filter_field) == self.item_filter_value:
            super().export_item(item)