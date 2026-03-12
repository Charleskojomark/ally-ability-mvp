export default function WidgetDemoPage() {
    const embedCode = `<script src="https://your-domain.com/widget/ally-engine.js" data-api-key="YOUR_API_KEY"></script>`;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-slate-900 mb-3">
                    Ally-Engine Widget
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                    Bring instant accessibility to any website. Our embeddable widget gives your users control over
                    contrast, font readability, and text size — with zero configuration.
                </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="text-3xl mb-3">🔲</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">High Contrast</h3>
                    <p className="text-sm text-slate-600">WCAG AAA-level contrast mode with pure black/yellow theme for maximum readability.</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="text-3xl mb-3">🔤</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Dyslexia Font</h3>
                    <p className="text-sm text-slate-600">Switches to Lexend/OpenDyslexic with increased letter and word spacing for easier reading.</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="text-3xl mb-3">🔍</div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Text Scaling</h3>
                    <p className="text-sm text-slate-600">Two-level text size increase (118% and 135%) for users with low vision.</p>
                </div>
            </div>

            {/* Integration Guide */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Getting Started</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-2">1. Get your API Key</h3>
                        <p className="text-slate-600 text-sm">
                            Contact us at <span className="font-mono text-primary">partners@ally-ability.com</span> to register your organisation and receive an API key.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-800 mb-2">2. Add the Script Tag</h3>
                        <p className="text-slate-600 text-sm mb-3">
                            Paste this single line before the closing <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag on your website:
                        </p>
                        <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <code>{embedCode}</code>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-slate-800 mb-2">3. Done!</h3>
                        <p className="text-slate-600 text-sm">
                            The floating accessibility button will appear on your site. User preferences are saved locally, and usage analytics are sent to your dashboard automatically.
                        </p>
                    </div>
                </div>
            </div>

            {/* Live Preview Notice */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
                <p className="text-indigo-800 font-bold text-lg mb-2">Live Preview</p>
                <p className="text-indigo-700 text-sm">
                    The Ally-Engine widget is already running on this page in demo mode. Look for the ♿ button in the bottom-left corner!
                </p>
            </div>
        </div>
    );
}
