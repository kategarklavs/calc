from django.test import TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile

from .common import FAKE_SCHEDULE, FAKE_SCHEDULE_EXAMPLE_PATH
from ..schedules.fake_schedule import FakeSchedulePriceList
from ..schedules import registry
from ..forms import Step1Form


@override_settings(DATA_CAPTURE_SCHEDULES=[FAKE_SCHEDULE])
class Step1FormTests(TestCase):
    def setUp(self):
        registry._init()

    def create_csv_file(self, content):
        return SimpleUploadedFile(
            'foo.csv',
            content,
            content_type='text/csv'
        )

    def test_invalid_when_schedule_is_missing(self):
        form = Step1Form({})
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['schedule'][0], 'This field is required.')

    def test_invalid_when_schedule_is_invalid(self):
        form = Step1Form({
            'schedule': 'data_capture.schedules.s70.Schedule70PriceList'
        })
        self.assertFalse(form.is_valid())
        self.assertRegexpMatches(form.errors['schedule'][0],
                                 'Select a valid choice')

    def test_invalid_when_file_is_missing(self):
        form = Step1Form({})
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors['file'][0], 'This field is required.')

    def test_invalid_when_file_cannot_be_gleaned(self):
        form = Step1Form({
            'schedule': FAKE_SCHEDULE,
        }, {
            'file': self.create_csv_file(b'i cannot be gleaned')
        })
        self.assertFalse(form.is_valid())
        self.assertEqual(form.errors, {
            '__all__': [
                "The file you uploaded doesn't have any data we can "
                "glean from it."
            ]
        })

    def test_clean_sets_gleaned_data(self):
        with open(FAKE_SCHEDULE_EXAMPLE_PATH, 'rb') as f:
            form = Step1Form({
                'schedule': FAKE_SCHEDULE,
            }, {
                'file': self.create_csv_file(f.read())
            })
            self.assertTrue(form.is_valid())
            self.assertEqual(form.cleaned_data['gleaned_data'].title,
                             FakeSchedulePriceList.title)
