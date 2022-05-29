import { status, statusBedrock, statusLegacy } from 'minecraft-server-util';
import { resolve as dns_resolve } from 'dns'
import isIP from 'validator/lib/isIP'
import ping from 'ping'

// java options
const options = {
    timeout: 1000 * 2.5, // timeout in milliseconds
    enableSRV: true // SRV record lookup
};

// avoid repetitive erroring function
function iError(e, res) {
	switch (e.message) {
		case 'Timed out while retrieving server status':
			return res.status(404).json({error: 'Timeout reached whilst querying server.'});
		default:
			if (e.code) {
				res.status(404).json({error: 'Could not connect to requested port.'});
			} else return res.status(500).json({error: 'Internal exception occurred whilst querying server.'});
	}
}

// function for returning the result as JSON with the resolved IP address & ICMP info
async function JSONResponse(res, json, ip_address) {
	const ip = await (() => {
		return new Promise((resolve) => {
			if (!ip_address) dns_resolve(json.srvRecord.host, (err, addresses) => {
				if (err) return resolve(null);
				if (addresses.length === 0) return resolve(null);
				else resolve(addresses[0]);
			}); else resolve(ip_address);
		})
	})();

	const icmp = await (() => {
		return new Promise((resolve) => {
			if (!ip_address) resolve(false);
			else ping.promise.probe(ip_address, {timeout: 1}).then((icmp_res => {
				resolve(icmp_res ? icmp_res.alive : false);
			}));
		});
	})();

	return res.json({...json, ip_address: ip, icmp})
}

export default async function handler(req, res) {
	const {address, legacy, bedrock} = req.query;

	// error safety
	if (legacy == 'true' && bedrock == 'true') return res.status(400).json({error: 'Cannot attempt legacy query to bedrock server.'});
	if (!address) return res.status(400).send({error: 'Missing address parameter'});

	// destructure host & port + some bedrock logic, as well as avoid repeating the query object in our responses
	const [host, port = (bedrock == 'true' ? 19132 : 25565)] = address.split(':');
	const query = {host, port, legacy: legacy == 'true', bedrock: bedrock == 'true'}

	// find the IP address of the hostname, if it isn't one
	const ip_address = await (() => {
		return new Promise((resolve) => {
			if (isIP(host)) resolve(host);
			else dns_resolve(host, (err, addresses) => {
				if (err) return resolve(false);
				if (addresses.length === 0) return resolve(false);
				else resolve(addresses[0]);
			});
		});
	})();

	// bedrock is on a different protocol, so we have to call a different function to retrieve a bedrock server's status
	if (bedrock == 'true') statusBedrock(host, parseInt(port), {enableSRV: true})
		// the bedrock response provides the serverGUID value as a bigInt, so we have to stringify it
		.then(result => JSONResponse(res, {query, ...{...result, serverGUID: result.serverGUID.toString()}}, ip_address))
		.catch(e => iError(e, res));
	else {
		// older servers use an outdated protocol, hence the conditional for seperate function calls
		if (legacy == 'true') statusLegacy(host, parseInt(port), options)
			.then(result => JSONResponse(res, {query, ...result}, ip_address))
			.catch(e => iError(e, res));
		else status(host, parseInt(port), options)
			.then(result => JSONResponse(res, {query, ...result}, ip_address))
			.catch(e => iError(e, res));
	}
}