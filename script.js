let playlists = {
  leona: {
    title: "Leona",
    owner: "Celene Cornelia",
    id: "14IMVM1ss8P87xAUH4Y6UK",
    cover: "assets/leona.jpg",
    handle: "copydesk_queen",
    tracks: [
      ["Vitamin C - 2004 Remastered Version", "CAN", "03:34"],
      ["Dream Brother", "Jeff Buckley", "05:30"],
      ["So Real", "Jeff Buckley", "04:43"],
      ["1 Thing", "Amerie", "03:58"],
      ["Maneater", "Nelly Furtado", "04:18"],
      ["Without Me", "Eminem", "04:50"],
      ["Glory Box", "Portishead", "05:08"],
      ["Smells Like Teen Spirit", "Nirvana", "05:01"],
      ["Come As You Are", "Nirvana", "03:38"],
      ["White Flag", "Dido", "04:00"],
      ["Paper Planes", "M.I.A.", "03:25"],
      ["Feel Good Inc.", "Gorillaz, De La Soul", "03:42"],
      ["Street Spirit (Fade Out)", "Radiohead", "04:13"],
      ["Prove Yourself", "Radiohead", "02:25"],
      ["Underappreciated", "Christina Aguilera", "04:00"],
      ["Just A Girl", "No Doubt", "03:29"],
      ["It's My Life", "No Doubt", "03:45"],
      ["Dreams", "The Cranberries", "04:31"],
      ["Ain't It Fun", "Paramore", "04:56"],
      ["Hit 'Em Up Style (Oops!)", "Blu Cantrell", "04:10"]
    ]
  },
  bernard: {
    title: "Bernard",
    owner: "Caitie Mccollow",
    id: "43sB8K6xzSYkdF6eUdU3ng",
    cover: "assets/bernard.jpg",
    handle: "bernardcare69",
    tracks: [
      ["Vogue", "Madonna", "05:17"],
      ["Semi-Charmed Life", "Third Eye Blind", "04:28"]
    ]
  },
  vivienne: {
    title: "Vivienne",
    owner: "Caitie Mccollow",
    id: "1k5mPfSLddHEsR5WjhxSAK",
    cover: "assets/vivienne.jpg",
    handle: "vivienne_onboard",
    tracks: [
      ["Firestarter", "The Prodigy", "04:39"],
      ["Clair de Lune", "Johann Debussy", "04:35"],
      ["Come As You Are", "Nirvana", "03:38"]
    ]
  },
  sophia: {
    title: "Sophia",
    owner: "Caitie Mccollow",
    id: "6lBTJIFgR07N44cLiEG2zG",
    cover: "assets/sophia.jpg",
    handle: "miniDV_soph",
    tracks: [
      ["Decode", "Paramore", "04:21"],
      ["Poison", "Bell Biv DeVoe", "04:21"],
      ["Return of the Mack", "Mark Morrison", "03:33"],
      ["Going Under", "Evanescence", "03:34"],
      ["My Happy Ending", "Avril Lavigne", "04:02"]
    ]
  }
};

const select = document.querySelector("#characterSelect");
const rows = document.querySelector("#trackRows");
const cover = document.querySelector("#coverArt");
const nameEl = document.querySelector("#characterName");
const ownerEl = document.querySelector("#playlistOwner");
const countEl = document.querySelector("#fileCount");
const titleEl = document.querySelector("#playlistTitle");
const subtitleEl = document.querySelector("#playlistSubtitle");
const statusEl = document.querySelector("#statusText");
const searchEl = document.querySelector("#fakeSearch");
const windowTitleEl = document.querySelector("#windowTitle");
const tabs = document.querySelectorAll(".tab");
const views = {
  search: document.querySelector("#searchView"),
  downloads: document.querySelector("#downloadsView"),
  "now-playing": document.querySelector("#nowPlayingView"),
  chat: document.querySelector("#chatView")
};
const nowTrackEl = document.querySelector("#nowTrack");
const nowArtistEl = document.querySelector("#nowArtist");
const nowDurationEl = document.querySelector("#nowDuration");
const refreshButton = document.querySelector("#refreshButton");
const externalPlayLink = document.querySelector("#externalPlayLink");
const systemClock = document.querySelector("#systemClock");
const transferFile = document.querySelector("#transferFile");

let currentView = "search";

function updateClock() {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(now);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(now);
  systemClock.textContent = `${weekday} ${time}`;
}

function sizeFor(duration, index) {
  const [minutes, seconds] = duration.split(":").map(Number);
  const mb = ((minutes * 60 + seconds) * (index % 3 === 0 ? 0.031 : 0.024)) + 0.7;
  return `${mb.toFixed(1)} MB`;
}

function bitrateFor(index) {
  return index % 4 === 0 ? "192 kbps" : "128 kbps";
}

function playUrl(playlist, exactUrl) {
  return exactUrl || `https://open.spotify.com/playlist/${playlist.id}`;
}

