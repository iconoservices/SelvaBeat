import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCABaNkvULmjBatNh0Giih01IDH4sNbt1Q",
    authDomain: "selvaflix-5d991.firebaseapp.com",
    projectId: "selvaflix-5d991",
    storageBucket: "selvaflix-5d991.firebasestorage.app",
    messagingSenderId: "935630160406",
    appId: "1:935630160406:web:171ecfcb9e4258628bab37",
    measurementId: "G-N4DRH9QPE3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const moviesCol = collection(db, "movies");

const movies = [
    { title: "El Planeta de los Simios: Nuevo Reino", tmdbId: "653346", img: "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg", year: "2024", rating: "7.1", type: "movie" },
    { title: "Intensa-Mente 2", tmdbId: "1022789", img: "https://image.tmdb.org/t/p/w500/jL5Z1tXf3i5xIeMhL31Z5u7X9nN.jpg", year: "2024", rating: "7.7", type: "movie" },
    { title: "Deadpool & Wolverine", tmdbId: "533535", img: "https://image.tmdb.org/t/p/w500/9yZexEqx8A1g21wA8oB1vXIfHIf.jpg", year: "2024", rating: "7.8", type: "movie" },
    { title: "Furiosa: de la saga Mad Max", tmdbId: "786892", img: "https://image.tmdb.org/t/p/w500/sO1AXoeb6yMttKqFInIih3oTYM5.jpg", year: "2024", rating: "7.6", type: "movie" },
    { title: "Kung Fu Panda 4", tmdbId: "1011985", img: "https://image.tmdb.org/t/p/w500/z6csQ6G1kO6E0S3nK9xN72m1h5X.jpg", year: "2024", rating: "7.1", type: "movie" },
    { title: "Godzilla x Kong", tmdbId: "823464", img: "https://image.tmdb.org/t/p/w500/v937YvYSICD8vS9LntR7E5iNfU5.jpg", year: "2024", rating: "7.2", type: "movie" },
    { title: "Garfield: Fuera de casa", tmdbId: "748783", img: "https://image.tmdb.org/t/p/w500/pY0LqGjAUPYmS62BqU1I6L0T2QY.jpg", year: "2024", rating: "6.5", type: "movie" },
    { title: "Bad Boys: Ride or Die", tmdbId: "573435", img: "https://image.tmdb.org/t/p/w500/o9O8989F7wB4rO08R8uJ6m8y6u.jpg", year: "2024", rating: "7.0", type: "movie" },
    { title: "Duna: Parte Dos", tmdbId: "693134", img: "https://image.tmdb.org/t/p/w500/8Ym86w8AJPshAnVfL3vW8J4K6B.jpg", year: "2024", rating: "8.3", type: "movie" },
    { title: "Mi villano favorito 4", tmdbId: "748167", img: "https://image.tmdb.org/t/p/w500/w99S6uP7oP9vWpT8GfO7vO2kQ.jpg", year: "2024", rating: "7.2", type: "movie" },
    // Series (Usando IDs de TV de TMDB)
    { title: "The Boys", tmdbId: "76479", img: "https://image.tmdb.org/t/p/w500/77v937YvYSICD8vS9LntR7E5iNfU5.jpg", year: "2019", rating: "8.5", type: "series" },
    { title: "House of the Dragon", tmdbId: "94997", img: "https://image.tmdb.org/t/p/w500/77v937YvYSICD8vS9LntR7E5iNfU5.jpg", year: "2022", rating: "8.4", type: "series" },
    { title: "The Bear", tmdbId: "136315", img: "https://image.tmdb.org/t/p/w500/77v937YvYSICD8vS9LntR7E5iNfU5.jpg", year: "2022", rating: "8.7", type: "series" },
    { title: "Fallout", tmdbId: "125392", img: "https://image.tmdb.org/t/p/w500/77v937YvYSICD8vS9LntR7E5iNfU5.jpg", year: "2024", rating: "8.3", type: "series" },
    { title: "Shogun", tmdbId: "111110", img: "https://image.tmdb.org/t/p/w500/77v937YvYSICD8vS9LntR7E5iNfU5.jpg", year: "2024", rating: "8.5", type: "series" },
    // Canales (M3U - Usaremos el mismo collection para simplicidad)
    { title: "Latina TV", img: "https://via.placeholder.com/600x400/000000/FFFFFF?text=LATINA+TV", embed: "https://latina-live.com/stream.m3u8", type: "live" },
    { title: "America TV", img: "https://via.placeholder.com/600x400/000000/FFFFFF?text=AMERICA+TV", embed: "https://america-live.com/stream.m3u8", type: "live" },
    { title: "ATV", img: "https://via.placeholder.com/600x400/000000/FFFFFF?text=ATV", embed: "https://atv-live.com/stream.m3u8", type: "live" }
];

async function run() {
    const snapshot = await getDocs(moviesCol);
    for (const movieDoc of snapshot.docs) {
        await deleteDoc(doc(db, "movies", movieDoc.id));
    }
    console.log("Database cleared.");

    for (let i = 0; i < movies.length; i++) {
        const m = movies[i];
        await addDoc(moviesCol, {
            ...m,
            status: 'healthy',
            createdAt: Date.now() - (i * 1000)
        });
        console.log("Added:", m.title);
    }
    process.exit(0);
}
run();
