const prod = true;

const config = {
    prod,
    base_url: prod ? 'https://mcstatus.co' : 'http://localhost:3000'
};

export default config;