function messyFileName(track, artist, index) {
  const base = `${artist} - ${track}`;
  const underscored = base.replace(/ /g, "_");
  const compact = base.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
  const variants = [
    `${underscored}_cd-rip_128.mp3`,
    `${artist} - ${track} (radio edit).mp3`,
    `${compact}__full__album__version.mp3`,
    `${artist}_${track}_wma-rip.mp3`,
    `${track} - ${artist} - good_quality.mp3`,
    `${artist} - ${track} [192k].mp3`,
    `${compact.toLowerCase()}_nap_share.mp3`,
    `${artist}--${track}--clean.mp3`,
    `${track}_${artist}_from_cd.mp3`,
    `${base}.mp3`
  ];
  return variants[index % variants.length];
}

function setNowPlaying(playlist, track, artist, duration, exactUrl) {
  nowTrackEl.textContent = track;
  nowArtistEl.textContent = artist;
  nowDurationEl.textContent = duration;
  externalPlayLink.href = playUrl(playlist, exactUrl);
}

function render(key) {
  const playlist = playlists[key];
  document.title = `${playlist.title} - BreakWire`;
  cover.src = playlist.cover;
  cover.alt = `${playlist.title} playlist cover`;
  nameEl.textContent = playlist.title;
  ownerEl.textContent = `${playlist.handle} shared folder`;
  countEl.textContent = playlist.tracks.length;
  titleEl.textContent = `${playlist.title}'s Shared MP3s`;
  subtitleEl.textContent = `${playlist.tracks.length} results found for "${playlist.title}" on BreakWire network`;
  windowTitleEl.textContent = `Search results for ${playlist.title}`;
  statusEl.textContent = `Ready - ${playlist.tracks.length} files indexed`;
  searchEl.value = `${playlist.title} playlist mp3`;
  setNowPlaying(playlist, playlist.tracks[0][0], playlist.tracks[0][1], playlist.tracks[0][2], playlist.tracks[0][3]);
  transferFile.textContent = messyFileName(playlist.tracks[Math.min(1, playlist.tracks.length - 1)][0], playlist.tracks[Math.min(1, playlist.tracks.length - 1)][1], 2);

  rows.innerHTML = playlist.tracks.map(([track, artist, duration, exactUrl], index) => {
    const file = messyFileName(track, artist, index);
    const selected = index === 0 ? " class=\"selected\"" : "";
    const href = playUrl(playlist, exactUrl);
    return `
      <tr${selected}>
        <td class="listen-cell"><a class="play-button" href="${href}" target="_blank" rel="noreferrer" aria-label="Play track">▶</a></td>
        <td class="num">${index + 1}</td>
        <td title="${file}">${file}</td>
        <td title="${artist}">${artist}</td>
        <td>${duration}</td>
        <td>${sizeFor(duration, index)}</td>
        <td>${bitrateFor(index)}</td>
        <td>${playlist.handle}</td>
      </tr>
    `;
  }).join("");

  rows.querySelectorAll("tr").forEach((row, index) => {
    row.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() === "a") return;
      rows.querySelectorAll("tr").forEach((item) => item.classList.remove("selected"));
      row.classList.add("selected");
      const [track, artist, duration, exactUrl] = playlist.tracks[index];
      setNowPlaying(playlist, track, artist, duration, exactUrl);
      setView("now-playing");
    });
  });
}

function setView(view) {
  currentView = view;
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  Object.entries(views).forEach(([key, element]) => {
    element.classList.toggle("active", key === view);
  });

  const playlist = playlists[select.value];
  if (view === "now-playing") {
    windowTitleEl.textContent = `Now playing - ${playlist.title}`;
    statusEl.textContent = `Playing ${playlist.tracks[0][1]} - ${playlist.tracks[0][0]}`;
  } else if (view === "downloads") {
    windowTitleEl.textContent = "Downloads";
    statusEl.textContent = "No active downloads";
  } else if (view === "chat") {
    windowTitleEl.textContent = "Chat";
    statusEl.textContent = "Channel idle";
  } else {
    windowTitleEl.textContent = `Search results for ${playlist.title}`;
    statusEl.textContent = `Ready - ${playlist.tracks.length} files indexed`;
  }
}

Object.entries(playlists).forEach(([key, playlist]) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = playlist.title;
  select.appendChild(option);
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.view));
});

async function refreshPlaylists(showStatus = true) {
  refreshButton.disabled = true;
  if (showStatus) statusEl.textContent = "Refreshing playlists...";

  try {
    const response = await fetch("/api/playlists", { cache: "no-store" });
    if (!response.ok) throw new Error("Refresh server unavailable");
    const fresh = await response.json();
    Object.entries(fresh).forEach(([key, value]) => {
      playlists[key] = { ...playlists[key], ...value };
    });
    render(select.value);
    setView(currentView);
    if (showStatus) statusEl.textContent = "Playlists refreshed";
  } catch (error) {
    if (showStatus) statusEl.textContent = "Refresh needs the local refresh server";
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", async () => {
  await refreshPlaylists(true);
});

select.addEventListener("change", () => {
  render(select.value);
  setView(currentView);
});
updateClock();
setInterval(updateClock, 30000);
render("leona");
refreshPlaylists(false);
