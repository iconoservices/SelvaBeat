const apis = [
    'https://pipedapi.recloud.it',
    'https://pipedapi.astre.me',
    'https://pipedapi.quantumnext.top',
    'https://pipedapi.rivm.dev',
    'https://api.piped.privacy.com.de',
    'https://pipedapi.moomoo.me',
    'https://pipedapi.synxt.org'
];

async function testFull() {
    for (const api of apis) {
        try {
            console.log(`Testing: ${api}`);
            const res = await fetch(`${api}/streams/dQw4w9WgXcQ`, { signal: AbortSignal.timeout(5000) });
            if (res.ok) {
                const data = await res.json();
                if (data.audioStreams && data.audioStreams.length > 0) {
                    console.log(`✅ FULL SYSTEM OK: ${api}`);
                }
            } else {
                console.log(`❌ FAIL: ${api} (Status: ${res.status})`);
            }
        } catch (e) {
            console.log(`❌ ERR: ${api} (${e.message})`);
        }
    }
}
testFull();
