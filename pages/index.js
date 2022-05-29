import Head from 'next/head'
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/outline'
import Layout from '../components/Layout'
import { motdParser } from '@sfirew/mc-motd-parser'
import { useState, useEffect } from "react";
import isFQDN from 'validator/lib/isFQDN'
import isIP from 'validator/lib/isIP'
import DOMPurify from 'isomorphic-dompurify';

export default function Index(props) {
	const [showCard, setShowCard] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(props?.props?.error || null);
	const [data, setData] = useState();
	const [bedrock, setBedrock] = useState(false);
	const [legacy, setLegacy] = useState(false);

	useEffect(() => {
		if (props?.props?.data) {
			setData(props?.props?.data);
			setShowCard(true);
		}
	}, [props]);
	
	function handleSubmit(e) {
		e.preventDefault();
		
		const [host, port] = e.target[0].value.split(':');

		if (isIP(host) || isFQDN(host)) {
			setError(null);
			setLoading(true);
			fetch('/api/status/' + host + (port ? ':' + port : '') + (legacy ? '?legacy=true' : '') + (bedrock ? '?bedrock=true' : '')).then(async res => {
				const data = await res.json();

				switch (res.status) {
					case 500: case 400:
						setError(data.error);
						break;
					case 404:
						console.log('hello')
						setData({offline: true, query: {host, port}});
						setShowCard(true);
						break;
					case 200:
						setData(data);
						setShowCard(true);
						break;
				}
				setLoading(false);
				setBedrock(false);
				setLegacy(false);

				if (typeof window !== undefined && !bedrock && !legacy && data?.query) {
					let link = document.querySelector("link[rel~='icon']");
					if (!link) {
						link = document.createElement('link');
						link.rel = 'icon';
						document.getElementsByTagName('head')[0].appendChild(link);
					}
					link.href = '/api/icon/dynamic?address=' + data.query.host + ':' + data.query.port;
				}
			})
		} else {
			setError('We can only work with a valid FQDN hostname or IP address (v4/v6)');
		}
	}

    return (
		<Layout>
			<Head>
				<meta content="MCStatus" property="og:site_name" />
				{data ? <>
					<title>
						{data.query.host ? data.query.host : ''}{data.query.port && data.query.port !== 25565 ? ':' + data.query.port : ''}{data.query.host || data.query.port ? ' | ' : ''}MCStatus
					</title>
				</> : <>
					<title>
						{(props?.props?.data && !props?.props?.data.error) ? props.props.data.query.host + (props.props.data.query.port !== 25565 ? ':' + props.props.data.query.port : '') + ' | ' : ''}MCStatus
					</title>

					{(props?.props?.data && !props?.props?.data.offline && !props?.props?.data.eror) && <>
						<meta name="title" content={
							props.props.data.query.host + (props.props.data.query.port !== 25565 ? ':' + props.props.data.query.port : '') + ' | MCStatus'
						} />
						<meta name="description" content={props.props.data.query.host + ' is currently online and has ' + props.props.data.players.online + ' online players out of ' + props.props.data.players.max + '.'} />

						<meta property="og:type" content="website" /> 
						<meta property="og:url" content="https://mcstatus.co/" />
						<meta property="og:title" content={
							props.props.data.query.host + (props.props.data.query.port !== 25565 ? ':' + props.props.data.query.port : '') + ' | MCStatus'
						} />
						<meta property="og:description" content={props.props.data.query.host + ' is currently online and has ' + props.props.data.players.online + ' online players out of ' + props.props.data.players.max + '.'} />
						<meta property="og:image" content={data?.favicon && '/api/icon/dynamic?address=' + props.props.data.query.host + ':' + props.props.data.query.port || '/api/icon/dynamic?address=default'} />
					</>}

					{(props?.props?.data.offline) && <>
						<meta name="title" content={
							props.props.data.query.host + (props.props.data.query.port !== 25565 ? ':' + props.props.data.query.port : '') + ' | MCStatus'
						} />
						<meta name="description" content={props.props.data.query.host + ' is currently offline.'} />

						<meta property="og:type" content="website" /> 
						<meta property="og:url" content="https://mcstatus.co/" />
						<meta property="og:title" content={
							props.props.data.query.host + (props.props.data.query.port !== 25565 ? ':' + props.props.data.query.port : '') + ' | MCStatus'
						} />
						<meta property="og:description" content={props.props.data.query.host + ' is currently offline.'} />
						<meta property="og:image" content={data?.favicon && '/api/icon/dynamic?address=' + props.props.data.query.host + ':' + props.props.data.query.port || '/api/icon/dynamic?address=default'} />
					</>}
					<link rel="icon" href={data?.favicon && '/api/icon/dynamic?address=' + props.props.data.query.host + ':' + props.props.data.query.port || '/api/icon/dynamic?address=default'} />
				</>}
			</Head>
			<div className="w-full">
				<div className="max-w-screen-xl mx-auto px-6">
					<div className="w-full">
						<div className="text-center pb-8">
							<h1 className="text-4xl font-semibold">Minecraft Server Status</h1>
							<p className="text-gray-700 mt-4">A fast API-driven alternative to <a href="https://mcsrvstat.us/" target="_blank" className="link" rel="noreferrer">mcsrvstat.us</a>, because having alternatives often comes in handy 🥰</p>
						</div>
						<div className="max-w-lg mx-auto">
							{error && <p className="text-red-600 text-center text-sm mb-4">{error}</p>}
							<form onSubmit={handleSubmit}>
								<div className="flex items-center gap-2">
									<input name="resource" type="text" placeholder="Enter hostname or IP address" className="bg-gray-100 h-16 px-4 rounded shadow w-full border border-gray-100 focus:outline-none focus-visible:border-blue-600 transition duration-150" onChange={() => setError(null)} />
									<button type="submit" className="bg-indigo-500 h-16 w-20 flex items-center justify-center rounded shadow hover:opacity-90 transition duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:ring-opacity-50">
										{loading ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg> :
										<ArrowRightIcon className="h-6 w-6 text-white" />}
									</button>
								</div>
								<div className="pt-2 flex items-center gap-4">
									<div>
										<input type="checkbox" id="bedrock" className="form-checkbox rounded text-indigo-500 border-gray-300 -mt-0.5 mr-1.5" checked={bedrock} onChange={() => {if (legacy && !bedrock) {setLegacy(false); setBedrock(true)} else setBedrock(!bedrock)}} />
										<label htmlFor="bedrock" className="text-gray-700">Bedrock server</label>
									</div>
									<div>
										<input type="checkbox" id="legacy" className="form-checkbox rounded text-indigo-500 border-gray-300 -mt-0.5 mr-1.5" checked={legacy} onChange={() => {if (bedrock && !legacy) {setBedrock(false); setLegacy(true)} else setLegacy(!legacy)}} />
										<label htmlFor="legacy" className="text-gray-700">Legacy server</label>
									</div>
								</div>
							</form>
						</div>
						<Card hidden={!showCard} res={data} />
					</div>
				</div>
			</div>
		</Layout>
    );
}

