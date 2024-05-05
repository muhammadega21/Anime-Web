document.addEventListener("alpine:init", () => {
  Alpine.store("anime", {
    ongoingDatas: [],
    ongoingEpisodesDatas: [],

    ongoingFetch() {
      fetch("https://otakudesu-unofficial-api.rzkfyn.xyz/v1/home")
        .then((response) => response.json())
        .then((ongoingAnimesData) => {
          this.ongoingDatas = ongoingAnimesData.data.ongoing_anime;

          const episodePromises = ongoingAnimesData.data.ongoing_anime.map(
            (anime) => {
              const slug = anime.slug;
              return fetch(
                `https://otakudesu-unofficial-api.rzkfyn.xyz/v1/anime/${slug}/episodes`
              )
                .then((response) => response.json())
                .then((episodesData) => ({
                  anime,
                  episodes: episodesData.data.reverse().slice(0, 6),
                }));
            }
          );

          Promise.all(episodePromises).then((episodesData) => {
            this.ongoingEpisodesDatas = episodesData.slice(0, 9);
          });
        });
    },
  });
});

function getEpisodeNumber(urls) {
  const match = urls.match(/(?:episode|ep)-(\d+)/i);
  return match ? `Episode ${match[1]}` : null;
}
