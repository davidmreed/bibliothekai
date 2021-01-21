import { LightningElement } from 'lwc';
import { createRecord } from 'bib/drf';

export default class AddPublishedReview extends LightningElement {
    title = "Review";
    location = "";
    published_date = "";
    link = "";

    create() {
        createRecord(
            "published-reviews",
            {
                volumes: this.template.querySelector(".volumes-listbox").getSelectedIds(),
                persons: this.template.querySelector(".persons-listbox").getSelectedIds(),
                published_date: this.published_date,
                title: this.title,
                location: this.location,
                links: [
                    {
                        link: this.link,
                        resource_type: "FT"
                    }
                ]

            }
        );
    }

    addPerson() {

    }
}
