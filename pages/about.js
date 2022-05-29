import Layout from "../components/Layout";

export default function About() {
    return <Layout>
        <div className="w-full">
            <div className="max-w-screen-xl mx-auto px-6">
                <div className="w-full">
                    <div className="text-center pb-8">
                        <h1 className="text-4xl font-semibold">About MCStatus</h1>
                    </div>
                    <p className="text-gray-700">MCStatus is a web application that provides both a nice looking user-facing interface for querying the current status of Minecraft servers as well as gathering information about those same servers when they are queried. This is accomplished by communicating with the public backend API of the service, which runs code on the server side that makes a connection to the requested Minecraft servers and attempts to collect and return as much data as it can about the server.</p>
                    <p className="text-gray-700 mt-2">You may recognise this type of service from <a href="https://mcsrvstat.us/" className="link" target="_blank" rel="noreferrer">mcsrvstat.us</a>, and they were indeed the driving inspiration behind this site. We wanted to create a similar service, but one that would work (or at least feel) a bit faster and provide a nicer looking interface. On top we had the forethought of implementing meta tags for the server-side-rendered responses, where if you append the address (IP/hostname +- port) of the server you want to query at the end of this site&apos;s URL, you will see the information you requested in an &quot;embed&quot; on supported platforms such as Discord.</p>
                    <h2 className="text-2xl font-semibold my-4">Credits</h2>
                    <p className="text-gray-700">While it certainly would be interesting to attempt to write all the software for this project on our own, it would definitely not be practical. As such we believe we owe it to the people who contributed to the libraries we&apos;re using here to thank them:</p>
                    <ul className="list-disc pl-4 mt-4 leading-8 text-gray-700">
                        <li><a href="https://passthemayo.gitbook.io/minecraft-server-util/" className="link" target="_blank" rel="noreferrer">minecraft-server-util</a> &mdash; Minecraft protocol querying functions</li>
                        <li><a href="https://www.npmjs.com/package/@sfirew/mc-motd-parser" className="link" target="_blank" rel="noreferrer">@sfirew/mc-motd-parser</a> &mdash; Parsing various strings encoded with Minecraft colour codes</li>
                        <li><a href="https://www.npmjs.com/package/ping" className="link" target="_blank" rel="noreferrer">ping</a> &mdash; Sending ICMP packets to remote hosts</li>
                        <li><a href="https://www.npmjs.com/package/validator" className="link" target="_blank" rel="noreferrer">validator</a> &mdash; Checking for valid FQDN&apos;s and IP addresses</li>
                        <li><a href="https://www.npmjs.com/package/isomorphic-dompurify" className="link" target="_blank" rel="noreferrer">isomorphic-dompurify</a> &mdash; Sanitizing MOTD & infobox output on the server & client side.</li>
                        <li><a href="https://tailwindcss.com/" className="link" target="_blank" rel="noreferrer">tailwindcss</a> &mdash; Styling & forms</li>
                        <li><a href="https://heroicons.dev/" className="link" target="_blank" rel="noreferrer">Heroicons</a> &mdash; Icons</li>
                        <li><a href="https://nextjs.org/" className="link" target="_blank" rel="noreferrer">NextJS</a> &mdash; Framework</li>
                    </ul>
                    <h2 className="text-2xl font-semibold my-4">Open Source</h2>
                    <p className="text-gray-700">I have published all of my source code for this project on <a href="https://github.com/kjartanhr/mcstatus" className="link" target="_blank" rel="noreferrer">GitHub</a>, you are free to toy with it and contribute to it. Currently I have no experience dealing with 3rd party contributors, so if anyone would like to explain to me how that whole proccess works please feel free to reach out via email, <a href="mailto:kjartan@kjartann.is" className="link">kjartan@kjartann.is</a>.</p>
                    <h2 className="text-2xl font-semibold my-4">Bugs / issues / vulnerabilities</h2>
                    <p className="text-gray-700">If you find any bugs or issues with the project, you are free to fix them yourself and submit a pull request on <a href="https://github.com/kjartanhr/mcstatus" className="link" target="_blank" rel="noreferrer">GitHub</a> or you can simply report them in the issues tab on the same repository.</p>
                    <p className="text-gray-700 mt-2">If you find any security vulnerabilities at all, whether it be in the source code or whilst using the site, please be considerate and report them to me privately by email, <a href="mailto:kjartan@kjartann.is" className="link">kjartan@kjartann.is</a>.</p>
                </div>
            </div>
        </div>
    </Layout>
}