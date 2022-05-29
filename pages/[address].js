import config from '../config';
import Index from ".";

export default function SSR(props) {
    return <Index props={props} />
}

export async function getServerSideProps(context) {
    const {address, bedrock, legacy} = context.query;

    if (!address) return {redirect: {permanent: true, destination: '/'}};

    const [host, port = 25565] = address.split(':');

    const res = await fetch(config.base_url + '/api/status/' + host + (port ? ':' + port : '') + (legacy ? '?legacy=true' : '') + (bedrock ? '?bedrock=true' : ''));
    const data = await res.json();

    switch (res.status) {
        case 500: case 400:
            return {props: {data}};
        case 404:
            return {props: {data: {offline: true, query: {host, port}}}};
        case 200:
            return {props: {data}};
        default:
            return {redirect: {permanent: true, destination: '/'}};
    }
}