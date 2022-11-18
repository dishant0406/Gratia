import { create } from 'ipfs-http-client';

const projectId = '2HiowWZxAvSRnGmeoMGFWYFQao5';
const projectSecret = '4b9253006dcd401f1051942f64c1a89d';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

export default client;