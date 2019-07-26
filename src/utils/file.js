import P2P from './connection.js'

export default class FileTransfer {
    constructor( prefix, sender ) {
        this.prefix = prefix;

        this.ws = new WebSocket('ws://127.0.0.1:3000/bootstrap');
        this.ws.onopen = () => {
            console.log(`ws is open`);
            this.ws.send(JSON.stringify({
                op:'nop',
                from:this.p2p.get_hex_key().publicKey,
                to:this.p2p.get_hex_key().publicKey,
            }))
        }
        this.first = false;
        this.p2p = new P2P( {
            handlers: {
                send_bootstrap: (pk, data) => {
                    let signal = {
                        from: this.p2p.get_hex_key().publicKey,
                        to: pk,
                        data: data,
                        op: 'signal',
                    }
                    this.ws.send(JSON.stringify(signal));
                },
                connected: (pk) => {
                    console.log(`connected ${pk}`);
                    if (! sender) {
                        let file_info = {
                            op:'meta',
                        }
                        this.first = 'true';
                        this.p2p.send(pk,JSON.stringify(file_info));
                    }
                },
                recv_data: (pk, data) => {
                    console.log(`receive data from ${pk}`);
                    let d = Buffer.from(data).toString()
                    if ( sender ) {
                        let m = JSON.parse(d);
                        console.log(m)
                        if (m.op === 'meta') {
                            let file_info = {
                                name: this.files.name,
                                size: this.files.size,
                                type: this.files.type,
                            }
                            this.p2p.send(pk, JSON.stringify(file_info));
                        } else if (m.op === 'query') {
                            this.onprocess(m.begin, this.files.size);
                            let segment = this.files.slice(m.begin, m.end);
                            let reader = new FileReader();
                            reader.onloadend = (e) => {
                                console.log(e.target.result)
                                this.p2p.send(pk, e.target.result);
                                this.onprocess(m.end, this.files.size);
                            };
                            reader.readAsArrayBuffer(segment);
                        }
                    } else {
                        if (this.first === 'true') {
                            let d = Buffer.from(data).toString()
                            let m = JSON.parse(d);
                            console.log(m)
                            this.file_info = m;
                            this.first = 0;
                        } else {
                            let d = Buffer.from(data).toString()
                            console.log(d)
                        }
                        console.log('asdasda',this.first)
                        if ( this.first !== 'true' && this.first < this.file_info.size) {
                            let query = {
                                op: 'query',
                                begin: this.first === 'true' ? 0 : this.first,
                                end: this.file_info.size,
                            }
                            this.first = this.file_info.size;
                            this.p2p.send(pk, JSON.stringify(query));
                        }
                    }
                }
            }
        });

        this.ws.onmessage = (data) => {
            let m = JSON.parse(data.data);
            if (m.op === 'signal') {
                console.log(`recv signal from ${m.from}`);
                this.p2p.recv_bootstrap(m.from, m.data );
            }
        }
    }

    getUrl(files) {
        this.files = files;
        return this.prefix + '/' + this.p2p.get_hex_key().publicKey;
    }

    bootstrap(pk) {
        return this.p2p.bootstrap({pk:pk});
    }
}

