const prod = true;

const config = {
    prod,
    base_url: prod ? 'http://127.0.0.1:3000' : 'http://localhost:3000'
};

export default config;