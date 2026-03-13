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
      const text = result.data?.text;
      if (!text) {
        error = 'No text found';
        return;
      }

      const normalizedTranslations = (text.translations || []).map((trans) => {
        const normalizedId =
          trans.id !== null && trans.id !== undefined ? Number(trans.id) : trans.id;
        const normalizedVolumeId =
          trans.volume?.id !== null && trans.volume?.id !== undefined
            ? Number(trans.volume.id)
            : trans.volume?.id;
        const normalizedPersons = (trans.persons || []).map((p) => ({
          ...p,
          id: p.id !== null && p.id !== undefined ? Number(p.id) : p.id
        }));

        return {
          ...trans,
          id: normalizedId,
          volume: trans.volume
            ? { ...trans.volume, id: normalizedVolumeId }
            : trans.volume,
          persons: normalizedPersons
        };
      });

      data = {
        ...result.data,
        text: {
          ...text,
          id: text.id !== null && text.id !== undefined ? Number(text.id) : text.id,
          translations: normalizedTranslations
        }
      };

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
  <h1>Comparing Translations</h1>
  <p>An error occurred while loading data: {error}</p>
{:else if data}
  <h1>Comparing Translations of {data.text.title}</h1>
  <div class="grid">
    {#if showOriginal}
      <article>
        <header>
          <h5>Original Text</h5>
          <div role="group">
            <button
              class="secondary"
              type="button"
              on:click={handleShowHideOriginal}
            >
              Hide
            </button>
          </div>
        </header>
        <h5>
          <cite>{data.text.title}</cite>
          {data.text.samplePassageSpec}
        </h5>
        <div role="group">
          <a role="button" class="secondary" href={data.text.url}>
            Details
          </a>
        </div>
        <p style="white-space: pre-wrap">
          {#if data.text.samplePassage}
            {data.text.samplePassage}
          {:else}
            This text does not have a sample passage.
          {/if}
        </p>
        <footer>
          <small class="muted">
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
        </footer>
      </article>
    {/if}
    {#each selectedTranslations as translation, index (translation.id || index)}
      <article>
        <header>
          {#if !translation.id}
            <select
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
            <h5>Translation</h5>
            <div role="group">
              <button
                class="secondary"
                type="button"
                data-id={translation.id}
                on:click={handleRemoveTranslation}
              >
                Hide
              </button>
            </div>
          {/if}
        </header>
        {#if translation.id}
          <div>
            <h5>{translation.title}</h5>
            <div role="group">
              <a
                role="button"
                class="secondary"
                href={translation.volume.url}
              >
                Details
              </a>
            </div>
            <p>
              <small class="muted">
                trans.&nbsp;
                <CommaLinkList values={translation.personsLinks} />
              </small>
            </p>
            <p style="white-space: pre-wrap">
              {#if translation.samplePassage}
                {translation.samplePassage}
              {:else}
                This translation does not have a sample passage.
              {/if}
            </p>
          </div>
          <footer>
            <small class="muted">
              {translation.volume.publisher.name}
              {#if translation.volume.publishedYear}
                , {translation.volume.publishedYear}.
              {/if}
            </small>
          </footer>
        {:else}
          <p>Add a translation to the comparison by selecting it above.</p>
        {/if}
      </article>
    {/each}
  </div>
{/if}
