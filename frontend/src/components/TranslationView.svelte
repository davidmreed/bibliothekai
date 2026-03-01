<script>
  import { onMount } from 'svelte';
  import { graphQL } from '../lib/api/index.js';
  import { FilterCriteria } from '../lib/dataTable.js';
  import DataTable from './DataTable.svelte';
  import Switch from './Switch.svelte';

  function normalize(record, enumValues) {
    record.featureNames = [];
    record.format = enumValues.get(record.format);

    if (record.featureAccompanyingIntroduction) {
      record.featureNames.push('Introduction');
    }
    if (record.featureAccompanyingNotes) {
      record.featureNames.push('Notes');
    }
    if (record.featureAccompanyingCommentary) {
      record.featureNames.push('Commentary');
    }
    if (record.volume.featureGlossary) {
      record.featureNames.push('Glossary');
    }
    if (record.volume.featureIndex) {
      record.featureNames.push('Index');
    }
    if (record.volume.featureBibliography) {
      record.featureNames.push('Bibliography');
    }
    if (record.volume.featureMaps) {
      record.featureNames.push('Maps');
    }
    if (record.featureFacingText) {
      record.featureNames.push('Facing Text');
    }
    if (record.featureSamplePassage) {
      record.featureNames.push('Sample Passage');
    }

    return record;
  }

  const TRANSLATION_GRAPHQL_QUERY = `
query getTranslations($textId: Int) {
        __type(name: "TranslationsFeatureFormatChoices") {
            enumValues {
                name
                description
            }
        }
        text(id: $textId) {
          translations {
            id
            originalPublicationDate
            format
            partial
            featureSamplePassage
            featureAccompanyingNotes
            featureAccompanyingCommentary
            featureAccompanyingIntroduction
            featureFacingText
            language {
                name
                id
            }
            volume {
                id
                title
                publishedDate
                featureGlossary
                featureBibliography
                featureMaps
                featureIndex
                publisher {
                    name
                }
            }
            persons {
                id
                fullName
                sortName
            }

        }
    }
}
`;

  const columns = [
    {
      id: 'volume.title',
      name: 'Title',
      targetEntity: 'volumes',
      targetEntityId: 'volume.id',
      valueType: 'link'
    },
    {
      id: 'persons',
      name: 'Translator',
      targetEntity: 'persons',
      targetEntityId: 'id',
      targetEntityName: 'fullName',
      valueType: 'link-list'
    },
    {
      id: 'volume.publisher.name',
      name: 'Publisher',
      valueType: 'string'
    },
    {
      id: 'volume.publishedDate',
      name: 'Published',
      valueType: 'year'
    },
    {
      id: 'originalPublicationDate',
      name: 'First Published',
      valueType: 'year'
    },
    { id: 'language.name', name: 'Language', valueType: 'string' },
    { id: 'format', name: 'Format', valueType: 'string' },
    {
      id: 'featureNames',
      name: 'Resources',
      valueType: 'pill-list',
      pills: {
        Introduction: 'primary',
        Notes: 'warning',
        Commentary: 'danger',
        Glossary: 'info',
        Index: 'secondary',
        Bibliography: 'dark',
        Maps: 'success',
        'Facing Text': 'danger',
        'Sample Passage': 'info'
      }
    }
  ];

  let selectedIds = [];
  let allowsSelection = false;
  let showingFilters = false;
  let selectedFilterFormat = '';
  let selectedFilterLanguage = '';
  let selectedFilterCoverage = '';
  let records = [];
  let error = '';
  let parameters;
  let translationPath = '';
  let loading = true;

  let filterCriteria = new FilterCriteria([], 'originalPublicationDate', false);

  $: filterTitle = showingFilters ? 'Clear Filters' : 'Show Filters';
  $: availableLanguages = (() => {
    const seen = new Set();
    const languages = [];

    records.forEach((r) => {
      if (!seen.has(r.language.id)) {
        languages.push(r.language);
        seen.add(r.language.id);
      }
    });

    return languages;
  })();

  $: allowComparisons = records.reduce(
    (acc, cur) => acc || cur.featureSamplePassage,
    false
  );

  $: translationCompareUrl = `/${translationPath}`;

  onMount(() => {
    const regex = /texts\/([0-9]+)\//;
    const loc = document.location.pathname;
    const textIdMatch = loc.match(regex);

    if (textIdMatch && textIdMatch.length === 2) {
      translationPath = `texts/${textIdMatch[1]}/translations`;
      parameters = { textId: Number(textIdMatch[1]) };
    } else {
      error = 'No text found';
      loading = false;
    }

    if (parameters) {
      loadData();
    }
  });

  async function loadData() {
    try {
      const result = await graphQL(TRANSLATION_GRAPHQL_QUERY, parameters);
      const enumValues = new Map(
        result.data.__type.enumValues.map((o) => [o.name, o.description])
      );
      records = result.data.text.translations.map((r) =>
        normalize(r, enumValues)
      );
      error = '';
    } catch (err) {
      error = err?.message || String(err);
    } finally {
      loading = false;
    }
  }

  function handleSort(event) {
    filterCriteria = new FilterCriteria(
      filterCriteria.filters,
      event.detail.sortColumn,
      event.detail.sortAscending
    );
  }

  function handleSelectionChange(event) {
    selectedIds = event.detail;
  }

  function handleFilterChange(event) {
    let feature;
    let required;

    if (event.detail?.dataFeature) {
      feature = event.detail.dataFeature;
      required = event.detail.value;
    } else if (event.target.name === 'format') {
      feature = 'format';
      selectedFilterFormat = event.target.value;
      required = selectedFilterFormat;
    } else if (event.target.name === 'language') {
      feature = 'language.id';
      selectedFilterLanguage = event.target.value;
      required = Number(selectedFilterLanguage);
    } else if (event.target.name === 'coverage') {
      feature = 'partial';
      selectedFilterCoverage = event.target.value;
      if (selectedFilterCoverage) {
        required = selectedFilterCoverage === 'Partial';
      }
    }

    filterCriteria = new FilterCriteria(
      filterCriteria.filters
        .filter((f) => f.column !== feature)
        .concat(
          required || (feature === 'partial' && selectedFilterCoverage)
            ? [{ column: feature, value: required }]
            : []
        ),
      filterCriteria.sortColumn,
      filterCriteria.sortAscending
    );
  }

  function handleToggleFilters() {
    showingFilters = !showingFilters;

    if (!showingFilters) {
      filterCriteria = new FilterCriteria(
        [],
        filterCriteria.sortColumn,
        filterCriteria.sortAscending
      );
    }
  }
