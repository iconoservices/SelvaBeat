const apis = [
    'https://piped-api.garudalinux.org',
    'https://pipedapi.official-esc.fr',
    'https://pipedapi.lunar.icu',
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.nicfab.eu',
    'https://pipedapi.leptons.xyz',
    'https://pipedapi.ducks.party'
];

async function testSearch() {
    for (const api of apis) {
        try {
            console.log(`Testing SEARCH: ${api}`);
            const res = await fetch(`${api}/search?q=maluma&filter=videos`, { signal: AbortSignal.timeout(5000) });
            if (res.ok) {
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    console.log(`✅ SEARCH SUCCESS: ${api}`);
                    // Test stream for the first item
                    const videoId = data.items[0].url.split('=')[1] || data.items[0].url.split('/').pop();
                    console.log(`Testing STREAM for ${videoId} on ${api}`);
                    const sRes = await fetch(`${api}/streams/${videoId}`, { signal: AbortSignal.timeout(5000) });
                    if (sRes.ok) {
                        const sData = await sRes.json();
                        if (sData.audioStreams && sData.audioStreams.length > 0) {
                            console.log(`💎 FULL SYSTEM OK: ${api}`);
                        }
                    }
                }
            }
            console.log(`❌ FAIL: ${api} (Status: ${res.status})`);
        } catch (e) {
            console.log(`❌ ERR: ${api} (${e.message})`);
        }
    }
}
testSearch();
