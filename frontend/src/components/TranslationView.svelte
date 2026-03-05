<script>
  import { onMount } from 'svelte';
  import { graphQL } from '../lib/api/index.js';
  import { FilterCriteria } from '../lib/dataTable.js';
  import DataTable from './DataTable.svelte';
  import Switch from './Switch.svelte';

  function normalize(record, enumValues) {
    const languageId =
      record.language && record.language.id !== null && record.language.id !== undefined
        ? Number(record.language.id)
        : record.language?.id;
    const volumeId =
      record.volume && record.volume.id !== null && record.volume.id !== undefined
        ? Number(record.volume.id)
        : record.volume?.id;
    const normalizedRecord = {
      ...record,
      id:
        record.id !== null && record.id !== undefined
          ? Number(record.id)
          : record.id,
      language: record.language ? { ...record.language, id: languageId } : record.language,
      volume: record.volume ? { ...record.volume, id: volumeId } : record.volume,
      featureNames: [],
      format: enumValues.get(record.format)
    };

    if (normalizedRecord.featureAccompanyingIntroduction) {
      normalizedRecord.featureNames.push('Introduction');
    }
    if (normalizedRecord.featureAccompanyingNotes) {
      normalizedRecord.featureNames.push('Notes');
    }
    if (normalizedRecord.featureAccompanyingCommentary) {
      normalizedRecord.featureNames.push('Commentary');
    }
    if (normalizedRecord.volume?.featureGlossary) {
      normalizedRecord.featureNames.push('Glossary');
    }
    if (normalizedRecord.volume?.featureIndex) {
      normalizedRecord.featureNames.push('Index');
    }
    if (normalizedRecord.volume?.featureBibliography) {
      normalizedRecord.featureNames.push('Bibliography');
    }
    if (normalizedRecord.volume?.featureMaps) {
      normalizedRecord.featureNames.push('Maps');
    }
    if (normalizedRecord.featureFacingText) {
      normalizedRecord.featureNames.push('Facing Text');
    }
    if (normalizedRecord.featureSamplePassage) {
      normalizedRecord.featureNames.push('Sample Passage');
    }

    return normalizedRecord;
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

  let sortColumn = 'originalPublicationDate';
  let sortAscending = false;
  let filterCriteria = new FilterCriteria([], sortColumn, sortAscending);
  let filterIntroduction = false;
  let filterNotes = false;
  let filterCommentary = false;
  let filterGlossary = false;
  let filterIndex = false;
  let filterBibliography = false;
  let filterMaps = false;
  let filterSamplePassage = false;
  let filterFacingText = false;

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
    sortColumn = event.detail.sortColumn;
    sortAscending = event.detail.sortAscending;
  }


  function handleToggleFilters() {
    showingFilters = !showingFilters;
  }

  $: {
    const filters = [];
    if (showingFilters) {
      if (filterIntroduction) {
        filters.push({ column: 'featureAccompanyingIntroduction', value: true });
      }
      if (filterNotes) {
        filters.push({ column: 'featureAccompanyingNotes', value: true });
      }
      if (filterCommentary) {
        filters.push({ column: 'featureAccompanyingCommentary', value: true });
      }
      if (filterGlossary) {
        filters.push({ column: 'volume.featureGlossary', value: true });
      }
      if (filterIndex) {
        filters.push({ column: 'volume.featureIndex', value: true });
      }
      if (filterBibliography) {
        filters.push({ column: 'volume.featureBibliography', value: true });
      }
      if (filterMaps) {
        filters.push({ column: 'volume.featureMaps', value: true });
      }
      if (filterSamplePassage) {
        filters.push({ column: 'featureSamplePassage', value: true });
      }
      if (filterFacingText) {
        filters.push({ column: 'featureFacingText', value: true });
      }
      if (selectedFilterFormat) {
        filters.push({ column: 'format', value: selectedFilterFormat });
      }
      if (selectedFilterLanguage) {
        filters.push({
          column: 'language.id',
          value: Number(selectedFilterLanguage)
        });
      }
      if (selectedFilterCoverage) {
        filters.push({
          column: 'partial',
          value: selectedFilterCoverage === 'Partial'
        });
      }
    }

    filterCriteria = new FilterCriteria(filters, sortColumn, sortAscending);
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
          bind:value={filterIntroduction}
        />
        <Switch
          label="Notes"
          bind:value={filterNotes}
        />
        <Switch
          label="Commentary"
          bind:value={filterCommentary}
        />
        <Switch
          label="Glossary"
          bind:value={filterGlossary}
        />
        <Switch
          label="Index"
          bind:value={filterIndex}
        />
      </div>
      <div class="form-group col-md-6">
        <Switch
          label="Bibliography"
          bind:value={filterBibliography}
        />
        <Switch
          label="Maps"
          bind:value={filterMaps}
        />
        <Switch
          label="Sample Passage"
          bind:value={filterSamplePassage}
        />
        <Switch
          label="Facing Text"
          bind:value={filterFacingText}
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
          bind:value={selectedFilterFormat}
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
          bind:value={selectedFilterLanguage}
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
          bind:value={selectedFilterCoverage}
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
  bind:selectedIds={selectedIds}
  on:sort={handleSort}
/>
<div class="spinner-grow spinner-grow-sm mt-2" role="status" class:d-none={!loading}>
  <span class="sr-only">Loading...</span>
</div>
<small class="text-danger form-validity mb-2">{error}</small>
