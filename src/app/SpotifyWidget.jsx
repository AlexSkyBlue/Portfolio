export default function SpotifyWidget() {
    return (
        <div className="w-full max-w-4xl mb-10 rounded-2xl overflow-hidden shadow-2xl bg-black/20 backdrop-blur-sm p-1">
            <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/playlist/7AyBBsPxLttlGIAuBBXHyH?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            ></iframe>
        </div>
    );
}