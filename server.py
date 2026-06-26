from html import unescape
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import re
import urllib.parse
import urllib.request


PLAYLISTS = {
    "leona": {
        "title": "Leona",
        "owner": "Celene Cornelia",
        "id": "14IMVM1ss8P87xAUH4Y6UK",
        "cover": "assets/leona.jpg",
        "handle": "copydesk_queen",
    },
    "bernard": {
        "title": "Bernard",
        "owner": "Caitie Mccollow",
        "id": "43sB8K6xzSYkdF6eUdU3ng",
        "cover": "assets/bernard.jpg",
        "handle": "bernardcare69",
    },
    "vivienne": {
        "title": "Vivienne",
        "owner": "Caitie Mccollow",
        "id": "1k5mPfSLddHEsR5WjhxSAK",
        "cover": "assets/vivienne.jpg",
        "handle": "vivienne_onboard",
    },
    "sophia": {
        "title": "Sophia",
        "owner": "Caitie Mccollow",
        "id": "6lBTJIFgR07N44cLiEG2zG",
        "cover": "assets/sophia.jpg",
        "handle": "miniDV_soph",
    },
}


def clean(value):
    without_tags = re.sub(r"<[^>]+>", "", value)
    return unescape(without_tags).replace("\xa0", " ").strip()


def fetch_playlist(playlist):
    url = f"https://open.spotify.com/embed/playlist/{playlist['id']}"
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=15) as response:
        html = response.read().decode("utf-8", errors="replace")

    tracks = tracks_from_page_data(html)
    if not tracks:
        pattern = re.compile(
            r'<li class="TracklistRow[\s\S]*?<h3[^>]*>([\s\S]*?)</h3>'
            r"<h4[^>]*>([\s\S]*?)</h4>"
            r'<div[^>]*data-testid="duration-cell">([^<]+)</div></li>'
        )
        for match in pattern.finditer(html):
            title = clean(match.group(1))
            artist = re.sub(r"^E(?=[A-Z0-9])", "", clean(match.group(2)))
            duration = clean(match.group(3))
            tracks.append([title, artist, duration])

    refreshed = dict(playlist)
    refreshed["tracks"] = tracks
    return refreshed


def duration_label(milliseconds):
    seconds = int(round(milliseconds / 1000))
    return f"{seconds // 60:02d}:{seconds % 60:02d}"


def tracks_from_page_data(html):
    match = re.search(
        r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>',
        html,
    )
    if not match:
        return []

    data = json.loads(unescape(match.group(1)))
    entity = data["props"]["pageProps"]["state"]["data"]["entity"]
    rows = []
    for item in entity.get("trackList", []):
        uri = item.get("uri", "")
        track_id = uri.rsplit(":", 1)[-1] if uri.startswith("spotify:track:") else ""
        rows.append([
            item.get("title", ""),
            item.get("subtitle", ""),
            duration_label(item.get("duration", 0)),
            f"https://open.spotify.com/track/{track_id}" if track_id else "",
        ])
    return rows


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/api/playlists"):
            payload = {
                key: fetch_playlist(playlist)
                for key, playlist in PLAYLISTS.items()
            }
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(json.dumps(payload).encode("utf-8"))
            return

        if self.path.startswith("/play"):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            track_id = params.get("t", [""])[0]
            if track_id:
                target = "https://open.spotify.com/track/" + urllib.parse.quote(track_id)
            else:
                query = params.get("q", [""])[0]
                target = "https://open.spotify.com/search/" + urllib.parse.quote(query)
            self.send_response(302)
            self.send_header("Location", target)
            self.end_headers()
            return

        super().do_GET()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("localhost", 4174), Handler)
    print("Serving BreakWire on http://localhost:4174/")
    server.serve_forever()