export function Card({hidden, res}) {
	const [expanded, setExpanded] = useState(false);

	function createInfoMarkup(info) {
		let r = '';
		info.map((e, i) => {
			r += motdParser.autoToHtml(e.name) + (i + 1 == e.length ? '' : '<br />')
		});
		return r;
	}

	if (res?.offline) return <div className={`max-w-3xl mx-auto pt-8 ${hidden && 'hidden'}`}>
		<div className="shadow rounded">
			<div className="px-6 pt-6 bg-white rounded-t">
				<div className="flex">
					<h2 className="text-2xl font-semibold">{res.query.host} <span className="pill-red text-base uppercase">Offline</span></h2>
					<div className="flex flex-grow justify-end">
						<div className="bg-black rounded" style={{height: '64px', width: '64px'}}>
							<img src="/api/icon/dynamic?address=default" className="rounded blur-sm" />
						</div>
					</div>
				</div>
				<div>
					<p className="font-medium mb-2">MOTD</p>
					<div className="bg-black p-2 whitespace-pre-wrap font-mono rounded inline-block">
						<span className="blur-sm" dangerouslySetInnerHTML={{__html: `<span style="color: #AAAAAA; font-weight: bold; font-style: italic;">2B </span><span style="color: #FFAA00;">I just stole 2b2t's MOTD haha</span><span style="color: #FFFFFF;"><br /></span><span style="color: #AAAAAA; font-weight: bold; font-style: italic;">2T</span>`}}></span>
					</div>
				</div>
				<div className="pt-4">
					<div className="grid grid-cols-6 gap-4">
						<p className="font-medium col-span-2">Players online:</p>
						<div className="col-span-4">
							<span className="pill-red">- / -</span>
						</div>
					</div>
				</div>
				<div className="pt-2 pb-4">
					<div className="grid grid-cols-6 gap-4">
						<p className="font-medium col-span-2">Version:</p>
						<div className="col-span-4">
							<span className="pill-red">--</span>
						</div>
					</div>
				</div>
			</div>
			<p className="cursor-not-allowed rounded bg-white w-full flex items-center justify-center p-4 border-t border-gray-100 text-sm font-medium hover:bg-opacity-50 transition duration-150"><div className="flex items-center gap-2 opacity-50">Expand <ChevronDownIcon className="h-4 w-4 transform" /></div></p>
		</div>
	</div>
	else if (!hidden) return <div className={`max-w-3xl mx-auto pt-8 ${hidden && 'hidden'}`}>
		<div className="shadow rounded">
			<div className="px-6 pt-6 bg-white rounded-t">
				<div className="flex">
					<h2 className="text-2xl font-semibold">{res.query.host}{res.query.port !== 25565 ? ':' + res.query.port : ''} <span className="pill text-base uppercase">Online</span></h2>
					<div className="flex flex-grow justify-end">
						<div className="bg-black rounded" style={{height: '64px', width: '64px'}}>
							<img src={res.favicon || '/api/icon/dynamic?address=default'} className="rounded" />
						</div>
					</div>
				</div>
				<div>
					<p className="font-medium mb-2">MOTD</p>
					<div className="bg-black p-2 whitespace-pre-wrap font-mono rounded inline-block">
						<span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(res.motd.html)}}></span>
					</div>
				</div>
				{(res.players?.sample?.length > 0 && res.players.sample.filter(e => /^[a-zA-Z0-9_]{2,16}$/g.test(e)).length == 0) && <div className="pt-4">
					<p className="font-medium mb-2">Infocard:</p>
					<div className="bg-black p-2 whitespace-pre-wrap font-mono rounded inline-block">
						<span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(createInfoMarkup(res.players.sample))}}></span>
					</div>
				</div>}
				<div className="pt-4">
					<div className="grid grid-cols-6 gap-4 pb-2">
						<p className="font-medium col-span-2">Players online:</p>
						<div className="col-span-4">
							<span className="pill">{res.players.online} / {res.players.max}</span>
						</div>
					</div>
				</div>
				<div className="pb-4">
					<div className="grid grid-cols-6 gap-4">
						<p className="font-medium col-span-2">Version:</p>
						<div className="col-span-4">
							<span className="pill">{res.version.name}</span>
						</div>
					</div>
				</div>
			</div>
			<div className={expanded ? 'block px-6 pb-6 bg-white' : 'hidden'}>
				<div>
					<div className="grid grid-cols-6 gap-4 -mt-2">
						<p className="font-medium col-span-2">Hostname:</p>
						<div className="col-span-4">
							<span className="pill">{res?.srvRecord?.host || res.query.host}</span>
						</div>
					</div>
					<div className="grid grid-cols-6 gap-4 pt-2">
						<p className="font-medium col-span-2">IP Address:</p>
						<div className="col-span-4">
							<span className="pill">{res.ip_address}</span>
						</div>
					</div>
					<div className="grid grid-cols-6 gap-4 pt-2">
						<p className="font-medium col-span-2">Server port:</p>
						<div className="col-span-4">
							<span className="pill">{res?.srvRecord?.port || res.query.port}</span>
						</div>
					</div>
					<div className="grid grid-cols-6 gap-4 pt-2">
						<p className="font-medium col-span-2">SRV Record:</p>
						<div className="col-span-4">
							{res.srvRecord ? <span className="pill">Yes</span> :
							<span className="pill-red">No</span>}
						</div>
					</div>
					<div className="grid grid-cols-6 gap-4 pt-2">
						<p className="font-medium col-span-2">Host replies on ICMP</p>
						<div className="col-span-4">
							{res.icmp ? <span className="pill">Yes</span> :
							<span className="pill-red">No</span>}
						</div>
					</div>
					<div className="grid grid-cols-6 gap-4 pt-2">
						<p className="font-medium col-span-2">Bedrock</p>
						<div className="col-span-4">
							{res.query.bedrock ? <span className="pill">Yes</span> :
							<span className="pill-red">No</span>}
						</div>
					</div>
					<div className="grid grid-cols-6 gap-4 pt-2">
						<p className="font-medium col-span-2">Legacy</p>
						<div className="col-span-4">
							{res.query.legacy ? <span className="pill">Yes</span> :
							<span className="pill-red">No</span>}
						</div>
					</div>
				</div>
			</div>
			<button onClick={() => setExpanded(!expanded)} className="rounded bg-white w-full flex items-center justify-center gap-2 p-4 border-t border-gray-100 text-sm font-medium hover:bg-opacity-50 transition duration-150">Expand <ChevronDownIcon className={`h-4 w-4 transform ${expanded ? 'rotate-180' : 'rotate-0'} transition duration-150`} /></button>
		</div>
	</div>
}