<script>
  import { onMount } from 'svelte';
  import { graphQL, getRecordUiUrl } from '../lib/api/index.js';
  import { oxfordCommaList } from '../lib/utils.js';
  import CommaLinkList from './CommaLinkList.svelte';

  const COMPARISON_GRAPHQL_QUERY = `
query getTranslations($textId: Int) {
    text(id: $textId) {
        id
        title
        samplePassageSpec
        samplePassage
        samplePassageSource
        samplePassageSourceLink
        samplePassageLicense
        samplePassageLicenseLink    
        translations {
            id
            title
            samplePassage
            volume {
                id
                title
                publisher {
                    name
                }
                publishedDate
            }
            persons {
                id
                fullName
            }
        }
    }
}
`;

  let data;
  let error = '';
  let parameters;
  let showOriginal = true;
  let selectedTranslationIds = [];

  onMount(() => {
    const regex = /texts\/([0-9]+)\/translations/;
    const loc = document.location.pathname;
    const textIdMatch = loc.match(regex);
    const urlQuery = new URLSearchParams(document.location.search);

    if (textIdMatch) {
      if (textIdMatch.length >= 2) {
        parameters = { textId: Number(textIdMatch[1]) };
      }

      selectedTranslationIds = urlQuery.getAll('trans') || [];
      if (urlQuery.has('hideOriginal')) {
        showOriginal = false;
      }
    } else {
      error = 'The URL is not valid';
    }

    if (parameters) {
      loadData();
    }
  });

  async function loadData() {
    try {
      const result = await graphQL(COMPARISON_GRAPHQL_QUERY, parameters);
      data = result.data;

      data.text.url = getRecordUiUrl('texts', data.text.id);

      for (const trans of data.text.translations) {
        trans.volume.url = getRecordUiUrl('volumes', trans.volume.id);
        trans.title = trans.title || trans.volume.title;
        trans.personsLinks = trans.persons.map((p) => ({
          name: p.fullName,
          href: getRecordUiUrl('persons', p.id),
          id: p.id
        }));
        let dateString = '';
        if (trans.volume.publishedDate) {
          trans.volume.publishedYear = trans.volume.publishedDate.substring(0, 4);
          dateString = `,  ${trans.volume.publishedYear}`;
        }
        const transString = oxfordCommaList(
          trans.persons.map((p) => p.fullName)
        );

        trans.displayName = `${trans.volume.title} (${trans.volume.publisher.name}${dateString}), trans. ${transString}`;
      }

      if (availableTranslations.length && !selectedTranslationIds.includes('')) {
        selectedTranslationIds = [...selectedTranslationIds, ''];
      }
    } catch (err) {
      error = err?.message || String(err);
    }
  }

  $: availableTranslations = data
    ? data.text.translations.filter(
        (t) =>
          !!t.samplePassage &&
          !selectedTranslationIds
            .filter((id) => id)
            .map((id) => Number(id))
            .includes(t.id)
      )
    : [];

  $: selectedTranslations = data
    ? selectedTranslationIds.map((id) => {
        if (!id) {
          return { id: '' };
        }
        const match = translationById(id);
        return match || { id };
      })
    : [];

  function translationById(id) {
    const numericId = Number(id);
    const desiredId = Number.isNaN(numericId) ? id : numericId;
    return data.text.translations.filter((f) => f.id === desiredId)[0];
  }

  function handleShowHideOriginal() {
    showOriginal = !showOriginal;
    updateHistoryState();
  }

  function handleRemoveTranslation(event) {
    const id = event.currentTarget.dataset.id;
    selectedTranslationIds = selectedTranslationIds.filter(
      (t) => String(t) !== String(id)
    );
  }

  function updateHistoryState() {
    let idString =
      '?' +
      selectedTranslationIds
        .filter((t) => !!t)
        .map((t) => `trans=${t}`)
        .join('&');

    if (!showOriginal) {
      idString += '&hideOriginal=true';
    }

    window.history.replaceState(
      null,
      null,
      `/texts/${parameters.textId}/translations${idString}`
    );
  }

  $: if (data) {
    const selectedIds = selectedTranslationIds
      .filter((id) => id)
      .map((id) => Number(id));
    const hasRemaining = data.text.translations.some(
      (t) => !!t.samplePassage && !selectedIds.includes(t.id)
    );
    if (hasRemaining && !selectedTranslationIds.includes('')) {
      selectedTranslationIds = [...selectedTranslationIds, ''];
    }
  }

  $: if (parameters) {
    selectedTranslationIds;
    showOriginal;
    updateHistoryState();
  }
