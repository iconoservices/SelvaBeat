async function fetchYTStore(query) {
    const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36", "Accept-Language": "es-MX,es" }
    });
    const html = await res.text();
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/);
    if (match) {
        const data = JSON.parse(match[1]);
        const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;
        if (contents) {
            const items = contents.filter(c => c.videoRenderer).map(c => {
                const v = c.videoRenderer;

                // Convertir duración de "3:45" o "1:02:10" a segundos.
                let durText = "0:00";
                if (v.lengthText && v.lengthText.simpleText) {
                    durText = v.lengthText.simpleText;
                } else if (v.lengthText && v.lengthText.runs && v.lengthText.runs.length > 0) {
                    durText = v.lengthText.runs[0].text;
                }
                let dur = 0;
                const p = durText.split(':').reverse();
                if (p[0]) dur += parseInt(p[0], 10);
                if (p[1]) dur += parseInt(p[1], 10) * 60;
                if (p[2]) dur += parseInt(p[2], 10) * 3600;

                return {
                    videoId: v.videoId,
                    title: v.title?.runs?.[0]?.text || "Sin Título",
                    uploaderName: v.ownerText?.runs?.[0]?.text || "Desconocido",
                    duration: dur,
                    thumbnail: v.thumbnail?.thumbnails?.[0]?.url || ""
                };
            });
            console.log("Found:", items.length);
            console.log(items[0]);
            return items;
        }
    }
    console.log("No data");
}
fetchYTStore("maluma");
