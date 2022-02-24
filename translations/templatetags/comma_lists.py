from django import template
from django.urls.base import reverse

register = template.Library()


@register.inclusion_tag("components/pill.html")
def pill(title, content, template=None, id=None):
    return {
        "title": title,
        "content": content,
        "link": reverse(template, args=[id]) if template else None,
    }


@register.tag(name="commalist")
def do_comma_list(parser, token):
    try:
        _, item_list = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError(
            "commalist tag requires exactly one argument"
        )
    item_template = parser.parse(("endcommalist",))
    item_list = parser.compile_filter(item_list)
    parser.delete_first_token()

    return CommaListFormatter(item_list, item_template)


class CommaListFormatter(template.Node):
    def __init__(self, item_list, item_template):
        self.item_template = item_template
        self.item_list = item_list

    def render(self, context):
        rendered_nodes = []
        old_item = context.get("item")
        values = self.item_list.resolve(context, ignore_failures=True)
        if values is None:
            values = []

        for item in values:
            context["item"] = item
            rendered_nodes.append(self.item_template.render(context).strip())
        context["item"] = old_item

        if len(rendered_nodes) < 3:
            return " and ".join(rendered_nodes)

        return ", ".join(rendered_nodes[:-1]) + ", and " + rendered_nodes[-1]
