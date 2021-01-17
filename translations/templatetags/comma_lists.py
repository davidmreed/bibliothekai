from django import template

register = template.Library()


@register.tag(name="commalist")
def do_comma_list(parser, token):
    try:
        tag_name, item_list = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError(
            f"{tag_name} tag requires exactly one argument"
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
