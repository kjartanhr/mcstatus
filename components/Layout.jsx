import Link from 'next/link'

export default function Layout({children}) {
    return(<>
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <div className="p-8">
                <div>
                    <Link href="/"><a className="text-4xl font-bold link">MCStatus</a></Link>
                </div>
            </div>
            <div className="flex flex-grow items-center">
                {children}
            </div>
            <div className="p-8 flex flex-col items-start md:flex-row md:items-center gap-4">
                <p className="text-gray-700">&copy; 2022 <a className="link" href="https://www.kjartan.io/" target="_blank" rel="noreferrer">Kjartan Hrafnkelsson</a></p>
                <div className="flex flex-grow justify-end gap-2 text-gray-700">
                    <Link href="/api-docs"><a className="footer-link">API</a></Link>
                    <a href="https://github.com/kjartanhr/mcstatus" target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
                    <Link href="/about"><a className="footer-link">About</a></Link>
                    <Link href="/privacy"><a className="footer-link">Privacy</a></Link>
                </div>
            </div>
        </div>
    </>);
}