</script>

{#if error}
  <h1 class="mb-4">Comparing Translations</h1>
  <div>An error occurred while loading data: {error}</div>
{:else if data}
  <h1 class="mt-4 mb-4">Comparing Translations of {data.text.title}</h1>
  <div class="row row-cols-1 row-cols-lg-2">
    {#if showOriginal}
      <div class="col mb-4">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title clearfix">
              Original Text
              <div class="float-right">
                <button
                  class="btn btn-sm btn-outline-secondary"
                  type="button"
                  on:click={handleShowHideOriginal}
                >
                  Hide
                </button>
              </div>
            </h5>
          </div>
          <div class="card-body">
            <h5 class="card-title clearfix">
              <cite>{data.text.title}</cite>
              {data.text.samplePassageSpec}
              <div class="float-right">
                <a class="btn btn-sm btn-outline-secondary" href={data.text.url}>
                  Details
                </a>
              </div>
            </h5>
            <p class="card-text" style="white-space: pre-wrap">
              {#if data.text.samplePassage}
                {data.text.samplePassage}
              {:else}
                This text does not have a sample passage.
              {/if}
            </p>
          </div>
          <div class="card-footer">
            <small class="text-muted">
              {#if data.text.samplePassageSourceLink}
                <a href={data.text.samplePassageSourceLink}>
                  {data.text.samplePassageSource}
                </a>
              {:else}
                {data.text.samplePassageSource}
              {/if}
              {#if data.text.samplePassageLicense}
                {#if data.text.samplePassageLicenseLink}
                  <a href={data.text.samplePassageLicenseLink}>
                    ({data.text.samplePassageLicense})
                  </a>
                {:else}
                  &nbsp;({data.text.samplePassageLicense})
                {/if}
              {/if}
            </small>
          </div>
        </div>
      </div>
    {/if}
    {#each selectedTranslations as translation, index (translation.id || index)}
      <div class="col mb-4">
        <div class="card h-100">
          <div class="card-header">
            {#if !translation.id}
              <select
                class="form-control"
                size="1"
                name={index}
                bind:value={selectedTranslationIds[index]}
              >
                {#if availableTranslations.length}
                  <option value="">-- Select a translation --</option>
                  {#each availableTranslations as trans (trans.id)}
                    <option value={trans.id}>{trans.displayName}</option>
                  {/each}
                {:else}
                  <option>-- No items --</option>
                {/if}
              </select>
            {:else}
              <h5 class="card-title clearfix">
                Translation
                <div class="float-right">
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    type="button"
                    data-id={translation.id}
                    on:click={handleRemoveTranslation}
                  >
                    Hide
                  </button>
                </div>
              </h5>
            {/if}
          </div>
          {#if translation.id}
            <div class="card-body">
              <h5 class="card-title clearfix">
                {translation.title}
                <div class="float-right">
                  <a
                    class="btn btn-sm btn-outline-secondary"
                    href={translation.volume.url}
                  >
                    Details
                  </a>
                </div>
              </h5>
              <h6 class="card-subtitle mb-2 text-muted">
                trans.&nbsp;
                <CommaLinkList values={translation.personsLinks} />
              </h6>
              <p class="card-text" style="white-space: pre-wrap">
                {#if translation.samplePassage}
                  {translation.samplePassage}
                {:else}
                  This translation does not have a sample passage.
                {/if}
              </p>
            </div>
            <div class="card-footer">
              <small class="text-muted">
                {translation.volume.publisher.name}
                {#if translation.volume.publishedYear}
                  , {translation.volume.publishedYear}.
                {/if}
              </small>
            </div>
          {:else}
            <div class="card-body">
              Add a translation to the comparison by selecting it above.
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
{/if}