</script>

<h2 class="mt-4">
  Translations
  <div
    class="float-right btn-group btn-group-sm"
    role="group"
    aria-label="Translation actions"
  >
    <button class="btn btn-outline-secondary" on:click={handleToggleFilters}>
      {filterTitle}
    </button>
    <a class="btn btn-outline-primary" href="/volumes/add">Add Translation</a>
    {#if allowComparisons}
      <a class="btn btn-outline-primary" href={translationCompareUrl}>
        Compare Translations
      </a>
    {/if}
  </div>
</h2>

{#if showingFilters}
  <small class="text-muted">
    Select desired translation features to filter the list. Note that not all
    translation features may be in the database.
  </small>
  <form novalidate>
    <div class="form-row">
      <div class="form-group col-md-6">
        <Switch
          label="Introduction"
          dataFeature="featureAccompanyingIntroduction"
          on:change={handleFilterChange}
        />
        <Switch
          label="Notes"
          dataFeature="featureAccompanyingNotes"
          on:change={handleFilterChange}
        />
        <Switch
          label="Commentary"
          dataFeature="featureAccompanyingCommentary"
          on:change={handleFilterChange}
        />
        <Switch
          label="Glossary"
          dataFeature="volume.featureGlossary"
          on:change={handleFilterChange}
        />
        <Switch
          label="Index"
          dataFeature="volume.featureIndex"
          on:change={handleFilterChange}
        />
      </div>
      <div class="form-group col-md-6">
        <Switch
          label="Bibliography"
          dataFeature="volume.featureBibliography"
          on:change={handleFilterChange}
        />
        <Switch
          label="Maps"
          dataFeature="volume.featureMaps"
          on:change={handleFilterChange}
        />
        <Switch
          label="Sample Passage"
          dataFeature="featureSamplePassage"
          on:change={handleFilterChange}
        />
        <Switch
          label="Facing Text"
          dataFeature="featureFacingText"
          on:change={handleFilterChange}
        />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-4">
        <label for="format">Format</label>
        <select
          class="form-control form-control-sm format-picklist"
          name="format"
          size="1"
          on:change={handleFilterChange}
          value={selectedFilterFormat}
        >
          <option value="">-- All formats --</option>
          <option value="Verse">Verse</option>
          <option value="Prose">Prose</option>
        </select>
      </div>
      <div class="form-group col-md-4">
        <label for="language">Language</label>
        <select
          class="form-control form-control-sm language-picklist"
          name="language"
          size="1"
          on:change={handleFilterChange}
          value={selectedFilterLanguage}
        >
          <option value="">-- All languages --</option>
          {#each availableLanguages as item (item.id)}
            <option value={item.id}>{item.name}</option>
          {/each}
        </select>
      </div>
      <div class="form-group col-md-4">
        <label for="coverage">Coverage</label>
        <select
          class="form-control form-control-sm coverage-picklist"
          name="coverage"
          size="1"
          on:change={handleFilterChange}
          value={selectedFilterCoverage}
        >
          <option value="">-- All coverage --</option>
          <option value="Complete">Complete</option>
          <option value="Partial">Partial</option>
        </select>
      </div>
    </div>
  </form>
{/if}
<DataTable
  {columns}
  {records}
  filterCriteria={filterCriteria}
  {allowsSelection}
  {selectedIds}
  on:sort={handleSort}
  on:selectionchange={handleSelectionChange}
/>
<div class="spinner-grow spinner-grow-sm mt-2" role="status" class:d-none={!loading}>
  <span class="sr-only">Loading...</span>
</div>
<small class="text-danger form-validity mb-2">{error}</small>
