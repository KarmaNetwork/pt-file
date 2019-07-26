import P2P from './connection.js'

export default class FileTransfer {
    constructor( prefix, sender ) {
        this.prefix = prefix;

        this.ws = new WebSocket('ws://127.0.0.1:3000/bootstrap');
        this.first = false;
        this.p2p = new P2P( {
            handlers: {
                recv_bootstrap: (pk, data) => {
                    this.ws.send( {
                        from: this.p2p.get_hex_key().publicKey,
                        to: pk,
                        data: data,
                        op: 'signal',
                    } )
                },
                connected: (pk) => {
                    if (! sender) {
                        let file_info = {
                            op:'meta',
                        }
                        this.first = true;
                        this.p2p.send(JSON.stringify(file_info));
                    }
                },
                recv_data: (pk, data) => {
                    console.log(`receive data from ${pk}`);
                    if ( sender ) {
                        let m = JSON.parse();
                        if (m.op === 'meta') {
                            let file_info = {
                                name: this.files.name,
                                size: this.files.size,
                                type: this.files.type,
                            }
                            this.p2p.send(JSON.stringify(file_info));
                        } else if (m.op === 'query') {
                            this.onprocess(m.begin, this.files.size);
                            let segment = this.files.slice(m.begin, m.end);
                            let reader = new FileReader();
                            reader.onload( (e) => {
                                this.p2p.send(e.target.result);
                                this.onprocess(m.end, this.files.size);
                            } );
                            reader.readAsArrayBuffer(segment);
                        }
                    } else {
                        if (this.first) {
                            let m = JSON.parse(data);
                            this.file_info = m;
                        } else {

                        }
                        if (this.first >= this.file_info.size) {
                            let query = {
                                op: 'query',
                                begin: this.first === true ? 0 : this.first,
                                end: this.file_info.size,
                            }
                            this.p2p.send(JSON.stringify(query));
                        }
                    }
                }
            }
        });

        this.ws.onmessage = (data) => {
            let m = JSON.parse(data);
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

