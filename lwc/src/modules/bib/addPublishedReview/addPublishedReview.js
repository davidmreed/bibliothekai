import { LightningElement } from 'lwc';
import { createRecord } from 'bib/drf';

export default class AddPublishedReview extends LightningElement {
    title = "";
    location = "";
    published_date = "";
    link = "";

    handleChange(event) {
        const field = event.target.name;
        if (field === 'title') {
            this.title = event.target.value;
        } else if (field === 'location') {
            this.location = event.target.value;
        } else if (field === 'date') {
            this.published_date = event.target.value;
        } else if (field === 'link') {
            this.link = event.target.value;
        }
    }

    changeTab(event) {
        let tabName = event.target.dataset.tab;

        // Select the correct tab.
        for (let elem of this.template.querySelectorAll(".nav-link")) {
            elem.classList.remove("active");
        }
        event.target.classList.add("active");

        // Show the corresponding tab pane.
        for (let elem of this.template.querySelectorAll(".tab-pane")) {
            if (elem.dataset.tab !== tabName) {
                elem.classList.remove("active");
            } else {
                elem.classList.add("active");
            }
        }
    }

    create() {
        // Validate data.

        // We must have at least one Volume and at least one Author.
        let persons = this.template.querySelector(".persons-listbox").getSelectedIds();
        let volumes = this.template.querySelector(".volumes-listbox").getSelectedIds();

        if (!persons
            || !volumes
            || !this.location
            || !this.published_date
        ) {
            alert('Please populate required fields.');
            return;
        }

        let record = {
            volumes: volumes,
            persons: persons,
            published_date: this.published_date,
            title: this.title,
            location: this.location
        }
        if (this.link) {
            record.links = [
                {
                    link: this.link,
                    resource_type: "FT"
                }
            ]
        }
        createRecord(
            "published-reviews",
            record
        );
    }

    addPerson() {

    }
}
