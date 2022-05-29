import Layout from "../components/Layout";

export default function About() {
    return <Layout>
        <div className="w-full">
            <div className="max-w-screen-xl mx-auto px-6">
                <div className="w-full">
                    <div className="text-center pb-8">
                        <h1 className="text-4xl font-semibold">API/Scripting</h1>
                    </div>
                    <p className="text-gray-700">MCStatus&apos; API is quite simple. There are two API endpoints, the most important one is <span className="pill">/api/status/:address</span> and he will tell you anything you need to know about any given Minecraft server. There are a few things to keep in mind though:</p>
                    <ul className="list-disc pl-4 my-4 leading-8 text-gray-700">
                        <li>The URI parameter <span className="pill">address</span> can only take an FQDN hostname or an IP address (v4/v6), with a port optionally appended to the end, seperated by a colon. E.g. <span className="pill">GET /api/status/mc.hypixel.net:25565</span> or just <span className="pill">GET /api/status/mc.hypixel.net</span>, since 25565 is the default port.</li>
                        <li>You can include two GET parameters with your request. They are <span className="pill">legacy</span>, for servers whose Minecraft version preceeds 1.7.2, and <span className="pill">bedrock</span>, for Bedrock servers. These two can only be <span className="pill">true</span> or <span className="pill">false</span>, if they are omitted they are assumed to be false. Additionally, they will <strong>not</strong> work if both are set to true in the same request.</li>
                        <li>This endpoint is rate limited at a rate of 3600 requests per hour. Effectively, 1 per second.</li>
                    </ul>
                    <p className="text-gray-700">The second endpoint is the favicon endpoint, <span className="pill">/api/icon/dynamic</span>. By default he will send you the default Minecraft server icon in PNG format, but you can include the GET parameter <span className="pill">address</span> (which works just like the address URI parameter on the status endpoint) to get the favicon of that specific server. Some examples (click them!):</p>
                    <div className="flex items-center gap-2 pt-4">
                        <a href="/api/icon/dynamic" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                            <img src="/api/icon/dynamic" style={{height: '64px', width: '64px'}} />
                            <p className="text-sm font-medium">Default</p>
                        </a>
                        <a href="/api/icon/dynamic?address=mc.hypixel.net" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                            <img src="/api/icon/dynamic?address=mc.hypixel.net" style={{height: '64px', width: '64px'}} />
                            <p className="text-sm font-medium">Hypixel</p>
                        </a>
                        <a href="/api/icon/dynamic?address=2b2t.org" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                            <img src="/api/icon/dynamic?address=2b2t.org" style={{height: '64px', width: '64px'}} />
                            <p className="text-sm font-medium">2b2t</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
}