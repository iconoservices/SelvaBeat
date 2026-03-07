async function searchYT(query) {
    try {
        const res = await fetch("https://www.youtube.com/results?search_query=" + encodeURIComponent(query));
        const html = await res.text();

        // Buscar el script que contiene ytInitialData
        const match = html.match(/var ytInitialData = ({.*?});<\/script>/);
        if (!match) {
            console.log("No data found in HTML.");
            return;
        }
        const data = JSON.parse(match[1]);

        // Extraer los videos de la jerarquía de `ytInitialData`
        const contents = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;

        const videos = contents.filter(c => c.videoRenderer).map(c => {
            const v = c.videoRenderer;
            return {
                videoId: v.videoId,
                title: v.title.runs[0].text,
                uploader: v.ownerText.runs[0].text,
                thumbnail: v.thumbnail.thumbnails[0].url
            };
        });

        console.log("Videos encontrados:", videos.length);
        console.log(videos.slice(0, 3));

    } catch (error) {
        console.error("Error:", error);
    }
}

searchYT("maluma");
