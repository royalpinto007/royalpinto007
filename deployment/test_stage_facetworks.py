import unittest
from stage_facetworks import rebase_references, rebase_root_links


class RebaseTests(unittest.TestCase):
    def test_no_moves_preserves_the_document(self):
        self.assertEqual(rebase_references('unchanged /assets/a.js', {}), 'unchanged /assets/a.js')

    def test_nested_routes_assets_queries_and_canonical_urls(self):
        routes = {'/facetworks/vantage': '/facetworks/designs/vantage'}
        before = '<a href="/facetworks/vantage/work?view=all#top"><script src="/facetworks/vantage/assets/a.js"></script> https://royalpinto007.com/facetworks/vantage/'
        expected = '<a href="/facetworks/designs/vantage/work?view=all#top"><script src="/facetworks/designs/vantage/assets/a.js"></script> https://royalpinto007.com/facetworks/designs/vantage/'
        self.assertEqual(rebase_references(before, routes), expected)

    def test_similar_prefixes_and_new_routes_stay_intact(self):
        routes = {'/facetworks/drift': '/facetworks/graphics/drift'}
        for text in ['/facetworks/driftwood/a.js', '/facetworks/graphics/drift/', 'key:drift']:
            self.assertEqual(rebase_references(text, routes), text)

    def test_root_links_preserve_remote_and_already_scoped_assets(self):
        text = '<a href="/"><img src="/favicon.svg"><img src="//cdn.test/a.jpg"><script src="/facetworks/graphics/rent-my-screen/assets/a.js">'
        result = rebase_root_links(text, '/facetworks/graphics/rent-my-screen')
        self.assertIn('href="/facetworks/graphics/rent-my-screen/"', result)
        self.assertIn('src="/facetworks/graphics/rent-my-screen/favicon.svg"', result)
        self.assertIn('src="//cdn.test/a.jpg"', result)
        self.assertNotIn('rent-my-screen/facetworks', result)


if __name__ == '__main__':
    unittest.main()
