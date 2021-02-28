from django.test import TestCase

from unittest import mock
import pytest
from django.core.exceptions import ValidationError

from .models import AuthorNameMixin, Person, Publisher, Volume, Feature, Language
from users.models import User


class FakeModel(AuthorNameMixin):
    def save(self, *args, **kwargs):
        pass  # Do nothing


class TestBaseModels(TestCase):
    def test_author_name_mixin(self):
        fm = FakeModel()
        fm.persons = mock.Mock()

        fm.persons.all.return_value = ["a"]
        assert fm.author_string() == "a"

        fm.persons.all.return_value = ["a", "b"]
        assert fm.author_string() == "a and b"

        fm.persons.all.return_value = ["a", "b", "c"]
        assert fm.author_string() == "a, b, and c"

    def test_user_created_approval_mixin__positive(self):
        m = Person()
        u = User(is_superuser=True)
        u.save()

        m.sole_name = "Plato"
        m.user = u
        m.save()

        assert m.approved

    def test_user_created_approval_mixin(self):
        m = Person()
        u = User(is_superuser=False)
        u.save()

        m.sole_name = "Plato"
        m.user = u
        m.save()

        assert not m.approved


class TestPersonModel(TestCase):
    def setUp(self):
        pass

    def test_save_populates_sort_name__sole_name(self):
        p = Person(sole_name="Test")
        p.save()

        assert p.sort_name == "Test"

    def test_save_populates_sort_name__fl_name(self):
        p = Person(first_name="First", last_name="Last", middle_name="Middle")
        p.save()

        assert p.sort_name == "Last, First Middle"

    def test_clean_blocks_invalid_name_data(self):
        p = Person(first_name="First", last_name="Last", sole_name="Sole")

        with pytest.raises(ValidationError):
            p.clean()

        p = Person(first_name="First")

        with pytest.raises(ValidationError):
            p.clean()

    def test_full_name(self):
        p = Person(sole_name="Test")
        assert p.full_name() == "Test"

        p = Person(first_name="First", last_name="Last")
        assert p.full_name() == "First Last"

        p = Person(first_name="First", last_name="Last", middle_name="Middle")
        assert p.full_name() == "First Middle Last"

    def test_translation_count(self):
        l = Language(name="English")
        l.save()
        pub = Publisher(name="Test")
        pub.save()
        v = Volume(title="Test", publisher=pub, published_date="2020-01-01")
        v.save()
        p = Person(sole_name="Test")
        p.save()
        o = Person(sole_name="Other")
        o.save()

        for person in [o, p]:
            for feature in ["TR", "IN"]:
                f = Feature(
                    volume=v,
                    feature=feature,
                    partial=False,
                    language=l,
                    has_facing_text=False,
                )
                f.save()
                f.persons.add(person)

        assert p.translation_count() == 1

    @mock.patch("translations.models.reverse")
    def test_get_absolute_url(self, reverse):
        reverse.return_value = "test"

        p = Person(sole_name="Test")
        p.save()
        assert p.get_absolute_url() == "test"
        reverse.assert_called_once_with("person_detail", args=[str(p.id)])

    def test_str(self):
        p = Person(first_name="First", last_name="Last", middle_name="Middle")
        assert str(p) == p.generate_sort_name()
