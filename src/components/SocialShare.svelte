<script lang="ts">
  interface Props {
    title: string;
    urlPath: string;
  }

  let { title, urlPath }: Props = $props();
  let copied = $state(false);

  const getFullUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${urlPath}`;
  };

  const platforms = [
    {
      name: 'LinkedIn',
      icon: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
      getShareUrl: (_t: string, u: string) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
    },
    {
      name: 'BlueSky',
      icon: '<path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>',
      getShareUrl: (t: string, u: string) =>
        `https://bsky.app/intent/compose?text=${encodeURIComponent(t + ' ' + u)}`,
    },
    {
      name: 'Mastodon',
      icon: '<path d="M21.327 8.566c0-4.339-2.843-5.61-2.843-5.61-1.433-.658-3.894-.935-6.451-.956h-.063c-2.557.021-5.016.298-6.45.956 0 0-2.843 1.272-2.843 5.61 0 .993-.019 2.181.012 3.441.103 4.243.778 8.425 4.701 9.463 1.809.479 3.362.579 4.612.51 2.268-.126 3.541-.809 3.541-.809l-.075-1.646s-1.621.511-3.441.449c-1.804-.062-3.707-.194-3.999-2.409a4.523 4.523 0 0 1-.04-.621s1.77.433 4.014.536c1.372.063 2.658-.08 3.965-.236 2.506-.299 4.688-1.843 4.962-3.254.434-2.223.398-5.424.398-5.424zm-3.353 5.59h-2.081V9.057c0-1.075-.452-1.62-1.357-1.62-1 0-1.501.647-1.501 1.927v2.791h-2.069V9.364c0-1.28-.501-1.927-1.502-1.927-.905 0-1.357.545-1.357 1.62v5.099H6.026V8.903c0-1.074.273-1.927.823-2.558.566-.631 1.307-.955 2.228-.955 1.065 0 1.872.409 2.405 1.228l.518.869.519-.869c.533-.819 1.34-1.228 2.4-1.228.92 0 1.662.324 2.228.955.549.631.822 1.484.822 2.558v5.253z"/>',
      getShareUrl: (t: string, u: string) =>
        `https://fosstodon.org/share?text=${encodeURIComponent(t + ' ' + u)}`,
    },
  ];

  const copyToClipboard = async () => {
    const url = getFullUrl();
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
</script>

<div class="flex flex-col gap-4 py-8 border-t border-border/50">
  <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
    Share this post
  </h3>

  <div class="flex items-center gap-2">
    {#each platforms as platform (platform.name)}
      <a
        href={platform.getShareUrl(title, getFullUrl())}
        target="_blank"
        rel="noopener noreferrer"
        class="p-2.5 rounded-xl border border-border hover:bg-accent text-muted-foreground hover:text-primary transition-all duration-300"
        aria-label={`Share on ${platform.name}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {@html platform.icon}
        </svg>
      </a>
    {/each}

    <button
      onclick={copyToClipboard}
      class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-accent text-muted-foreground hover:text-primary transition-all duration-300"
      aria-label="Copy link"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <span class="text-xs font-bold uppercase tracking-widest">
        {copied ? 'Copied!' : 'Copy Link'}
      </span>
    </button>
  </div>
</div>
