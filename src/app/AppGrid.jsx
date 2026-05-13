export default function AppGrid({ apps, onOpenFolder, onCopyGmail }) {
    return (
        <div className="grid grid-cols-5 gap-7 w-full max-w-4xl place-items-center">
            {apps.map(item => {
                // Renderizado si es una CARPETA
                if (item.type === 'folder') {
                    return (
                        <div key={item.id} onClick={() => onOpenFolder(item.id)} className="flex flex-col items-center cursor-pointer group active:scale-95 transition-transform">
                            <div className="w-16 h-16 bg-white/40 backdrop-blur-md rounded-2xl border border-white/30 grid grid-cols-2 p-2 gap-1 shadow-lg overflow-hidden">
                                <div className="bg-pink-500 rounded-sm scale-75"></div>
                                <div className="bg-cyan-500 rounded-sm scale-75"></div>
                                <div className="bg-yellow-400 rounded-sm scale-75"></div>
                                <div className="bg-blue-500 rounded-sm scale-75 opacity-50"></div>
                            </div>
                            <span className="mt-2 text-[13px] text-gray-900 font-medium">{item.name}</span>
                        </div>
                    );
                }

                // Renderizado si es una APP normal
                return (
                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group"
                        onClick={item.isGmail ? (e) => { e.preventDefault(); onCopyGmail(); } : undefined}>
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            {item.icon}
                        </div>
                        <span className="mt-2 text-[13px] text-gray-900 drop-shadow font-medium">{item.name}</span>
                    </a>
                );
            })}
        </div>
    );
}